import { useState } from "react";
import { Bookmark, ChevronRight, CheckCircle } from "lucide-react";

function SavedQuizzes() {
  // Przykładowe dane lokalne
  const [quizzes] = useState([
    { id: "1", title: "Quiz 1: Matematyka" },
    { id: "2", title: "Quiz 2: Historia" },
  ]);
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 sm:mb-6">
        <div className="bg-info/10 flex h-6 w-6 items-center justify-center rounded-full sm:h-8 sm:w-8">
          <Bookmark className="text-info h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <div>
          <h3 className="font-montserrat text-text text-sm font-semibold sm:text-base">
            Zapisane Quizy
          </h3>
          <p className="font-quicksand text-text-muted text-xs sm:text-sm">
            {quizzes.length} zapisanych
          </p>
        </div>
      </div>
      {quizzes.length === 0 ? (
        <div className="py-4 text-center sm:py-6">
          <div className="bg-surface mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
            <Bookmark className="text-text-muted h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <p className="font-quicksand text-text-muted text-xs sm:text-sm">
            Brak zapisanych quizów
          </p>
          <p className="font-quicksand text-text-muted mt-1 text-xs">
            Zapisuj quizy, aby je tu znaleźć
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
                <div className="bg-info/10 group-hover:bg-info/20 flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-200 sm:h-8 sm:w-8">
                  <CheckCircle className="text-info h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-quicksand text-text group-hover:text-primary truncate text-sm font-medium transition-colors duration-200 sm:text-base">
                    {quiz.title}
                  </p>
                </div>
                <ChevronRight className="text-text-muted group-hover:text-primary h-4 w-4 transition-colors duration-200" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedQuizzes;
