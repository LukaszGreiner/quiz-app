import { categoriesConfig } from "./categoriesConfig";

export const quizFormConfig = {
  QUIZ_QUESTIONS_LIMIT: 20,
  MIN_QUESTIONS_REQUIRED: 1,
  MAX_QUIZ_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 300,
  MAX_QUESTION_TEXT_LENGTH: 150,
  MAX_ANSWER_LENGTH: 50,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
  DEFAULT_DIFFICULTY: "normal",
  QUIZ_CATEGORIES: categoriesConfig.QUIZ_CATEGORIES,
  DIFFICULTY_LEVELS: { easy: "Łatwy", normal: "Normalny", hard: "Trudny" },
  VISIBILITY_OPTIONS: { public: "Publiczny", private: "Prywatny" },
  TIME_OPTIONS: [5, 10, 15, 20, 30, 45, 60],
};
