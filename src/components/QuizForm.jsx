import React, { useState, useRef } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import QuizHeader from "./QuizForm/QuizHeader";
import QuizDetails from "./QuizForm/QuizDetails";
import Question from "./QuizForm/Question";
import ScrollToTopButton from "./QuizForm/ScrollToTopButton";

const QuizForm = () => {
  const [quiz, setQuiz] = useState({
    name: "Quiz bez nazwy",
    description: "",
    timeLimit: null,
    category: "",
    difficulty: "normal",
    visibility: "public",
    image: null,
  });

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      correctAnswer: "",
      wrongAnswers: ["", "", ""],
      isOpen: true,
      image: null,
    },
  ]);

  const questionsContainerRef = useRef(null);

  const handleQuizChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setQuiz({ ...quiz, image: files[0] || null });
    } else {
      const val =
        name === "timeLimit" ? (value === "" ? null : Number(value)) : value;
      setQuiz({ ...quiz, [name]: val });
    }
  };

  const handleNameChange = (name) => {
    setQuiz({ ...quiz, name });
  };

  const handleQuestionChange = (
    index,
    field,
    value,
    wrongAnswerIndex = null,
  ) => {
    const newQuestions = [...questions];
    if (field === "wrongAnswers" && wrongAnswerIndex !== null) {
      newQuestions[index][field][wrongAnswerIndex] = value;
    } else if (field === "image") {
      newQuestions[index][field] = value instanceof File ? value : null;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const isQuestionFilled = (question) =>
    question.questionText.trim() &&
    question.correctAnswer.trim() &&
    question.wrongAnswers.every((answer) => answer.trim());

  const handleExpandQuestion = (index) => {
    const newQuestions = [...questions];
    if (isQuestionFilled(newQuestions[index]) && !newQuestions[index].isOpen) {
      newQuestions[index].isOpen = true;
      setQuestions(newQuestions);
    }
  };

  const handleToggleQuestion = (index) => {
    const newQuestions = [...questions];
    if (isQuestionFilled(newQuestions[index])) {
      newQuestions[index].isOpen = !newQuestions[index].isOpen;
      setQuestions(newQuestions);
    }
  };

  const handleAddQuestion = () => {
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
          image: null,
        },
      ];
      setQuestions(newQuestions);
      setTimeout(() => {
        questionsContainerRef.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    }
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredQuestions = questions.map(({ isOpen, ...rest }) => rest);
    console.log({ quiz, questions: filteredQuestions });
  };

  return (
    <div className="relative mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <QuizHeader name={quiz.name} onNameChange={handleNameChange} />
        <QuizDetails
          quiz={quiz}
          onChange={handleQuizChange}
          questionCount={questions.length}
        />
        <div ref={questionsContainerRef} className="space-y-4">
          {questions.map((question, index) => (
            <Question
              key={index}
              index={index}
              question={question}
              onChange={handleQuestionChange}
              onDelete={handleDeleteQuestion}
              onExpand={handleExpandQuestion}
              onToggle={handleToggleQuestion}
              canDelete={questions.length > 1}
            />
          ))}
        </div>
        {questions.length < 20 && (
          <button
            type="button"
            onClick={handleAddQuestion}
            disabled={!isQuestionFilled(questions[questions.length - 1])}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-100 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            <FaPlus size={14} /> Dodaj Pytanie
          </button>
        )}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <FaSave size={14} /> Zapisz
        </button>
      </form>
      <ScrollToTopButton />
    </div>
  );
};

export default QuizForm;
