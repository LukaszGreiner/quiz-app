export const quizFormConfig = {
  QUIZ_QUESTIONS_LIMIT: 21,
  MIN_QUESTIONS_REQUIRED: 1,
  MAX_QUIZ_NAME_LENGTH: 150,
  MAX_DESCRIPTION_LENGTH: 300,
  MAX_QUESTION_TEXT_LENGTH: 300,
  MAX_ANSWER_LENGTH: 300,
  MAX_IMAGE_SIZE: 2 * 1024 * 1024,
  ALLOWED_IMG_TYPES: {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
  },
  QUIZ_CATEGORIES: [
    "Matematyka",
    "Informatyka",
    "Nauka",
    "Historia",
    "Geografia",
    "Literatura",
    "Wiedza ogólna",
  ],

  DEFAULT_DIFFICULTY: "easy", // easy | normal | hard
  DIFFICULTY_LEVELS: { easy: "Łatwy", normal: "Normalny", hard: "Trudny" },

  VISIBILITY_OPTIONS: { public: "Publiczny", private: "Prywatny" },
  TIME_OPTIONS: [5, 10, 15, 20, 30, 45, 60], // no limit by default
};
