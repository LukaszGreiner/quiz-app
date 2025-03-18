import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Quiz App</h1>
      <p className="mb-4">Create and play quizzes to test your knowledge!</p>
      <div className="flex flex-col space-y-4">
        <Link
          to="/quizes"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Quizes
        </Link>
        <Link
          to="/add-quiz"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Create a New Quiz
        </Link>
      </div>
    </div>
  );
}
