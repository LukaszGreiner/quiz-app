/**
 * Statistics Service
 *
 * Service for fetching and processing statistics data from Firebase collections
 * - Global quiz statistics
 * - User performance analytics
 * - Category-based analytics
 * - Trending quizzes
 */

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { quizFormConfig } from "../config/quizFormConfig";

// Fetch global platform statistics
export const fetchGlobalStatistics = async () => {
  try {
    // Get all quizzes
    const quizzesRef = collection(db, "quizzes");
    const quizzesSnapshot = await getDocs(quizzesRef);
    const quizzes = quizzesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
w
    // Get all quiz results
    const resultsRef = collection(db, "quizResults");
    const resultsSnapshot = await getDocs(resultsRef);
    const results = resultsSnapshot.docs.map((doc) => doc.data());

    // Get all users count
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const totalUsers = usersSnapshot.size;

    // Calculate global statistics
    const totalQuizzes = quizzes.length;
    const totalPlays = results.length;
    const totalQuestions = quizzes.reduce(
      (sum, quiz) => sum + (quiz.questions?.length || 0),
      0,
    );

    // Calculate category distribution
    const categoryStats = quizFormConfig.QUIZ_CATEGORIES.map((category) => {
      const categoryQuizzes = quizzes.filter(
        (quiz) => quiz.category === category,
      );
      return {
        category,
        count: categoryQuizzes.length,
        percentage:
          totalQuizzes > 0
            ? ((categoryQuizzes.length / totalQuizzes) * 100).toFixed(1)
            : 0,
      };
    }).sort((a, b) => b.count - a.count);

    // Calculate difficulty distribution
    const difficultyStats = Object.keys(quizFormConfig.DIFFICULTY_LEVELS).map(
      (difficulty) => {
        const difficultyQuizzes = quizzes.filter(
          (quiz) => quiz.difficulty === difficulty,
        );
        return {
          difficulty,
          label: quizFormConfig.DIFFICULTY_LEVELS[difficulty],
          count: difficultyQuizzes.length,
          percentage:
            totalQuizzes > 0
              ? ((difficultyQuizzes.length / totalQuizzes) * 100).toFixed(1)
              : 0,
        };
      },
    );
    return {
      totalQuizzes,
      totalUsers,
      totalPlays,
      totalQuestions,
      categoryStats,
      difficultyStats,
    };
  } catch (error) {
    console.error("Error fetching global statistics:", error);
    // Return default values instead of throwing
    return {
      totalQuizzes: 0,
      totalUsers: 0,
      totalPlays: 0,
      totalQuestions: 0,
      categoryStats: [],
      difficultyStats: [],
    };
  }
};

// Fetch top performing quizzes
export const fetchTopQuizzes = async (limitCount = 10) => {
  try {
    const quizzesRef = collection(db, "quizzes");
    const q = query(quizzesRef, where("visibility", "==", "public"));

    const snapshot = await getDocs(q);
    const quizzes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Sort by playsCount in JavaScript and limit results
    return quizzes
      .sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0))
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching top quizzes:", error);
    return []; // Return empty array instead of throwing
  }
};

