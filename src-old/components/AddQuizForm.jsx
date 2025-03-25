import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddQuizForm() {
  const [quiz, setQuiz] = useState({
    type: "multiple",
    difficulty: "easy",
    category: "",
    question: "",
    correct_answer: "",
    incorrect_answers: ["", "", ""],
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories from db.json
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/quizes");
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
        // Extract unique categories from the fetched quizzes
        const uniqueCategories = [
          ...new Set(data.map((quiz) => quiz.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value,
    }));
  };

  const handleIncorrectAnswerChange = (index, value) => {
    const newIncorrectAnswers = [...quiz.incorrect_answers];
    newIncorrectAnswers[index] = value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      incorrect_answers: newIncorrectAnswers,
    }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (quiz.category && !categories.includes(quiz.category)) {
      setCategories([...categories, quiz.category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (
      !quiz.category ||
      !quiz.question ||
      !quiz.correct_answer ||
      quiz.incorrect_answers.some((answer) => answer.trim() === "")
    ) {
      toast.error("Please fill in all fields!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/quizes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Quiz added:", data);
      toast.success("Quiz added successfully!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Reset the form after successful submission
      setQuiz({
        type: "multiple",
        difficulty: "easy",
        category: "",
        question: "",
        correct_answer: "",
        incorrect_answers: ["", "", ""],
      });
    } catch (error) {
      console.error("There was an error adding the quiz!", error);
      toast.error("Error adding quiz!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
    >
      <div className="mb-4">
        <label className="block text-gray-700">Type:</label>
        <select
          name="type"
          value={quiz.type}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="boolean">Boolean</option>
          <option value="multiple">Multiple</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Difficulty:</label>
        <select
          name="difficulty"
          value={quiz.difficulty}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category:</label>
        <select
          name="category"
          value={quiz.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Add new category"
          value={quiz.category}
          onChange={handleChange}
          name="category"
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          onClick={handleAddCategory}
          className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Category
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Question:</label>
        <input
          type="text"
          name="question"
          value={quiz.question}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Correct Answer:</label>
        <input
          type="text"
          name="correct_answer"
          value={quiz.correct_answer}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Incorrect Answers:</label>
        {quiz.incorrect_answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            value={answer}
            onChange={(e) => handleIncorrectAnswerChange(index, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
          />
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Quiz
      </button>
    </form>
  );
}
