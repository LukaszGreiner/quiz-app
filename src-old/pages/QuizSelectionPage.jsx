import React from "react";
import { Link } from "react-router-dom";

export default function QuizSelectionPage() {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Quiz Selection</h1>
      <div className="flex flex-col space-y-4">
        <Link
          to="/quizes"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Choose a Quiz
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
