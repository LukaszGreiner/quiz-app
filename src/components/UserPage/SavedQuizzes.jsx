import { useState } from "react";

function SavedQuizzes() {
  // Przykładowe dane lokalne
  const [quizzes, setQuizzes] = useState([
    { id: "1", title: "Quiz 1: Matematyka" },
    { id: "2", title: "Quiz 2: Historia" },
  ]);

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Saved Quizzes
      </h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">Brak zapisanych quizów.</p>
      ) : (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="text-gray-900">
              {quiz.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedQuizzes;