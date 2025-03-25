import React from "react";

export default function QuizTile({ quiz }) {
  return (
    <li className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{quiz.question}</h2>
      <p>Category: {quiz.category}</p>
      <p>Difficulty: {quiz.difficulty}</p>
    </li>
  );
}
