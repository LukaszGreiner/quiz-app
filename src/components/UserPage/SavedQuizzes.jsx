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
      {" "}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-info/10 flex h-8 w-8 items-center justify-center rounded-full">
          <Bookmark className="text-info h-4 w-4" />
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
            <Bookmark className="text-text-muted h-6 w-6" />
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
              {" "}
              <div className="flex items-center gap-3">
                <div className="bg-info/10 group-hover:bg-info/20 flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200">
                  <CheckCircle className="text-info h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-quicksand text-text group-hover:text-primary truncate font-medium transition-colors duration-200">
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
