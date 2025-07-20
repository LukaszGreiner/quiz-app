import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { streakService } from "../services/streakService";

/**
 * Custom hook for managing user streak data
 * @returns {Object} Streak data and functions
 */
export const useStreak = () => {
  const { currentUser } = useAuth();
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch streak data when component mounts or user changes
  useEffect(() => {
    const fetchStreakData = async () => {
      if (!currentUser) {
        setStreakData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const stats = await streakService.getStreakStats(currentUser.uid);
        setStreakData(stats);
      } catch (err) {
        console.error("Error fetching streak data:", err);
        setError("Failed to load streak data");
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();
  }, [currentUser]);

  // Function to manually refresh streak data
  const refreshStreakData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const stats = await streakService.getStreakStats(currentUser.uid);
      setStreakData(stats);
    } catch (err) {
      console.error("Error refreshing streak data:", err);
      setError("Failed to refresh streak data");
    } finally {
      setLoading(false);
    }
  };

  // Function to use a streak freeze
  const useStreakFreeze = async () => {
    if (!currentUser) return;

    try {
      const updatedStreak = await streakService.useStreakFreeze(currentUser.uid);
      setStreakData(prev => ({
        ...prev,
        ...updatedStreak,
        freezesRemaining: updatedStreak.maxFreezes - updatedStreak.freezesUsed,
        canUseFreeze: updatedStreak.freezesUsed < updatedStreak.maxFreezes,
      }));
      return updatedStreak;
    } catch (err) {
      console.error("Error using streak freeze:", err);
      throw err;
    }
  };

  // Function to get quiz completion calendar for a specific month
  const getQuizCalendar = async (month = new Date()) => {
    if (!currentUser) return [];

    try {
      return await streakService.getUserQuizCalendar(currentUser.uid, month);
    } catch (err) {
      console.error("Error fetching quiz calendar:", err);
      return [];
    }
  };

  // Check if user needs to complete a quiz today to maintain streak
  const needsQuizToday = () => {
    if (!streakData || !streakData.lastActivityDate) return false;

    const lastActivity = new Date(streakData.lastActivityDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // If last activity was yesterday, user needs to complete a quiz today
    const lastActivityString = lastActivity.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    return lastActivityString === yesterdayString;
  };

  // Check if streak is in danger (user missed today and yesterday)
  const isStreakInDanger = () => {
    if (!streakData || !streakData.lastActivityDate) return false;

    const lastActivity = new Date(streakData.lastActivityDate);
    const today = new Date();
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    return daysDiff > 1;
  };

  // Get motivational message based on streak status
  const getStreakMessage = () => {
    if (!streakData) return "";

    const { currentStreak } = streakData;
    
    if (currentStreak === 0) {
      return "Rozpocznij swoją przygodę z quizami już dziś! 🚀";
    } else if (currentStreak === 1) {
      return "Świetny początek! Kontynuuj dalej! 💪";
    } else if (currentStreak < 7) {
      return `${currentStreak} dni z rzędu! Budujesz świetny nawyk! 🔥`;
    } else if (currentStreak < 30) {
      return `Niesamowita passa ${currentStreak} dni! Jesteś w ogniu! 🔥💯`;
    } else {
      return `Niewiarygodna passa ${currentStreak} dni! Jesteś legendą quizów! 🏆👑`;
    }
  };

  // Check if user has completed a quiz today
  const hasCompletedQuizToday = async () => {
    if (!currentUser) return false;

    try {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      return await streakService.hasCompletedQuizToday(currentUser.uid, todayString);
    } catch (err) {
      console.error("Error checking if quiz completed today:", err);
      return false;
    }
  };

  return {
    streakData,
    loading,
    error,
    refreshStreakData,
    useStreakFreeze,
    getQuizCalendar,
    needsQuizToday,
    isStreakInDanger,
    getStreakMessage,
    hasCompletedQuizToday,
  };
};
