import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaPlus, FaChevronDown } from "react-icons/fa"; // Added FaChevronDown

const QuizForm = () => {
  const [quiz, setQuiz] = useState({
    name: "Untitled Quiz",
    description: "",
    expectedTime: 30,
    category: "",
    difficulty: "normal",
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
      isOpen: true,
    },
  ]);

  const nameInputRef = useRef(null);
  const questionsContainerRef = useRef(null);
  const categories = [
    "Math",
    "Science",
    "History",
    "Geography",
    "Literature",
    "General Knowledge",
  ];

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleNameChange = (value) => {
    setQuiz({ ...quiz, name: value });
  };

  const handleQuestionChange = (
    index,
    field,
    value,
    wrongAnswerIndex = null,
  ) => {
    const newQuestions = [...questions];
    if (field === "wrongAnswers") {
      newQuestions[index][field][wrongAnswerIndex] = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const isQuestionFilled = (question) => {
    return (
      question.questionText.trim() &&
      question.correctAnswer.trim() &&
      question.wrongAnswers.every((answer) => answer.trim())
    );
  };

  const toggleQuestion = (index) => {
    const newQuestions = [...questions];
    if (isQuestionFilled(newQuestions[index])) {
      newQuestions[index].isOpen = !newQuestions[index].isOpen;
      setQuestions(newQuestions);
    }
  };

  const addQuestion = () => {
    if (
      questions.length < 20 &&
      isQuestionFilled(questions[questions.length - 1])
    ) {
      const newQuestions = [
        ...questions.map((q) => ({ ...q, isOpen: false })),
        {
          questionText: "",
          correctAnswer: "",
          wrongAnswers: ["", "", ""],
          isOpen: true,
        },
      ];
      setQuestions(newQuestions);

      setTimeout(() => {
        const lastQuestion =
          questionsContainerRef.current?.children[newQuestions.length - 1];
        if (lastQuestion) {
          lastQuestion.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 0);
    }
  };

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ quiz, questions });
  };

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-lg">
      <div className="relative mb-6">
        {isEditingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={quiz.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => {
              if (!quiz.name.trim())
                setQuiz({ ...quiz, name: "Untitled Quiz" });
              setIsEditingName(false);
            }}
            onKeyPress={(e) => e.key === "Enter" && setIsEditingName(false)}
            autoFocus
            className="w-full border-b-2 border-indigo-400 bg-transparent text-2xl font-bold transition-colors focus:border-indigo-600 focus:outline-none"
          />
        ) : (
          <h2
            className="flex cursor-pointer items-center gap-2 text-2xl font-bold text-gray-800 transition-colors hover:text-indigo-600"
            onClick={() => setIsEditingName(true)}
          >
            {quiz.name}
            <span className="text-sm font-normal text-gray-400">
              ✎ Click to edit
            </span>
          </h2>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={quiz.description}
              onChange={handleQuizChange}
              placeholder="Add a brief description (optional)"
              className="focus:ring-opacity-50 h-24 w-full rounded-md border-gray-200 shadow-sm transition-all focus:border-indigo-300 focus:ring focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Time per Question (sec)
              </label>
              <input
                type="number"
                name="expectedTime"
                value={quiz.expectedTime}
                onChange={handleQuizChange}
                min="1"
                className="focus:ring-opacity-50 w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={quiz.category}
                onChange={handleQuizChange}
                required
                className="focus:ring-opacity-50 w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-100"
              >
                <option value="">Choose a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={handleQuizChange}
                className="focus:ring-opacity-50 w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-100"
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="sticky top-0 z-10 bg-white py-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Questions ({questions.length}/20)
            </h3>
          </div>

          <div ref={questionsContainerRef}>
            {questions.map((question, index) => (
              <div
                key={index}
                className="relative rounded-md border border-gray-200 bg-gray-50 p-4 transition-all duration-300"
              >
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteQuestion(index)}
                    className="absolute top-2 right-2 flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}

                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Question {index + 1}
                    </label>
                    <div className="w-full rounded-md border-gray-200 bg-white px-3 py-2 text-gray-800">
                      {question.questionText || "No question entered yet"}
                    </div>
                  </div>
                  {isQuestionFilled(question) && (
                    <FaChevronDown
                      className={`ml-2 h-4 w-4 text-gray-600 transition-transform duration-300 ${
                        question.isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {question.isOpen && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          index,
                          "questionText",
                          e.target.value,
                        )
                      }
                      placeholder="Enter your question"
                      required
                      className="focus:ring-opacity-50 w-full rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-100"
                    />

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-green-700">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          value={question.correctAnswer}
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "correctAnswer",
                              e.target.value,
                            )
                          }
                          placeholder="Correct answer"
                          required
                          className="focus:ring-opacity-50 w-full rounded-md border-green-200 shadow-sm focus:border-green-300 focus:ring focus:ring-green-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="mb-1 block text-sm font-medium text-red-700">
                          Wrong Answers
                        </label>
                        {question.wrongAnswers.map((answer, wrongIndex) => (
                          <input
                            key={wrongIndex}
                            type="text"
                            value={answer}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "wrongAnswers",
                                e.target.value,
                                wrongIndex,
                              )
                            }
                            placeholder={`Wrong answer ${wrongIndex + 1}`}
                            required
                            className="focus:ring-opacity-50 w-full rounded-md border-red-200 shadow-sm focus:border-red-300 focus:ring focus:ring-red-100"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {questions.length < 20 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={addQuestion}
                disabled={!isQuestionFilled(questions[questions.length - 1])}
                className="flex items-center justify-center rounded-full bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <FaPlus className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-3 font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          Save Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
