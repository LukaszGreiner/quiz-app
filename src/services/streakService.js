import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { getLocalDateFromTimestamp, areConsecutiveDays, getUserLocalDate } from "../utils/dateUtils";

/**
 * Streak Service
 * 
 * Manages user daily streak functionality:
 * - Tracks consecutive days of quiz completion
 * - Updates streak data when quizzes are completed
 * - Calculates current streak and longest streak
 * - Manages streak freeze/recovery mechanics
 */

export const streakService = {
  /**
   * Get user's current streak data
   * @param {string} userId - User ID
   * @returns {Object} Streak data with currentStreak, longestStreak, lastActivityDate, etc.
   */
  async getUserStreak(userId) {
    try {
      const streakRef = doc(db, "userStreaks", userId);
      const streakDoc = await getDoc(streakRef);

      if (!streakDoc.exists()) {
        // Initialize streak data if doesn't exist
        const initialStreak = {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          streakStartDate: null,
          totalQuizDays: 0,
          freezesUsed: 0,
          maxFreezes: 3, // Allow 3 streak freezes per month
          lastFreezeReset: new Date().toISOString(),
          
          // Streak Revive System
          lastStreakLoss: null,              // When the streak was lost
          lostStreakLength: 0,               // How long the lost streak was
          revivesUsed: 0,                    // Number of revives used this month
          maxRevives: 1,                     // Allow 1 revive per month
          lastReviveReset: new Date().toISOString(),
          canRevive: false,                  // Can user revive right now?
          reviveExpiresAt: null,             // When revive opportunity expires
          
          // Recalculation tracking
          lastRecalculated: null,            // When streak was last recalculated from history
        };
        
        await setDoc(streakRef, initialStreak);
        return initialStreak;
      }

      const existingData = streakDoc.data();
      
      // Migration: Add missing revive fields if they don't exist
      const hasReviveFields = existingData.hasOwnProperty('canRevive');
      const hasRecalculatedField = existingData.hasOwnProperty('lastRecalculated');
      
      if (!hasReviveFields || !hasRecalculatedField) {
        const migratedData = {
          ...existingData,
          // Add revive fields if missing
          ...(hasReviveFields ? {} : {
            lastStreakLoss: null,
            lostStreakLength: 0,
            revivesUsed: 0,
            maxRevives: 1,
            lastReviveReset: new Date().toISOString(),
            canRevive: false,
            reviveExpiresAt: null,
          }),
          // Add recalculated field if missing
          ...(hasRecalculatedField ? {} : {
            lastRecalculated: null,
          }),
        };
        
        await updateDoc(streakRef, migratedData);
        return migratedData;
      }

      return existingData;
    } catch (error) {
      console.error("Error fetching user streak:", error);
      throw error;
    }
  },

  /**
   * Update user streak when a quiz is completed
   * @param {string} userId - User ID
   * @param {string} completedAt - ISO string of when quiz was completed
   */
  async updateStreakOnQuizCompletion(userId, completedAt) {
    try {
      const streakRef = doc(db, "userStreaks", userId);
      const streakData = await this.getUserStreak(userId);
      
      // Convert timestamps to user's local dates
      const completedDateString = getLocalDateFromTimestamp(completedAt);
      const lastActivityDateString = streakData.lastActivityDate ? getLocalDateFromTimestamp(streakData.lastActivityDate) : null;

      // Check if this is the same day as last activity
      if (lastActivityDateString === completedDateString) {
        // Update to latest time of day, but don't change streak count
        await updateDoc(streakRef, {
          lastActivityDate: completedAt
        });
        return { ...streakData, lastActivityDate: completedAt };
      }

      let newStreakData = { ...streakData };
      
      // If this is the first quiz ever
      if (!lastActivityDateString) {
        newStreakData = {
          ...newStreakData,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: completedAt,
          streakStartDate: completedAt,
          totalQuizDays: 1,
        };
      } else {
        // Check if dates are consecutive using local timezone
        const isConsecutive = areConsecutiveDays(lastActivityDateString, completedDateString);
        
        if (isConsecutive) {
          // Consecutive day - extend streak
          newStreakData.currentStreak += 1;
          newStreakData.longestStreak = Math.max(newStreakData.longestStreak, newStreakData.currentStreak);
          newStreakData.totalQuizDays += 1;
        } else {
          // Streak broken - reset but check if we should enable revive
          const daysBetween = Math.abs(new Date(completedDateString) - new Date(lastActivityDateString)) / (1000 * 60 * 60 * 24);
          
          // Enable revive if:
          // 1. Streak was lost exactly 1 day ago
          // 2. User has revives available  
          // 3. Lost streak was at least 3 days long
          if (daysBetween === 1 && 
              newStreakData.currentStreak >= 3 && 
              newStreakData.revivesUsed < newStreakData.maxRevives) {
            
            // Check if revives need to be reset (monthly)
            const lastReset = new Date(newStreakData.lastReviveReset);
            const now = new Date();
            const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                              (now.getMonth() - lastReset.getMonth());
            
            if (monthsDiff >= 1) {
              newStreakData.revivesUsed = 0;
              newStreakData.lastReviveReset = now.toISOString();
            }
            
            // Enable revive opportunity
            newStreakData.lastStreakLoss = completedAt;
            newStreakData.lostStreakLength = newStreakData.currentStreak;
            newStreakData.canRevive = newStreakData.revivesUsed < newStreakData.maxRevives;
            
            // Revive expires at end of today (only can revive yesterday's gap)
            const reviveExpiry = new Date(completedAt);
            reviveExpiry.setHours(23, 59, 59, 999); // End of today
            newStreakData.reviveExpiresAt = reviveExpiry.toISOString();
          }
          
          // Reset streak
          newStreakData.currentStreak = 1;
          newStreakData.streakStartDate = completedAt;
          newStreakData.totalQuizDays += 1;
        }
        
        newStreakData.lastActivityDate = completedAt;
      }
      
      // Update Firestore
      await updateDoc(streakRef, newStreakData);
      return newStreakData;
    } catch (error) {
      console.error("Error updating streak:", error);
      throw error;
    }
  },

  /**
   * Check if user has completed a quiz today
   * @param {string} userId - User ID
   * @param {string} dateString - Date string in YYYY-MM-DD format
   * @returns {boolean} True if user completed a quiz today
   */
  async hasCompletedQuizToday(userId, dateString) {
    try {
      // Create date range for the entire day in user's local timezone
      const startOfDay = new Date(dateString + 'T00:00:00');
      const endOfDay = new Date(dateString + 'T23:59:59');
      
      const resultsRef = collection(db, "quizResults");
      const q = query(
        resultsRef,
        where("userId", "==", userId),
        where("completedAt", ">=", startOfDay.toISOString()),
        where("completedAt", "<=", endOfDay.toISOString())
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error("Error checking daily quiz completion:", error);
      return false;
    }
  },

  /**
   * Get streak leaderboard
   * @param {number} limit - Number of top streaks to return
   * @returns {Array} Array of user streak data with usernames
   */
  async getStreakLeaderboard(limit = 10) {
    try {
      const streaksRef = collection(db, "userStreaks");
      const q = query(
        streaksRef,
        orderBy("currentStreak", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const streaks = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const streakData = docSnapshot.data();
        if (streakData.currentStreak > 0) {
          // Get username for this user
          const userRef = doc(db, "users", docSnapshot.id);
          const userDoc = await getDoc(userRef);
          const username = userDoc.exists() ? userDoc.data().username : "Unknown User";
          
          streaks.push({
            userId: docSnapshot.id,
            username,
            currentStreak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
            totalQuizDays: streakData.totalQuizDays,
          });
        }
      }
      
      // Sort by currentStreak desc, then by longestStreak desc as tiebreaker
      streaks.sort((a, b) => {
        if (b.currentStreak !== a.currentStreak) {
          return b.currentStreak - a.currentStreak;
        }
        return b.longestStreak - a.longestStreak;
      });
      
      return streaks.slice(0, limit);
    } catch (error) {
      console.error("Error fetching streak leaderboard:", error);
      return [];
    }
  },

  /**
   * Use a streak freeze to maintain streak when missing a day
   * @param {string} userId - User ID
   * @returns {Object} Updated streak data
   */
  async useStreakFreeze(userId) {
    try {
      const streakData = await this.getUserStreak(userId);
      
      // Check if user has freezes available
      if (streakData.freezesUsed >= streakData.maxFreezes) {
        throw new Error("Brak dostępnych zamrożeń passy");
      }
      
      // Reset freezes if it's been a month since last reset
      const lastReset = new Date(streakData.lastFreezeReset);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                        (now.getMonth() - lastReset.getMonth());
      
      let newStreakData = { ...streakData };
      
      if (monthsDiff >= 1) {
        newStreakData.freezesUsed = 0;
        newStreakData.lastFreezeReset = now.toISOString();
      }
      
      // Use a freeze
      newStreakData.freezesUsed += 1;
      newStreakData.lastActivityDate = now.toISOString(); // Extend streak
      
      const streakRef = doc(db, "userStreaks", userId);
      await updateDoc(streakRef, newStreakData);
      
      return newStreakData;
    } catch (error) {
      console.error("Error using streak freeze:", error);
      throw error;
    }
  },

  /**
   * Revive a lost streak if user is eligible
   * @param {string} userId - User ID
   * @returns {Object} Updated streak data
   */
  async reviveStreak(userId) {
    try {
      const streakData = await this.getUserStreak(userId);
      
      // Check if user can revive
      if (!streakData.canRevive) {
        throw new Error("Nie możesz teraz przywrócić passy");
      }
      
      // Check if revive has expired (check if it's past end of today)
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      if (streakData.canRevive && now > endOfDay) {
        throw new Error("Czas na przywrócenie passy już minął");
      }
      
      // Revive the streak
      const updatedData = {
        ...streakData,
        currentStreak: streakData.lostStreakLength,
        canRevive: false,
        reviveExpiresAt: null,
        revivesUsed: streakData.revivesUsed + 1,
        lastActivityDate: new Date().toISOString(), // Set today as last activity
      };
      
      const streakRef = doc(db, "userStreaks", userId);
      await updateDoc(streakRef, updatedData);
      
      return updatedData;
    } catch (error) {
      console.error("Error reviving streak:", error);
      throw error;
    }
  },

  /**
   * Cleanup expired revive opportunities
   * @param {string} userId - User ID
   * @returns {Object} Updated streak data if changes were made
   */
  async cleanupExpiredRevives(userId) {
    try {
      const streakData = await this.getUserStreak(userId);
      
      // Check if revive has expired (check if we're past end of day when streak was lost)
      if (streakData.canRevive) {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        // If we're past end of today, the revive opportunity has expired
        if (now > endOfDay) {
          const updatedData = {
            ...streakData,
            canRevive: false,
            reviveExpiresAt: null,
            lastStreakLoss: null,
            lostStreakLength: 0,
          };
          
          const streakRef = doc(db, "userStreaks", userId);
          await updateDoc(streakRef, updatedData);
          
          return updatedData;
        }
      }
      
      return streakData;
    } catch (error) {
      console.error("Error cleaning up expired revives:", error);
      throw error;
    }
  },

  /**
   * Reset monthly revive count (called automatically on streak checks)
   * @param {string} userId - User ID
   * @returns {Object} Updated streak data if reset occurred
   */
  async resetMonthlyRevives(userId) {
    try {
      const streakData = await this.getUserStreak(userId);
      const lastReset = new Date(streakData.lastReviveReset);
      const now = new Date();
      
      const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                        (now.getMonth() - lastReset.getMonth());
      
      if (monthsDiff >= 1) {
        const updatedData = {
          ...streakData,
          revivesUsed: 0,
          lastReviveReset: now.toISOString(),
        };
        
        const streakRef = doc(db, "userStreaks", userId);
        await updateDoc(streakRef, updatedData);
        
        return updatedData;
      }
      
      return streakData;
    } catch (error) {
      console.error("Error resetting monthly revives:", error);
      throw error;
    }
  },

  /**
   * Get streak statistics for a user
   * @param {string} userId - User ID
   * @param {boolean} forceRecalculate - Whether to force recalculation from quiz history
   * @returns {Object} Comprehensive streak statistics
   */
  async getStreakStats(userId, forceRecalculate = false) {
    try {
      // First cleanup any expired revives
      let streakData = await this.cleanupExpiredRevives(userId);
      
      // Recalculate streak if forced or if streak seems potentially outdated
      const needsRecalculation = forceRecalculate || 
        !streakData.lastRecalculated || 
        (new Date() - new Date(streakData.lastRecalculated)) > (24 * 60 * 60 * 1000); // 24 hours
      
      if (needsRecalculation) {
        try {
          const recalculatedStreak = await this.recalculateStreakFromHistory(userId);
          console.log("Streak recalculated:", recalculatedStreak);
          
          // Update streakData with recalculated values
          streakData = {
            ...streakData,
            currentStreak: recalculatedStreak.currentStreak,
            longestStreak: recalculatedStreak.longestStreak,
            lastActivityDate: recalculatedStreak.lastActivityDate,
            totalQuizDays: recalculatedStreak.totalQuizDays,
            streakStartDate: recalculatedStreak.streakStartDate,
            lastRecalculated: new Date().toISOString()
          };
          
          // Update the database with the recalculated flag
          const streakRef = doc(db, "userStreaks", userId);
          await updateDoc(streakRef, { lastRecalculated: streakData.lastRecalculated });
        } catch (recalcError) {
          console.warn("Failed to recalculate streak, using database values:", recalcError);
          // Continue with original streakData if recalculation fails
        }
      }
      
      const currentMonth = new Date();
      const calendarDates = await this.getUserQuizCalendar(userId, currentMonth);
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate streak percentage for current month
      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
      const currentDay = Math.min(currentMonth.getDate(), daysInMonth);
      const monthlyPercentage = calendarDates.length > 0 ? (calendarDates.length / currentDay) * 100 : 0;
      
      return {
        ...streakData,
        monthlyCompletionDates: calendarDates,
        monthlyPercentage: Math.round(monthlyPercentage),
        canUseFreeze: streakData.freezesUsed < streakData.maxFreezes,
        freezesRemaining: streakData.maxFreezes - streakData.freezesUsed,
        hasCompletedToday: await this.hasCompletedQuizToday(userId, today),
      };
    } catch (error) {
      console.error("Error fetching streak stats:", error);
      throw error;
    }
  },

  /**
   * Debug function to check streak status and recent completions
   * @param {string} userId - User ID
   * @returns {Object} Debug information
   */
  async debugStreakStatus(userId) {
    try {
      const streakData = await this.getUserStreak(userId);
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      // Get recent quiz results - remove orderBy to avoid index requirement
      const resultsRef = collection(db, "quizResults");
      const q = query(
        resultsRef,
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const recentResults = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        recentResults.push({
          id: docSnapshot.id,
          quizTitle: data.quizTitle,
          completedAt: data.completedAt,
          score: data.score,
          totalQuestions: data.totalQuestions,
          dateString: new Date(data.completedAt).toISOString().split('T')[0],
        });
      });
      
      // Sort by completedAt in JavaScript
      recentResults.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      
      return {
        streakData,
        todayString,
        recentResults: recentResults.slice(0, 5), // Last 5 results
        hasCompletedToday: await this.hasCompletedQuizToday(userId, todayString)
      };
    } catch (error) {
      console.error("Error in debug streak status:", error);
      return { error: error.message };
    }
  },

  /**
   * Recalculate user streak based on quiz history (using local timezone)
   * Use this to fix timezone-related streak issues
   * @param {string} userId - User ID
   * @returns {Object} Updated streak data
   */
  async recalculateStreakFromHistory(userId) {
    try {
      console.log("Recalculating streak for user:", userId);
      
      // Get all quiz results for user, ordered by completion date
      const resultsRef = collection(db, "quizResults");
      const q = query(
        resultsRef,
        where("userId", "==", userId),
        orderBy("completedAt", "asc")
      );
      
      const snapshot = await getDocs(q);
      const quizResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (quizResults.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
      }
      
      // Group quizzes by local date
      const quizzesByDate = {};
      quizResults.forEach(quiz => {
        const localDate = getLocalDateFromTimestamp(quiz.completedAt);
        if (!quizzesByDate[localDate]) {
          quizzesByDate[localDate] = [];
        }
        quizzesByDate[localDate].push(quiz);
      });
      
      // Get sorted unique dates
      const uniqueDates = Object.keys(quizzesByDate).sort();
      console.log("Quiz dates found:", uniqueDates);
      
      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 1; // Start with 1 for first date
      
      // Start from the most recent date and work backwards for current streak
      const today = getUserLocalDate();
      const mostRecentDate = uniqueDates[uniqueDates.length - 1];
      
      console.log("Today:", today, "Most recent date:", mostRecentDate);
      
      // Check if user played today (current streak continues)
      if (mostRecentDate === today) {
        console.log("User played today - calculating current streak");
        currentStreak = 1;
        
        // Count backwards from most recent date
        for (let i = uniqueDates.length - 2; i >= 0; i--) {
          const nextDate = uniqueDates[i + 1];  // More recent date
          const currentDate = uniqueDates[i];   // Earlier date
          
          console.log(`Checking: ${currentDate} → ${nextDate}`);
          
          if (areConsecutiveDays(currentDate, nextDate)) {
            currentStreak++;
            console.log(`Consecutive! Current streak: ${currentStreak}`);
          } else {
            console.log("Streak broken");
            break; // Streak broken
          }
        }
      } else {
        // User didn't play today - check if they played yesterday
        if (areConsecutiveDays(mostRecentDate, today)) {
          console.log("User played yesterday - streak still valid");
          currentStreak = 1;
          
          // Count backwards from most recent date
          for (let i = uniqueDates.length - 2; i >= 0; i--) {
            const nextDate = uniqueDates[i + 1];
            const currentDate = uniqueDates[i];
            
            if (areConsecutiveDays(currentDate, nextDate)) {
              currentStreak++;
            } else {
              break;
            }
          }
        } else {
          console.log("Streak is broken - user didn't play today or yesterday");
          currentStreak = 0;
        }
      }
      
      // Calculate longest streak
      tempStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = uniqueDates[i - 1];
        const currDate = uniqueDates[i];
        
        if (areConsecutiveDays(prevDate, currDate)) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      
      console.log(`Recalculated streak - Current: ${currentStreak}, Longest: ${longestStreak}`);
      
      // Update streak data
      const streakRef = doc(db, "userStreaks", userId);
      const updatedData = {
        currentStreak,
        longestStreak,
        lastActivityDate: quizResults[quizResults.length - 1].completedAt,
        totalQuizDays: uniqueDates.length,
        streakStartDate: currentStreak > 0 ? quizResults[quizResults.length - currentStreak].completedAt : null,
        lastRecalculated: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(streakRef, updatedData);
      console.log("Streak updated successfully");
      
      return updatedData;
    } catch (error) {
      console.error("Error recalculating streak:", error);
      throw error;
    }
  },

  /**
   * Get user's quiz completion dates for a specific month
   * @param {string} userId - User ID
   * @param {Date} month - Month to get calendar for
   * @returns {Array} Array of date strings in YYYY-MM-DD format
   */
  async getUserQuizCalendar(userId, month = new Date()) {
    try {
      const year = month.getFullYear();
      const monthNumber = month.getMonth();
      
      // Get start and end of month
      const startOfMonth = new Date(year, monthNumber, 1);
      const endOfMonth = new Date(year, monthNumber + 1, 0, 23, 59, 59, 999);
      
      // Query quiz results for the month
      const resultsRef = collection(db, "quizResults");
      const q = query(
        resultsRef,
        where("userId", "==", userId),
        where("completedAt", ">=", startOfMonth.toISOString()),
        where("completedAt", "<=", endOfMonth.toISOString())
      );
      
      const querySnapshot = await getDocs(q);
      const completionDates = new Set();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const completedDate = getLocalDateFromTimestamp(data.completedAt);
        completionDates.add(completedDate);
      });
      
      return Array.from(completionDates).sort();
    } catch (error) {
      console.error("Error fetching user quiz calendar:", error);
      return [];
    }
  },
};
