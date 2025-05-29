import { useState } from "react";

function QuizHistory() {
  // Przykładowe dane lokalne
  const [history] = useState([
    { id: "1", title: "Quiz 1: Matematyka", date: "2023-10-01", score: 85 },
    { id: "2", title: "Quiz 2: Historia", date: "2023-10-02", score: 92 },
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-secondary/10 flex h-8 w-8 items-center justify-center rounded-full">
          <svg
            className="text-secondary h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-montserrat text-text font-semibold">
            Quiz History
          </h3>
          <p className="font-quicksand text-text-muted text-sm">
            {history.length} completed
          </p>
        </div>
      </div>

      {history.length === 0 ? (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="font-quicksand text-text-muted text-sm">
            No quiz history yet
          </p>
          <p className="font-quicksand text-text-muted mt-1 text-xs">
            Complete some quizzes to see your history
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="group border-border bg-surface-elevated hover:bg-surface cursor-pointer rounded-lg border p-3 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 group-hover:bg-secondary/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200">
                    <svg
                      className="text-secondary h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-quicksand text-text group-hover:text-primary truncate font-medium transition-colors duration-200">
                      {entry.title}
                    </p>
                    <p className="font-quicksand text-text-muted text-xs">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.score && (
                    <div
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        entry.score >= 90
                          ? "bg-correct/10 text-correct"
                          : entry.score >= 70
                            ? "bg-accent/10 text-accent"
                            : "bg-incorrect/10 text-incorrect"
                      }`}
                    >
                      {entry.score}%
                    </div>
                  )}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizHistory;
