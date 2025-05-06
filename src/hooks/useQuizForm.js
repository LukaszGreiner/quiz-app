import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { createQuiz } from "../services/quizService";
import useLocalStorage from "./useLocalStorage";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../utils/toastUtils";
import { quizFormConfig } from "../config/quizFormConfig";

export const DEFAULT_FORM_VALUES = {
  title: "Quiz bez nazwy",
  category: "Nauka",
  description: "",
  timeLimitPerQuestion: 0,
  difficulty: quizFormConfig.DEFAULT_DIFFICULTY,
  visibility: "public",
  image: null,
  questions: [
    {
      title: "placeholder",
      correctAnswer: "placeholder1",
      wrongAnswers: ["placeholder2", "placeholder3", "placeholder4"],
      image: null,
    },
  ],
};

function useQuizForm(defaultValues = DEFAULT_FORM_VALUES, onSubmit) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestoredFromStorage, setIsRestoredFromStorage] = useState(false);
  const { setItem, getItem, removeItem } = useLocalStorage();
  const { quizId } = useParams();
  const saveTimeoutRef = useRef(null);
  const initialLoadDone = useRef(false);
  const skipSaveOnce = useRef(false);
  const isEditMode = Boolean(quizId);

  const getStorageKey = useCallback(
    () => (isEditMode ? "editQuizFormState" : "createQuizFormState"),
    [isEditMode],
  );

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { control, handleSubmit, formState, reset, watch } = methods;
  const { isValid } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  // Try to restore from localStorage only once on mount
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    // Skip localStorage operations completely when editing
    if (isEditMode) {
      reset(defaultValues);
      setIsRestoredFromStorage(true);
      return;
    }

    const storageKey = getStorageKey();
    const savedForm = getItem(storageKey);

    if (savedForm && !isRestoredFromStorage) {
      try {
        reset({
          ...savedForm,
          // For main quiz image, prioritize imageUrl over image
          image: savedForm.imageUrl || savedForm.image || null,
          imageUrl: savedForm.imageUrl || null,
          // For question images, do the same
          questions:
            savedForm.questions?.map((q) => ({
              ...q,
              image: q.imageUrl || q.image || null,
              imageUrl: q.imageUrl || null,
            })) || [],
        });
        setIsRestoredFromStorage(true);
        skipSaveOnce.current = true; // skip the next save
      } catch (err) {
        console.error("Error restoring form from localStorage:", err);
      }
    } else if (defaultValues && !isRestoredFromStorage) {
      reset(defaultValues);
      setIsRestoredFromStorage(true);
      skipSaveOnce.current = true;
    }
  }, [
    getStorageKey,
    getItem,
    reset,
    defaultValues,
    isRestoredFromStorage,
    isEditMode,
  ]);

  // Watch for defaultValues changes to update form
  useEffect(() => {
    // When defaultValues changes after reset in QuizEdit
    if (defaultValues && initialLoadDone.current) {
      reset({
        ...defaultValues,
        image: defaultValues.imageUrl || null,
        imageUrl: defaultValues.imageUrl || null,
        questions:
          defaultValues.questions?.map((q) => ({
            ...q,
            image: q.imageUrl || null,
            imageUrl: q.imageUrl || null,
          })) || [],
      });
      skipSaveOnce.current = true; // Skip saving to localStorage right after reset
    }
  }, [defaultValues, reset]);

  // Debounced save to localStorage
  const saveFormToStorage = useCallback(
    (formData) => {
      // Skip saving to localStorage when editing
      if (isEditMode || !formData || !isRestoredFromStorage) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        const storageKey = getStorageKey();
        const dataToSave = {
          ...formData,
          // Don't save File objects to localStorage
          image: null,
          imageUrl: formData.imageUrl,
          questions: formData.questions?.map((q) => ({
            ...q,
            image: null,
            imageUrl: q.imageUrl,
          })),
        };

        setItem(storageKey, dataToSave);
      }, 500);
    },
    [getStorageKey, setItem, isRestoredFromStorage, isEditMode],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Watch form changes with debounced storage
  useEffect(() => {
    const subscription = watch((formData, { type }) => {
      if (!isRestoredFromStorage) return;
      if (skipSaveOnce.current) {
        skipSaveOnce.current = false;
        return;
      }

      // Autosave for new quizzes on both field changes and array modifications
      if (!isEditMode && (type === "change" || type === "array")) {
        saveFormToStorage(formData);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, saveFormToStorage, isRestoredFromStorage, isEditMode]);

  const cleanupLocalStorage = useCallback(() => {
    if (!isEditMode) {
      removeItem(getStorageKey());
    }
  }, [getStorageKey, removeItem, isEditMode]);

  const handleCreateQuiz = async (data) => {
    await createQuiz(
      data,
      currentUser,
      navigate,
      showLoading,
      updateLoadingToSuccess,
      updateLoadingToError,
      methods.reset,
    );
  };

  const handleCustomSubmit = async (data) => {
    await onSubmit(data);
  };

  const handleFormSubmit = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Execute appropriate submit handler
      if (onSubmit) {
        await handleCustomSubmit(data);
      } else {
        await handleCreateQuiz(data);
      }

      // Cleanup after successful submission
      cleanupLocalStorage();
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = useCallback(() => {
    // Clear localStorage data when resetting form for new quiz creation
    if (!isEditMode) {
      removeItem(getStorageKey());
    }

    // Create a fresh copy of default values to ensure a complete reset
    const defaultFormValues = {
      ...DEFAULT_FORM_VALUES,
      image: null,
      imageUrl: null,
      questions: [
        ...DEFAULT_FORM_VALUES.questions.map((q) => ({
          ...q,
          image: null,
          imageUrl: null,
        })),
      ],
    };

    // Reset with keepDefaultValues: false to ensure all values are updated
    reset(defaultFormValues, {
      keepDefaultValues: false,
      keepValues: false,
      keepDirtyValues: false,
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
    });

    // Prevent auto-save from immediately saving the default values
    skipSaveOnce.current = true;
  }, [reset, isEditMode, removeItem, getStorageKey]);

  const handleRestoreFromStorage = async () => {
    // Disable restore from localStorage in edit mode
    if (isEditMode) return;

    const storageKey = getStorageKey();
    const savedForm = getItem(storageKey);

    if (savedForm) {
      try {
        reset({
          ...savedForm,
          image: savedForm.imageUrl || null, // Ensure image is cleared if null
          imageUrl: savedForm.imageUrl || null,
          questions:
            savedForm.questions?.map((q) => ({
              ...q,
              image: q.imageUrl || null, // Ensure question images are cleared if null
              imageUrl: q.imageUrl || null,
            })) || [],
        });
        setIsRestoredFromStorage(true);
      } catch (err) {
        console.error("Error restoring form from localStorage:", err);
      }
    }
  };

  return {
    methods,
    fields,
    append,
    remove,
    isValid,
    isSubmitting,
    handleFormSubmit: handleSubmit(handleFormSubmit),
    handleSaveToStorage: () => saveFormToStorage(watch()),
    handleRestoreFromStorage,
    handleReset,
    watch,
  };
}

export default useQuizForm;
