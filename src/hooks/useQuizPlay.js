import { useState, useEffect, useRef, useCallback } from "react";
import { auth } from "../firebase";
import { fetchUserQuizAttempts, saveQuizResult } from "../services/quizService";
import { updateLoadingToError } from "../utils/toastUtils";

export const useQuizPlay = (quizId, quizData, questions) => {
  const [quizStartAt, setQuizStartAt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [userAttempts, setUserAttempts] = useState([]);
  const [maxScoreAchieved, setMaxScoreAchieved] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(false); // Track if feedback should be shown for current question
  const [preloadedImages, setPreloadedImages] = useState({}); // Track preloaded images
  const timerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // Function to preload an image
  const preloadImage = useCallback((imageUrl, index) => {
    if (!imageUrl || preloadedImages[index]) return;

    // Store image in cache eagerly with high priority
    const img = new Image();
    
    // Set attributes to help prioritize this image load
    img.fetchPriority = "high";
    img.decoding = "sync"; // Use sync decoding to ensure it's ready immediately
    
    img.onload = () => {
      setPreloadedImages(prev => ({
        ...prev,
        [index]: true
      }));
    };
    
    img.onerror = () => {
      // Mark as preloaded even on error to avoid retry loops
      setPreloadedImages(prev => ({
        ...prev,
        [index]: true
      }));
    };
    
    // Start loading the image
    img.src = imageUrl;
    
    // Force browser to start download immediately
    if (img.decode) {
      img.decode().catch(() => {
        // Ignore errors in decoding, onload/onerror will handle them
      });
    }
  }, [preloadedImages]);

  // Preload next question's image when current question changes
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    
    // Preload next question's image if available
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length && questions[nextIndex]?.imageUrl) {
      preloadImage(questions[nextIndex].imageUrl, nextIndex);
    }
    
    // Also preload current question's image if it exists but hasn't been loaded yet
    // (this helps when first loading the quiz)
    if (questions[currentQuestionIndex]?.imageUrl) {
      preloadImage(questions[currentQuestionIndex].imageUrl, currentQuestionIndex);
    }
  }, [currentQuestionIndex, questions, preloadImage]);

  // Only preload current and next question's images when the quiz first loads
  useEffect(() => {
    if (questions?.length > 0) {
      // Preload only the first question's image (current)
      if (questions[0]?.imageUrl) {
        preloadImage(questions[0].imageUrl, 0);
      }
      
      // And the second question's image (next) if it exists
      if (questions.length > 1 && questions[1]?.imageUrl) {
        preloadImage(questions[1].imageUrl, 1);
      }
    }
  }, [questions, preloadImage]);

  // Reset the timer whenever the question changes
  useEffect(() => {
    // Only reset timer if the quiz is active (not submitted) and has a time limit
    if (!isSubmitted && quizData?.timeLimitPerQuestion) {
      console.log(`Resetting timer for question ${currentQuestionIndex + 1} to ${quizData.timeLimitPerQuestion}s`);
      
      // Clear any existing timer
      clearInterval(timerRef.current);
      
      // Reset the time limit
      setTimeLeft(quizData.timeLimitPerQuestion);
    }
  }, [currentQuestionIndex, quizData, isSubmitted]);

  useEffect(() => {
    const fetchAttempts = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId || !quizId || !questions || questions.length === 0) return;

      try {
        const attempts = await fetchUserQuizAttempts(userId, quizId);
        setUserAttempts(attempts);
        const maxScore = questions.length;
        const hasMaxScore = attempts.some(
          (attempt) => attempt.score === maxScore,
        );
        setMaxScoreAchieved(hasMaxScore);
      } catch (error) {
        console.error("Error fetching user attempts:", error);
      }
    };

    if (auth.currentUser && quizId && questions?.length > 0) {
      fetchAttempts();
    }
  }, [quizId, questions]); // auth.currentUser dependency

  useEffect(() => {
    if (questions?.length > 0 && quizStartAt === null) {
      setQuizStartAt(Date.now());
    }
  }, [questions, quizStartAt]);

  // This effect runs whenever the currentQuestionIndex changes or questions array changes
  useEffect(() => {
    if (!questions || questions.length === 0) {
      console.log("No questions available yet");
      return;
    }
    
    console.log(`Question index is now: ${currentQuestionIndex + 1}/${questions.length}`);
    
    // Make sure we have a valid index and a question at that index
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length && questions[currentQuestionIndex]) {
      const currentQuestion = questions[currentQuestionIndex];
      console.log(`Setting up question: "${currentQuestion.title}"`);
      
      // Create and shuffle answers
      const answers = [
        currentQuestion.correctAnswer,
        ...currentQuestion.wrongAnswers,
      ];
      
      // Update shuffled answers
      const shuffled = [...answers].sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
      console.log("Answers prepared for current question");
    } else {
      console.warn("Invalid question index or question data", { 
        currentQuestionIndex, 
        questionsLength: questions.length,
        hasCurrentQuestion: Boolean(questions[currentQuestionIndex])
      });
    }
  }, [questions, currentQuestionIndex]);

  // Check for question index out of bounds
  useEffect(() => {
    if (questions && questions.length > 0) {
      if (currentQuestionIndex >= questions.length) {
        console.warn('Question index out of bounds', {
          currentQuestionIndex,
          questionsLength: questions.length
        });
      }
    }
  }, [currentQuestionIndex, questions]);

  // Improved cleanup function to clear all timers when component unmounts
  useEffect(() => {
    return () => {
      console.log("Cleaning up all timers and intervals");
      
      // Clear both the React ref timeout and any window timeouts that might be active
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const calculateScore = useCallback(() => {
    if (!questions) return 0;
    return questions.reduce(
      (score, question, index) =>
        userAnswers[index] === question.correctAnswer ? score + 1 : score,
      0,
    );
  }, [questions, userAnswers]);

  const submitQuiz = useCallback(async () => {
    console.log('submitQuiz called - ending the quiz');
    clearInterval(timerRef.current);
    clearTimeout(feedbackTimeoutRef.current);
    
    // Make sure feedback is hidden when submitting
    setAnswerFeedback(false);
    setIsSubmitted(true);

    const userId = auth.currentUser?.uid;
    if (userId && quizData && questions && quizStartAt !== null) {
      const score = calculateScore();
      try {
        await saveQuizResult(
          userId,
          quizId,
          quizData.title,
          score,
          questions.length,
          quizStartAt,
          userAnswers,
          questions,
        );
      } catch (err) {
        // Error is handled by saveQuizResult's toast
        console.error("Error in submitQuiz:", err);
      }
    } else if (!userId) {
      updateLoadingToError(null, "Zaloguj się, aby zapisać wynik!");
    }
  }, [
    quizId,
    quizData,
    questions,
    userAnswers,
    quizStartAt,
    calculateScore,
  ]);

  useEffect(() => {
    // Only start the timer if we have questions, time left, not submitted, and a time limit
    if (
      questions?.length > 0 &&
      timeLeft !== null &&
      timeLeft > 0 &&
      !isSubmitted &&
      quizData?.timeLimitPerQuestion > 0 &&
      !answerFeedback  // Don't run timer during feedback display
    ) {
      console.log(`Starting timer for question ${currentQuestionIndex + 1}, ${timeLeft}s remaining`);
      
      // Clear any existing timer first
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set up a new timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            console.log('Time expired for current question');
            clearInterval(timerRef.current);
            
            // Only advance if we're not already showing feedback
            if (!answerFeedback) {
              if (currentQuestionIndex < questions.length - 1) {
                // Store current index to avoid closure issues
                const currIdx = currentQuestionIndex;
                
                // Preload next question's image first, then advance
                const nextIdx = currIdx + 1;
                if (nextIdx < questions.length) {
                  // Try to preload next image before advancing
                  ensureNextImagePreloaded(nextIdx).then(() => {
                    setCurrentQuestionIndex(nextIdx);
                  });
                }
              } else {
                setTimeout(() => submitQuiz(), 0);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    questions,
    timeLeft,
    currentQuestionIndex,
    isSubmitted,
    quizData,
    submitQuiz,
    answerFeedback,  // Add this dependency to pause timer during feedback
  ]);

  // Function to ensure the next question's image is preloaded
  const ensureNextImagePreloaded = useCallback((nextIndex) => {
    return new Promise((resolve) => {
      // If no next question or no image, resolve immediately
      if (!questions || nextIndex >= questions.length || !questions[nextIndex]?.imageUrl) {
        return resolve(true);
      }
      
      // If already preloaded, resolve immediately
      if (preloadedImages[nextIndex]) {
        return resolve(true);
      }
      
      // Otherwise, preload the image and wait
      const img = new Image();
      let resolved = false;
      
      // Set a timeout to ensure we don't hang the app if an image is slow
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          // Mark as loaded even if it's not fully loaded yet
          setPreloadedImages(prev => ({
            ...prev,
            [nextIndex]: true
          }));
          resolve(true);
        }
      }, 1000); // Max 1 second wait
      
      img.onload = () => {
        clearTimeout(timeoutId);
        if (!resolved) {
          resolved = true;
          setPreloadedImages(prev => ({
            ...prev,
            [nextIndex]: true
          }));
          resolve(true);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        if (!resolved) {
          resolved = true;
          setPreloadedImages(prev => ({
            ...prev,
            [nextIndex]: true
          }));
          resolve(true);
        }
      };
      
      img.src = questions[nextIndex].imageUrl;
    });
  }, [questions, preloadedImages]);

  const handleAnswerSelect = useCallback(
    (answer) => {
      // First, clear any existing timeouts to prevent race conditions
      clearTimeout(feedbackTimeoutRef.current);
      
      // Record the user's answer
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answer,
      }));

      // Show feedback for the selected answer
      setAnswerFeedback(true);
      
      // Store these values to avoid closure issues
      const currIndex = currentQuestionIndex;
      const totalQs = questions ? questions.length : 0;
      
      // Start the process for showing feedback and then moving to next question
      window.setTimeout(async () => {
        // Start preloading immediately but don't wait for completion
        if (currIndex < totalQs - 1) {
          // Start preloading the next image, but don't await it
          ensureNextImagePreloaded(currIndex + 1);
        }
        
        // Now hide feedback
        setAnswerFeedback(false);
        
        // Small delay after feedback before changing question
        window.setTimeout(() => {
          if (currIndex < totalQs - 1) {
            setCurrentQuestionIndex(currIndex + 1);
          } else {
            submitQuiz();
          }
        }, 100);
      }, 2000); // Show feedback for 2 seconds
    },
    // We include all the dependencies needed to avoid stale closures
    [currentQuestionIndex, questions, submitQuiz, setUserAnswers, setAnswerFeedback, setCurrentQuestionIndex, ensureNextImagePreloaded]
  );

  // These functions are kept for potential use elsewhere, but they're not used for navigation buttons anymore
  const handleNextOrSubmit = useCallback(() => {
    // Clear feedback timeout if it exists
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setAnswerFeedback(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      // Time reset is handled by useEffect watching currentQuestionIndex and quizData.timeLimitPerQuestion
    } else {
      submitQuiz();
    }
  }, [currentQuestionIndex, questions, submitQuiz]);

  const handlePrevious = useCallback(() => {
    // Clear feedback timeout if it exists
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setAnswerFeedback(false);
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const progress =
    questions?.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  const currentQuestion = questions?.[currentQuestionIndex];
  const score = isSubmitted ? calculateScore() : 0;

  return {
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    timeLeft,
    shuffledAnswers,
    userAttempts,
    maxScoreAchieved,
    handleAnswerSelect,
    handleNextOrSubmit,
    handlePrevious,
    progress,
    currentQuestion,
    score,
    isLoadingUserAttempts:
      !auth.currentUser ||
      (auth.currentUser &&
        userAttempts.length === 0 &&
        questions?.length > 0 &&
        !maxScoreAchieved),
    answerFeedback, // Expose answerFeedback state
    preloadedImages, // Expose preloaded images state
  };
};
