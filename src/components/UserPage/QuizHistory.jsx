import { useState, useEffect } from "react";
import { Clock, ChevronRight, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserQuizHistory } from "../../services/statisticsService";

function QuizHistory() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const historyData = await fetchUserQuizHistory(currentUser.uid);
        setHistory(historyData);
      } catch (err) {
        console.error("Error loading quiz history:", err);
        setError("Nie udało się załadować historii quizów");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [currentUser]);

  if (loading) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <div className="bg-secondary/10 flex h-6 w-6 items-center justify-center rounded-full sm:h-8 sm:w-8">
            <Clock className="text-secondary h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h3 className="font-montserrat text-text text-sm font-semibold sm:text-base">
              Historia Quizów
            </h3>
            <p className="font-quicksand text-text-muted text-xs sm:text-sm">
              Ładowanie...
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-elevated rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="bg-surface h-6 w-6 rounded-lg sm:h-8 sm:w-8"></div>
                <div className="flex-1 space-y-1">
                  <div className="bg-surface h-3 w-32 rounded sm:h-4"></div>
                  <div className="bg-surface h-2 w-20 rounded"></div>
                </div>
                <div className="bg-surface h-6 w-12 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <div className="bg-secondary/10 flex h-6 w-6 items-center justify-center rounded-full sm:h-8 sm:w-8">
            <Clock className="text-secondary h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <div>
            <h3 className="font-montserrat text-text text-sm font-semibold sm:text-base">
              Historia Quizów
            </h3>
            <p className="font-quicksand text-text-muted text-xs sm:text-sm">
              Błąd ładowania
            </p>
          </div>
        </div>
        <div className="py-4 text-center sm:py-6">
          <p className="text-incorrect text-xs sm:text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 sm:mb-6">
        <div className="bg-secondary/10 flex h-6 w-6 items-center justify-center rounded-full sm:h-8 sm:w-8">
          <Clock className="text-secondary h-3 w-3 sm:h-4 sm:w-4" />
        </div>
        <div>
          <h3 className="font-montserrat text-text text-sm font-semibold sm:text-base">
            Historia Quizów
          </h3>
          <p className="font-quicksand text-text-muted text-xs sm:text-sm">
            {history.length} ukończonych
          </p>
        </div>
      </div>
      {history.length === 0 ? (
        <div className="py-4 text-center sm:py-6">
          <div className="bg-surface mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
            <Clock className="text-text-muted h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <p className="font-quicksand text-text-muted text-xs sm:text-sm">
            Brak historii quizów
          </p>
          <p className="font-quicksand text-text-muted mt-1 text-xs">
            Ukończ kilka quizów, aby zobaczyć historię
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
                  <div className="bg-secondary/10 group-hover:bg-secondary/20 flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-200 sm:h-8 sm:w-8">
                    <CheckCircle className="text-secondary h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-quicksand text-text group-hover:text-primary truncate text-sm font-medium transition-colors duration-200 sm:text-base">
                      {entry.quizTitle || `Quiz ${entry.quizId}`}
                    </p>
                    <p className="font-quicksand text-text-muted text-xs">
                      {new Date(entry.completedAt).toLocaleDateString("pl-PL", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  {entry.percentage && (
                    <div
                      className={`rounded-full px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1 ${
                        entry.percentage >= 90
                          ? "bg-correct/10 text-correct"
                          : entry.percentage >= 70
                            ? "bg-accent/10 text-accent"
                            : "bg-incorrect/10 text-incorrect"
                      }`}
                    >
                      {entry.percentage}%
                    </div>
                  )}
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
