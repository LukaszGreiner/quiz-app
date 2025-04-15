import { useState } from "react";

function QuizHistory() {
  // Przykładowe dane lokalne
  const [history, setHistory] = useState([
    { id: "1", title: "Quiz 1: Matematyka", date: "2023-10-01" },
    { id: "2", title: "Quiz 2: Historia", date: "2023-10-02" },
  ]);

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Quiz History
      </h2>
      {history.length === 0 ? (
        <p className="text-gray-500">Brak historii quizów.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((entry) => (
            <li key={entry.id} className="text-gray-900">
              {entry.title} - {entry.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuizHistory;