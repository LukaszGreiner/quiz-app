import { useState } from "react";

function SavedQuizzes() {
  // Przykładowe dane lokalne
  const [quizzes] = useState([
    { id: "1", title: "Quiz 1: Matematyka" },
    { id: "2", title: "Quiz 2: Historia" },
  ]);
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-info/10 flex h-8 w-8 items-center justify-center rounded-full">
          <svg
            className="text-info h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </div>
        <div>
          <h3 className="font-montserrat text-text font-semibold">
            Saved Quizzes
          </h3>
          <p className="font-quicksand text-text-muted text-sm">
            {quizzes.length} saved
          </p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="py-6 text-center">
          <div className="bg-surface mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-text-muted h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <p className="font-quicksand text-text-muted text-sm">
            No saved quizzes yet
          </p>
          <p className="font-quicksand text-text-muted mt-1 text-xs">
            Save quizzes to find them here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group border-border bg-surface-elevated hover:bg-surface cursor-pointer rounded-lg border p-3 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-info/10 group-hover:bg-info/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200">
                  <svg
                    className="text-info h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-quicksand text-text group-hover:text-primary truncate font-medium transition-colors duration-200">
                    {quiz.title}
                  </p>
                </div>
                <svg
                  className="text-text-muted group-hover:text-primary h-4 w-4 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedQuizzes;
