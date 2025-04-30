import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSave, FaTrash } from "react-icons/fa";

// Local imports
import { useAuth } from "../../context/AuthContext";
import {
  showLoading,
  updateLoadingToSuccess,
  updateLoadingToError,
} from "../../utils/toastUtils";
import { quizFormConfig } from "../../config/quizFormConfig";
import { createQuiz, fetchQuizById } from "../../services/quizService";
import useLocalStorage from "../../hooks/useLocalStorage";

// Component imports
import QuizHeader from "./QuizHeader";
import QuizDetails from "./QuizDetails";
import QuestionList from "./QuestionList";
import ScrollToTopButton from "./ScrollToTopButton";

// Default form values for new quizzes
const DEFAULT_FORM_VALUES = {
  title: "Quiz bez nazwy",
  category: "Wiedza ogólna",
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

/**
 * Sanitizes form data to ensure image fields are safe
 * @param {Object} formData - Form data to sanitize
 * @returns {Object} Sanitized form data
 */
const sanitizeFormData = (formData) => {
  if (!formData) return null;

  // Deep clone the object to avoid mutations
  const sanitized = JSON.parse(JSON.stringify(formData));

  // Set main quiz image to null if it's not a valid image
  if (
    sanitized.image &&
    typeof sanitized.image === "object" &&
    Object.keys(sanitized.image).length === 0
  ) {
    sanitized.image = null;
  }

  // Set question images to null if they're not valid images
  if (sanitized.questions && Array.isArray(sanitized.questions)) {
    sanitized.questions = sanitized.questions.map((question) => {
      if (
        question.image &&
        typeof question.image === "object" &&
        Object.keys(question.image).length === 0
      ) {
        return { ...question, image: null };
      }
      return question;
    });
  }

  return sanitized;
};

/**
 * QuizForm component for creating or editing quizzes
 * @param {Object} props
 * @param {Object} [props.defaultValues] - Initial form values for editing
 * @param {Function} [props.onSubmit] - Custom submit handler
 */
const QuizForm = ({ defaultValues, onSubmit }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Storage key based on form mode
  const storageKey = `quizForm_${quizId ? "edit" : "new"}`;

  // Use our custom localStorage hook with sanitization
  const [storedFormData, setStoredFormData, clearStoredFormData] =
    useLocalStorage(storageKey, null);

  // Sanitize stored form data
  const sanitizedStoredData = sanitizeFormData(storedFormData);

  // Initialize react-hook-form with either defaultValues, sanitized stored data, or defaults
  const methods = useForm({
    defaultValues: defaultValues || sanitizedStoredData || DEFAULT_FORM_VALUES,
  });

  const { control, handleSubmit, formState, reset, watch } = methods;
  const { isValid } = formState;

  // Manage questions array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  /**
   * Fetches quiz data from server when editing
   * @returns {Promise<Object|null>} Quiz data or null
   */
  const fetchQuizData = async () => {
    try {
      const quizObj = await fetchQuizById(quizId);
      return {
        ...quizObj,
        questions: quizObj.questions.map((q) => ({
          title: q.title,
          correctAnswer: q.correctAnswer,
          wrongAnswers: q.wrongAnswers,
          image: null, // Set image to null explicitly
        })),
        image: null, // Set main quiz image to null explicitly
      };
    } catch (error) {
      console.error("Failed to load quiz data:", error);
      return null;
    }
  };

  // ===== FORM HANDLERS =====

  /**
   * Handles form submission
   * @param {Object} formData - Form values
   */
  const handleFormSubmit = async (formData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Sanitize form data before submission
      const sanitizedData = sanitizeFormData(formData);

      if (onSubmit) {
        await onSubmit(sanitizedData);
      } else {
        await createQuiz(
          sanitizedData,
          currentUser,
          navigate,
          showLoading,
          updateLoadingToSuccess,
          updateLoadingToError,
          reset,
        );
        clearStoredFormData();
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets form and clears localStorage
   */
  const handleFormReset = () => {
    reset(defaultValues || DEFAULT_FORM_VALUES);
    clearStoredFormData();
  };

  // ===== EFFECTS =====

  // Load quiz data from server if editing and no data found
  useEffect(() => {
    const initializeForm = async () => {
      // Only fetch from server if we're editing and have no data
      if (!defaultValues && !sanitizedStoredData && quizId) {
        const quizData = await fetchQuizData();
        if (quizData) {
          reset(quizData);
          setStoredFormData(quizData);
        }
      }
    };

    initializeForm();
  }, [defaultValues, sanitizedStoredData, quizId, reset, setStoredFormData]);

  // Save form state to localStorage on change
  useEffect(() => {
    const subscription = watch((formData) => {
      // Sanitize before saving to localStorage
      const sanitizedData = sanitizeFormData(formData);
      setStoredFormData(sanitizedData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setStoredFormData]);

  // Get current question count
  const questionCount = watch("questions")?.length || 0;

  // ===== RENDER =====
  return (
    <div className="relative mx-auto max-w-3xl">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Quiz Header */}
          <QuizHeader />

          {/* Quiz Details */}
          <QuizDetails questionCount={questionCount} />

          {/* Questions Counter and Reset Button */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Pytania: {questionCount}/{quizFormConfig.QUIZ_QUESTIONS_LIMIT}
            </span>
            <button
              type="button"
              onClick={handleFormReset}
              title="Resetuj formularz i wyczyść zapisane dane"
              className="flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              <FaTrash className="mr-2" />
              Resetuj
            </button>
          </div>

          {/* Question List */}
          <QuestionList fields={fields} append={append} remove={remove} />

          {/* Submit Button */}
          <div className="relative">
            <button
              type="submit"
              title={
                isValid
                  ? "Zapisz i opublikuj"
                  : "Wypełnij wszystkie wymagane pola, aby zapisać quiz"
              }
              className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={!isValid || isSubmitting}
            >
              <FaSave className="mr-2" />
              {isSubmitting ? "Zapisywanie..." : "Zapisz i opublikuj"}
            </button>
          </div>
        </form>
      </FormProvider>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default QuizForm;
