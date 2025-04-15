import { useState } from "react";

function CreatedQuizzes() {
  const [quizzes] = useState([
    { id: "1", title: "Mój Quiz: Geografia" },
    { id: "2", title: "Mój Quiz: Fizyka" },
  ]);

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold font-lato text-dark">
        Created Quizzes
      </h2>
      {quizzes && quizzes.length > 0 ? (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="font-poppins text-dark">
              {quiz.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-quicksand text-dark">Brak utworzonych quizów.</p>
      )}
    </div>
  );
}

export default CreatedQuizzes;