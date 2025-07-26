import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { streakService } from "../services/streakService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Custom hook for managing user streak data
 * @returns {Object} Streak data and functions
 */
export const useStreak = () => {
  const { currentUser } = useAuth();
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple localStorage cache for daily data
  const getCachedStreakData = (userId) => {
    try {
      const cached = localStorage.getItem(`streak_${userId}`);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const today = new Date().toDateString();
      
      // Cache is valid if it's from today (streak only changes once per day)
      if (data.cacheDate === today) {
        return data.streakData;
      }
      return null;
    } catch {
      return null;
    }
  };

  const cacheStreakData = (userId, data) => {
    try {
      localStorage.setItem(`streak_${userId}`, JSON.stringify({
        streakData: data,
        cacheDate: new Date().toDateString()
      }));
    } catch {
      console.error("Failed to cache streak data");
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setStreakData(null);
      return;
    }

    // Show cached data immediately if available from today
    const cachedData = getCachedStreakData(currentUser.uid);
    if (cachedData) {
      setStreakData(cachedData);
      return; // Don't fetch again, cache is valid for the whole day
    }

    // Fetch fresh data only if no valid cache
    const fetchStreakData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const stats = await streakService.getStreakStats(currentUser.uid);
        setStreakData(stats);
        cacheStreakData(currentUser.uid, stats);
      } catch (err) {
        console.error("Error fetching streak data:", err);
        setError("Failed to load streak data");
        // Show 0 streak on error
        setStreakData({ currentStreak: 0, longestStreak: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStreakData();

    // Listen for custom events to refresh streak data across all hook instances
    const handleStreakUpdate = (event) => {
      if (event.detail && event.detail.userId === currentUser.uid) {
        console.log("Received streak update event", event.detail);
        setStreakData(event.detail.streakData);
        cacheStreakData(currentUser.uid, event.detail.streakData);
      }
    };

    window.addEventListener('streakDataUpdated', handleStreakUpdate);

    return () => {
      window.removeEventListener('streakDataUpdated', handleStreakUpdate);
    };
  }, [currentUser]);

  // Function to manually refresh streak data (called after quiz completion)
  const refreshStreakData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const stats = await streakService.getStreakStats(currentUser.uid);
      setStreakData(stats);
      cacheStreakData(currentUser.uid, stats); // Update cache with new data
      
      // Broadcast update to all other hook instances
      broadcastStreakUpdate(stats);
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

  // Function to revive a lost streak
  const reviveStreak = async () => {
    if (!currentUser) return;

    try {
      const updatedStreak = await streakService.reviveStreak(currentUser.uid);
      
      // Clear cache to ensure fresh data
      localStorage.removeItem(`streak_${currentUser.uid}`);
      
      setStreakData(prev => ({
        ...prev,
        ...updatedStreak,
      }));
      
      // Update cache with new data
      cacheStreakData(currentUser.uid, updatedStreak);
      
      // Broadcast update to all other hook instances
      broadcastStreakUpdate(updatedStreak);
      
      return updatedStreak;
    } catch (err) {
      console.error("Error reviving streak:", err);
      throw err;
    }
  };

  // Development helper function to simulate streak loss for testing
  const simulateStreakLoss = async () => {
    if (!currentUser || process.env.NODE_ENV !== 'development') return;

    try {
      const streakRef = doc(db, "userStreaks", currentUser.uid);
      const streakData = await streakService.getUserStreak(currentUser.uid);
      
      // Simulate a lost streak
      const now = new Date();
      const reviveExpiry = new Date(now);
      reviveExpiry.setHours(reviveExpiry.getHours() + 48);
      
      const updatedData = {
        ...streakData,
        currentStreak: 0,
        lastStreakLoss: now.toISOString(),
        lostStreakLength: Math.max(streakData.currentStreak, 5), // Ensure at least 5 day streak
        canRevive: true,
        reviveExpiresAt: reviveExpiry.toISOString(),
        revivesUsed: 0, // Reset for testing
      };
      
      await updateDoc(streakRef, updatedData);
      
      // Clear cache to ensure fresh data is loaded
      localStorage.removeItem(`streak_${currentUser.uid}`);
      
      // Update local state and cache
      setStreakData(updatedData);
      cacheStreakData(currentUser.uid, updatedData);
      
      // Broadcast update to all other hook instances
      broadcastStreakUpdate(updatedData);
      
      console.log("Simulated streak loss for testing", updatedData);
      return updatedData;
    } catch (err) {
      console.error("Error simulating streak loss:", err);
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

  // Function to broadcast streak updates to all hook instances
  const broadcastStreakUpdate = (streakData) => {
    if (!currentUser) return;
    
    const event = new CustomEvent('streakDataUpdated', {
      detail: {
        userId: currentUser.uid,
        streakData: streakData
      }
    });
    window.dispatchEvent(event);
  };

  // Function to force recalculation of streak from quiz history
  const recalculateStreak = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      
      // Force recalculation by calling getStreakStats with forceRecalculate=true
      const stats = await streakService.getStreakStats(currentUser.uid, true);
      
      // Clear cache to ensure fresh data
      localStorage.removeItem(`streak_${currentUser.uid}`);
      
      setStreakData(stats);
      cacheStreakData(currentUser.uid, stats);
      
      // Broadcast update to all other hook instances
      broadcastStreakUpdate(stats);
      
      console.log("Streak recalculated successfully:", stats);
      return stats;
    } catch (err) {
      console.error("Error recalculating streak:", err);
      setError("Failed to recalculate streak");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Debug function to clear cache and force fresh data
  const clearCache = () => {
    if (!currentUser) return;
    
    localStorage.removeItem(`streak_${currentUser.uid}`);
    console.log("Cache cleared for user:", currentUser.uid);
  };

  return {
    streakData,
    loading,
    error,
    refreshStreakData,
    useStreakFreeze,
    reviveStreak,
    simulateStreakLoss,
    getQuizCalendar,
    needsQuizToday,
    isStreakInDanger,
    getStreakMessage,
    hasCompletedQuizToday,
    recalculateStreak,
    clearCache,
  };
};
