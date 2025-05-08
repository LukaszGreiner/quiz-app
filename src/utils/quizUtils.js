/**
 * Quiz Utilities
 *
 * This file should contain only pure utility functions for quiz operations:
 * - Data formatting (time, scores, etc.)
 * - Data validation
 * - Data transformation
 * - Calculations
 *
 * Rules:
 * 1. Functions should be pure (same input = same output)
 * 2. No side effects (no API calls, no state changes)
 * 3. No dependencies on external services
 * 4. No direct Firebase operations
 * 5. Should be easily testable
 *
 * Examples of appropriate functions:
 * - formatQuizDuration()
 * - validateQuizData()
 * - calculateQuizScore()
 * - sortQuizzesByDate()
 */

// Format total time
export const formatTotalTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes} min ${seconds > 0 ? `${seconds} s` : ""}`
    : `${seconds} s`;
};

export const timestampToCurrentDate = (timestamp) => {
  const milliseconds =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
  const date = new Date(milliseconds);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getPlaysCountText = (quizData) => {
  return quizData?.playsCount?.toString() ?? "0";
};

export const getAvgRatingText = (quizData) => {
  if (
    !quizData ||
    typeof quizData.ratingsSum !== "number" ||
    typeof quizData.ratingsCount !== "number" ||
    quizData.ratingsCount === 0
  ) {
    return "Brak ocen";
  }
  const rawAvgRating = quizData.ratingsSum / quizData.ratingsCount;
  return rawAvgRating.toFixed(1);
};

export const getAvgScoreText = (quizData, questionsLength) => {
  if (
    !quizData ||
    typeof quizData.scoreSum !== "number" ||
    typeof quizData.playsCount !== "number" ||
    quizData.playsCount === 0 ||
    typeof questionsLength !== "number" ||
    questionsLength === 0
  ) {
    return "Brak danych";
  }
  const rawAvgScore = quizData.scoreSum / quizData.playsCount / questionsLength;
  return `${(rawAvgScore * 100).toFixed(0)}%`;
};

export const getAvgCompletionTimeText = (quizData) => {
  if (
    !quizData ||
    typeof quizData.completionTimeSum !== "number" ||
    typeof quizData.playsCount !== "number" ||
    quizData.playsCount === 0
  ) {
    return "Brak danych";
  }
  const rawAvgCompletionTimeMs =
    quizData.completionTimeSum / quizData.playsCount;
  if (rawAvgCompletionTimeMs <= 0) return "Brak danych";
  return formatTotalTime(rawAvgCompletionTimeMs / 1000); // formatTotalTime expects seconds
};
