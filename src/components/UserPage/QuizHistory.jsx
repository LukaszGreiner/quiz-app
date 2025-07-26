import { useState, useEffect } from "react";
import { Clock, ChevronRight, CheckCircle, Trash2, Plus, Calendar, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserQuizHistory, deleteQuizResult, addDebugQuizResult } from "../../services/statisticsService";
import { useStreak } from "../../hooks/useStreak";
import Btn from "../common/Btn";

function QuizHistory() {
  const { currentUser } = useAuth();
  const { recalculateStreak } = useStreak();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [refreshingStreak, setRefreshingStreak] = useState(false);
  const [debugForm, setDebugForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    score: 5,
    totalQuestions: 10,
    quizId: "debug-quiz-" + Date.now(),
    category: "debug"
  });

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

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten wynik?")) return;
    
    try {
      await deleteQuizResult(resultId);
      // Refresh history after deletion
      const updatedHistory = await fetchUserQuizHistory(currentUser.uid);
      setHistory(updatedHistory);
      
      // Automatically refresh streak data after deletion
      await recalculateStreak();
      
      alert("Wynik został usunięty i streak został zaktualizowany!");
    } catch (error) {
      console.error("Error deleting result:", error);
      alert("Błąd usuwania wyniku: " + error.message);
    }
  };

  const handleAddDebugActivity = async (e) => {
    e.preventDefault();
    
    try {
      // Combine date and time to create ISO string
      const completedAt = new Date(`${debugForm.date}T${debugForm.time}:00`).toISOString();
      
      const quizData = {
        quizId: debugForm.quizId,
        score: parseInt(debugForm.score),
        totalQuestions: parseInt(debugForm.totalQuestions),
        completedAt: completedAt,
        category: debugForm.category,
        timeSpent: 120,
        xpEarned: parseInt(debugForm.score) * 10,
        answers: []
      };
      
      await addDebugQuizResult(currentUser.uid, quizData);
      
      // Refresh history after adding
      const updatedHistory = await fetchUserQuizHistory(currentUser.uid);
      setHistory(updatedHistory);
      
      // Automatically refresh streak data after adding
      await recalculateStreak();
      
      setShowDebugModal(false);
      alert("Aktywność dodana i streak został zaktualizowany!");
      
      // Reset form
      setDebugForm({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        score: 5,
        totalQuestions: 10,
        quizId: "debug-quiz-" + Date.now(),
        category: "debug"
      });
    } catch (error) {
      console.error("Error adding debug activity:", error);
      alert("Błąd dodawania aktywności: " + error.message);
    }
  };

  const handleRefreshStreak = async () => {
    try {
      setRefreshingStreak(true);
      await recalculateStreak();
      alert("Streak został przeliczony na podstawie aktualnej historii!");
    } catch (error) {
      console.error("Error refreshing streak:", error);
      alert("Błąd odświeżania streak: " + error.message);
    } finally {
      setRefreshingStreak(false);
    }
  };

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
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-3">
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
        
        {/* Debug Controls - Only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="flex gap-2">
            <Btn
              variant="ghost"
              size="sm"
              onClick={handleRefreshStreak}
              disabled={refreshingStreak}
              className="text-green-600"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshingStreak ? 'animate-spin' : ''}`} />
              {refreshingStreak ? 'Odświeżanie...' : 'Streak'}
            </Btn>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugModal(true)}
              className="text-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Btn>
          </div>
        )}
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
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-secondary/10 group-hover:bg-secondary/20 flex h-6 w-6 items-center justify-center rounded-lg transition-colors duration-200 sm:h-8 sm:w-8">
                    <CheckCircle className="text-secondary h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-quicksand text-text group-hover:text-primary truncate text-sm font-medium transition-colors duration-200 sm:text-base">
                        {entry.quizTitle || `Quiz ${entry.quizId}`}
                      </p>
                      {entry.isDebugEntry && process.env.NODE_ENV === 'development' && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                          Debug
                        </span>
                      )}
                    </div>
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
                  
                  {/* Debug Delete Button - Only in development */}
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResult(entry.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Usuń wynik (debug)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  
                  <ChevronRight className="text-text-muted group-hover:text-primary h-4 w-4 transition-colors duration-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug Modal for Adding Activity - Only in development */}
      {process.env.NODE_ENV === 'development' && showDebugModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg border border-border p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dodaj aktywność debug
            </h2>
            
            <form onSubmit={handleAddDebugActivity} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <input
                    type="date"
                    value={debugForm.date}
                    onChange={(e) => setDebugForm({...debugForm, date: e.target.value})}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Godzina</label>
                  <input
                    type="time"
                    value={debugForm.time}
                    onChange={(e) => setDebugForm({...debugForm, time: e.target.value})}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Wynik</label>
                  <input
                    type="number"
                    min="0"
                    value={debugForm.score}
                    onChange={(e) => setDebugForm({...debugForm, score: e.target.value})}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Razem pytań</label>
                  <input
                    type="number"
                    min="1"
                    value={debugForm.totalQuestions}
                    onChange={(e) => setDebugForm({...debugForm, totalQuestions: e.target.value})}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quiz ID</label>
                <input
                  type="text"
                  value={debugForm.quizId}
                  onChange={(e) => setDebugForm({...debugForm, quizId: e.target.value})}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Kategoria</label>
                <input
                  type="text"
                  value={debugForm.category}
                  onChange={(e) => setDebugForm({...debugForm, category: e.target.value})}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-surface"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Btn type="submit" variant="primary" className="flex-1">
                  Dodaj aktywność
                </Btn>
                <Btn 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowDebugModal(false)}
                  className="flex-1"
                >
                  Anuluj
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizHistory;
