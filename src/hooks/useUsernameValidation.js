import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { quizFormConfig } from "../config/quizFormConfig";
import { useAuth } from "../context/AuthContext";

export const useUsernameValidation = (initialUsername = "") => {
  const [username, setUsername] = useState(initialUsername);
  const [isChecking, setIsChecking] = useState(false);
  const [validationState, setValidationState] = useState({
    isValid: false,
    error: null,
    isAvailable: null,
    showFeedback: false,
  });
  const { currentUser } = useAuth();

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState(null);

  const validateUsername = useCallback(
    async (usernameValue, skipAvailabilityCheck = false) => {
      const trimmedUsername = usernameValue.trim();

      // Reset state
      setValidationState((prev) => ({
        ...prev,
        error: null,
        isAvailable: null,
      }));

      // Check if empty
      if (!trimmedUsername) {
        setValidationState({
          isValid: false,
          error: null,
          isAvailable: null,
          showFeedback: false,
        });
        return { isValid: false, error: null };
      }

      // Check minimum length
      if (trimmedUsername.length < quizFormConfig.MIN_USERNAME_LENGTH) {
        const error = `Nazwa użytkownika musi mieć co najmniej ${quizFormConfig.MIN_USERNAME_LENGTH} znaki`;
        setValidationState({
          isValid: false,
          error,
          isAvailable: null,
          showFeedback: true,
        });
        return { isValid: false, error };
      }

      // Check maximum length
      if (trimmedUsername.length > quizFormConfig.MAX_USERNAME_LENGTH) {
        const error = `Nazwa użytkownika może mieć maksymalnie ${quizFormConfig.MAX_USERNAME_LENGTH} znaków`;
        setValidationState({
          isValid: false,
          error,
          isAvailable: null,
          showFeedback: true,
        });
        return { isValid: false, error };
      }

      // Check for valid characters (letters, numbers, underscores, hyphens)
      const validCharacters = /^[a-zA-Z0-9_-]+$/;
      if (!validCharacters.test(trimmedUsername)) {
        const error =
          "Nazwa użytkownika może zawierać tylko litery, cyfry, podkreślenia i myślniki";
        setValidationState({
          isValid: false,
          error,
          isAvailable: null,
          showFeedback: true,
        });
        return { isValid: false, error };
      }

      // Skip availability check if requested or if it's the current user's username
      if (
        skipAvailabilityCheck ||
        (currentUser && trimmedUsername === initialUsername)
      ) {
        setValidationState({
          isValid: true,
          error: null,
          isAvailable: true,
          showFeedback: true,
        });
        return { isValid: true, error: null };
      }

      // Check availability in Firestore
      setIsChecking(true);
      try {
        const q = query(
          collection(db, "users"),
          where("username", "==", trimmedUsername),
        );
        const querySnapshot = await getDocs(q);
        const isAvailable = querySnapshot.empty;

        const error = isAvailable
          ? null
          : "Ta nazwa użytkownika jest już zajęta";
        setValidationState({
          isValid: isAvailable,
          error,
          isAvailable,
          showFeedback: true,
        });

        return { isValid: isAvailable, error };
      } catch (err) {
        console.error("Error checking username availability:", err);
        const error = "Błąd podczas sprawdzania dostępności nazwy";
        setValidationState({
          isValid: false,
          error,
          isAvailable: null,
          showFeedback: true,
        });
        return { isValid: false, error };
      } finally {
        setIsChecking(false);
      }
    },
    [currentUser, initialUsername],
  );

  const handleUsernameChange = useCallback(
    (newUsername) => {
      setUsername(newUsername);

      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Show immediate feedback for length issues
      if (newUsername.trim().length > quizFormConfig.MAX_USERNAME_LENGTH) {
        setValidationState({
          isValid: false,
          error: `Nazwa użytkownika może mieć maksymalnie ${quizFormConfig.MAX_USERNAME_LENGTH} znaków`,
          isAvailable: null,
          showFeedback: true,
        });
        return;
      }

      // Set new timer for availability check
      const timer = setTimeout(() => {
        validateUsername(newUsername);
      }, 500); // 500ms debounce

      setDebounceTimer(timer);
    },
    [debounceTimer, validateUsername],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Manual validation function (for form submission)
  const validateForSubmission = useCallback(() => {
    return validateUsername(username, false);
  }, [username, validateUsername]);

  return {
    username,
    setUsername: handleUsernameChange,
    isChecking,
    validationState,
    validateForSubmission,
    validateUsername: (value) => validateUsername(value, false),
  };
};
