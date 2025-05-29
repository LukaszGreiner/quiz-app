import { useState } from "react";
import { Clock, ChevronRight, CheckCircle } from "lucide-react";

function QuizHistory() {
  // Przykładowe dane lokalne
  const [history] = useState([
    { id: "1", title: "Quiz 1: Matematyka", date: "2023-10-01", score: 85 },
    { id: "2", title: "Quiz 2: Historia", date: "2023-10-02", score: 92 },
  ]);

  return (
    <div>
      {" "}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-secondary/10 flex h-8 w-8 items-center justify-center rounded-full">
          <Clock className="text-secondary h-4 w-4" />
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
            <Clock className="text-text-muted h-6 w-6" />
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
                  {" "}
                  <div className="bg-secondary/10 group-hover:bg-secondary/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200">
                    <CheckCircle className="text-secondary h-4 w-4" />
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
                  )}{" "}
                  <ChevronRight className="text-text-muted group-hover:text-primary h-4 w-4 transition-colors duration-200" />
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