// Fetch user statistics
export const fetchUserStatistics = async (userId) => {
  try {
    // Get user's created quizzes
    const userQuizzesRef = collection(db, "quizzes");
    const userQuizzesQuery = query(
      userQuizzesRef,
      where("authorId", "==", userId),
    );
    const userQuizzesSnapshot = await getDocs(userQuizzesQuery);
    const userQuizzes = userQuizzesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get user's quiz results
    const resultsRef = collection(db, "quizResults");
    const resultsQuery = query(resultsRef, where("userId", "==", userId));
    const resultsSnapshot = await getDocs(resultsQuery);
    const userResults = resultsSnapshot.docs.map((doc) => doc.data());

    // Calculate user statistics
    const totalQuizzesCreated = userQuizzes.length;
    const totalQuizzesCompleted = userResults.length;

    // Calculate total plays on user's quizzes
    const totalPlaysOnUserQuizzes = userQuizzes.reduce(
      (sum, quiz) => sum + (quiz.playsCount || 0),
      0,
    );

    // Calculate average score
    const totalScore = userResults.reduce(
      (sum, result) => sum + result.score,
      0,
    );
    const averageScore =
      userResults.length > 0 ? (totalScore / userResults.length).toFixed(1) : 0;

    // Calculate average completion time
    const totalCompletionTime = userResults.reduce(
      (sum, result) => sum + (result.completionTimeinMs || 0),
      0,
    );
    const averageCompletionTime =
      userResults.length > 0
        ? Math.floor(totalCompletionTime / userResults.length)
        : 0;

    // Get recent activity (last 5 quiz attempts)
    const recentActivity = userResults
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
      .map((result) => ({
        ...result,
        percentage: ((result.score / result.totalQuestions) * 100).toFixed(0),
      }));

    // Calculate category performance
    const categoryPerformance = {};
    for (const result of userResults) {
      // Find the quiz to get its category
      const quiz =
        userQuizzes.find((q) => q.id === result.quizId) ||
        (await getQuizCategory(result.quizId));

      if (quiz && quiz.category) {
        if (!categoryPerformance[quiz.category]) {
          categoryPerformance[quiz.category] = {
            totalAttempts: 0,
            totalScore: 0,
            totalQuestions: 0,
          };
        }
        categoryPerformance[quiz.category].totalAttempts++;
        categoryPerformance[quiz.category].totalScore += result.score;
        categoryPerformance[quiz.category].totalQuestions +=
          result.totalQuestions;
      }
    }

    // Convert category performance to array with percentages
    const categoryStats = Object.entries(categoryPerformance)
      .map(([category, stats]) => ({
        category,
        attempts: stats.totalAttempts,
        averagePercentage: (
          (stats.totalScore / stats.totalQuestions) *
          100
        ).toFixed(1),
      }))
      .sort((a, b) => b.attempts - a.attempts); // Sort by attempts count to find favorite

    // Find favorite category (most attempted)
    const favoriteCategory = categoryStats.length > 0 ? categoryStats[0].category : "Brak danych";

    // Get current streak data (not longest, but current)
    let currentStreak = 0;
    try {
      const streakRef = doc(db, "userStreaks", userId);
      const streakDoc = await getDoc(streakRef);
      if (streakDoc.exists()) {
        const streakData = streakDoc.data();
        currentStreak = streakData.currentStreak || 0;
      }
    } catch (error) {
      console.error("Error fetching user streak data:", error);
    }

    return {
      totalQuizzesCreated,
      totalQuizzesCompleted,
      totalPlaysOnUserQuizzes,
      averageScore,
      averageCompletionTime,
      recentActivity,
      categoryStats,
      favoriteCategory,
      currentStreak, // Changed from longestStreak to currentStreak
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw error;
  }
};

// Helper function to get quiz category by ID
const getQuizCategory = async (quizId) => {
  try {
    const quizDoc = await getDoc(doc(db, "quizzes", quizId));
    return quizDoc.exists() ? quizDoc.data() : null;
  } catch (error) {
    console.error("Error fetching quiz category:", error);
    return null;
  }
};

// Fetch category-specific statistics
export const fetchCategoryStatistics = async () => {
  try {
    const quizzesRef = collection(db, "quizzes");
    const snapshot = await getDocs(quizzesRef);
    const quizzes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const categoryStats = quizFormConfig.QUIZ_CATEGORIES.map((category) => {
      const categoryQuizzes = quizzes.filter(
        (quiz) => quiz.category === category,
      );

      const totalPlays = categoryQuizzes.reduce(
        (sum, quiz) => sum + (quiz.playsCount || 0),
        0,
      );
      const averageRating =
        categoryQuizzes.length > 0
          ? categoryQuizzes.reduce((sum, quiz) => {
              const rating =
                quiz.ratingsCount > 0 ? quiz.ratingsSum / quiz.ratingsCount : 0;
              return sum + rating;
            }, 0) / categoryQuizzes.length
          : 0;

      return {
        category,
        totalQuizzes: categoryQuizzes.length,
        totalPlays,
        averageRating: averageRating.toFixed(1),
        quizzes: categoryQuizzes
          .sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0))
          .slice(0, 3), // Top 3 quizzes in category
      };
    }).filter((stat) => stat.totalQuizzes > 0);

    return categoryStats;
  } catch (error) {
    console.error("Error fetching category statistics:", error);
    return []; // Return empty array instead of throwing
  }
};

