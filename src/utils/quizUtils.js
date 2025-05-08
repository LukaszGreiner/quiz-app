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
