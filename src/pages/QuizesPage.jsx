import React, { useEffect, useState } from "react";
import QuizTile from "../components/QuizTile";

export default function QuizesPage() {
  const [quizes, setQuizes] = useState([]);
  const [filteredQuizes, setFilteredQuizes] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchQuizes = async () => {
      try {
        const response = await fetch("http://localhost:3000/quizes");
        if (!response.ok) {
          throw new Error("Failed to fetch quizes");
        }
        const data = await response.json();
        setQuizes(data);
        setFilteredQuizes(data);
      } catch (error) {
        console.error("Error fetching quizes:", error);
      }
    };

    fetchQuizes();
  }, []);

  useEffect(() => {
    let filtered = quizes;

    if (category) {
      filtered = filtered.filter((quiz) => quiz.category === category);
    }

    if (difficulty) {
      filtered = filtered.filter((quiz) => quiz.difficulty === difficulty);
    }

    setFilteredQuizes(filtered);
  }, [category, difficulty, quizes]);

  const handleSort = () => {
    const sorted = [...filteredQuizes].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.difficulty.localeCompare(b.difficulty);
      } else {
        return b.difficulty.localeCompare(a.difficulty);
      }
    });
    setFilteredQuizes(sorted);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">All Quizes</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Filter by Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All</option>
          <option value="Sports">Sports</option>
          <option value="Entertainment: Video Games">
            Entertainment: Video Games
          </option>
          <option value="General Knowledge">General Knowledge</option>
          <option value="Science: Computers">Science: Computers</option>
          <option value="Animals">Animals</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="Entertainment: Cartoon & Animations">
            Entertainment: Cartoon & Animations
          </option>
          <option value="Entertainment: Television">
            Entertainment: Television
          </option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Filter by Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        onClick={handleSort}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mb-4"
      >
        Sort by Difficulty
      </button>
      <ul className="space-y-4">
        {filteredQuizes.map((quiz) => (
          <QuizTile key={quiz.id} quiz={quiz} />
        ))}
      </ul>
    </div>
  );
}