// Fetch recent activity across platform
export const fetchRecentActivity = async (limitCount = 20) => {
  try {
    const resultsRef = collection(db, "quizResults");

    // Try to get results with ordering, fall back to simple query if index not available
    let results = [];
    try {
      const q = query(
        resultsRef,
        orderBy("completedAt", "desc"),
        limit(limitCount),
      );
      const snapshot = await getDocs(q);
      results = snapshot.docs.map((doc) => doc.data());
    } catch {
      // If ordering fails due to missing index, get all results and sort in JavaScript
      console.warn(
        "Index not available for ordering, falling back to client-side sorting",
      );
      const snapshot = await getDocs(resultsRef);
      const allResults = snapshot.docs.map((doc) => doc.data());
      results = allResults
        .filter((result) => result.completedAt) // Only include results with completedAt
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, limitCount);
    }

    // Enrich with quiz titles if needed
    return results.map((result) => ({
      ...result,
      percentage: ((result.score / result.totalQuestions) * 100).toFixed(0),
    }));
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return []; // Return empty array instead of throwing
  }
};

// Fetch user quiz history with quiz titles
export const fetchUserQuizHistory = async (userId, limitCount = 10) => {
  try {
    // Get user's quiz results
    const resultsRef = collection(db, "quizResults");
    const resultsQuery = query(resultsRef, where("userId", "==", userId));
    const resultsSnapshot = await getDocs(resultsQuery);
    const userResults = resultsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by completion date (newest first)
    const sortedResults = userResults
      .filter((result) => result.completedAt) // Only include results with completedAt
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limitCount);

    // Enrich with quiz titles
    const enrichedHistory = await Promise.all(
      sortedResults.map(async (result) => {
        try {
          // Try to get quiz title
          const quizDoc = await getDoc(doc(db, "quizzes", result.quizId));
          const quizTitle = quizDoc.exists() ? quizDoc.data().title : null;

          return {
            ...result,
            quizTitle,
            percentage: ((result.score / result.totalQuestions) * 100).toFixed(0),
          };
        } catch (error) {
          console.error(`Error fetching quiz title for ${result.quizId}:`, error);
          return {
            ...result,
            quizTitle: null,
            percentage: ((result.score / result.totalQuestions) * 100).toFixed(0),
          };
        }
      })
    );

    return enrichedHistory;
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    throw error;
  }
};

// Debug functions for testing and development
export const deleteQuizResult = async (resultId) => {
  try {
    await deleteDoc(doc(db, "quizResults", resultId));
    console.log("Quiz result deleted:", resultId);
  } catch (error) {
    console.error("Error deleting quiz result:", error);
    throw error;
  }
};

export const addDebugQuizResult = async (userId, quizData) => {
  try {
    const debugResult = {
      userId: userId,
      quizId: quizData.quizId || "debug-quiz",
      score: quizData.score || 5,
      totalQuestions: quizData.totalQuestions || 10,
      completedAt: quizData.completedAt || new Date().toISOString(),
      timeSpent: quizData.timeSpent || 120, // 2 minutes
      category: quizData.category || "debug",
      difficulty: quizData.difficulty || "medium",
      answers: quizData.answers || [],
      xpEarned: quizData.xpEarned || 50,
      // Mark as debug entry
      isDebugEntry: true,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, "quizResults"), debugResult);
    console.log("Debug quiz result added:", docRef.id);
    return { id: docRef.id, ...debugResult };
  } catch (error) {
    console.error("Error adding debug quiz result:", error);
    throw error;
  }
};
