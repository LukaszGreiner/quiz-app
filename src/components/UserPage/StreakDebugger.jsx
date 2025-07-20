import { useState } from "react";
import { Bug, Calendar, Flame, Eye } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import { useAuth } from "../../context/AuthContext";
import { streakService } from "../../services/streakService";
import Btn from "../common/Btn";

function StreakDebugger() {
  const { currentUser } = useAuth();
  const { streakData } = useStreak();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const debug = await streakService.debugStreakStatus(currentUser.uid);
      setDebugInfo(debug);
    } catch (error) {
      console.error("Debug error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-6">
      <div className="mb-4 flex items-center gap-2">
        <Bug className="text-accent h-5 w-5" />
        <h3 className="text-text font-semibold">Debug Passy</h3>
      </div>

      <div className="space-y-4">
        <Btn 
          variant="secondary" 
          onClick={runDebug}
          disabled={loading}
          className="w-full"
        >
          <Eye className="mr-2 h-4 w-4" />
          {loading ? "Sprawdzanie..." : "Sprawdź szczegóły passy"}
        </Btn>

        {debugInfo && (
          <div className="space-y-3">
            <div className="bg-surface border-border rounded-lg border p-4">
              <h4 className="text-text mb-2 font-medium">Informacje o passie:</h4>
              <div className="space-y-1 text-sm">
                <p className="text-text-muted">
                  <span className="font-medium">Ostatnia aktywność:</span>{" "}
                  {debugInfo.streakData?.lastActivityDate ? 
                    new Date(debugInfo.streakData.lastActivityDate).toLocaleDateString('pl-PL') : 
                    'Brak'
                  }
                </p>
                <p className="text-text-muted">
                  <span className="font-medium">Dzisiejsza data:</span> {debugInfo.todayString}
                </p>
                <p className="text-text-muted">
                  <span className="font-medium">Quiz dzisiaj:</span>{" "}
                  {debugInfo.hasCompletedToday ? "✅ Tak" : "❌ Nie"}
                </p>
                <p className="text-text-muted">
                  <span className="font-medium">Łączne dni quizów:</span> {debugInfo.streakData?.totalQuizDays || 0}
                </p>
              </div>
            </div>

            {debugInfo.recentResults && debugInfo.recentResults.length > 0 && (
              <div className="bg-surface border-border rounded-lg border p-4">
                <h4 className="text-text mb-2 font-medium">Ostatnie quizy:</h4>
                <div className="space-y-1">
                  {debugInfo.recentResults.map((result, index) => (
                    <div key={index} className="text-text-muted flex justify-between text-sm">
                      <span>{result.quizTitle}</span>
                      <span>{result.dateString}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-500/10 border-yellow-500/30 rounded-lg border p-4">
              <h4 className="text-yellow-600 mb-2 font-medium">
                <Calendar className="mr-2 inline h-4 w-4" />
                Jak działają passy:
              </h4>
              <ul className="text-yellow-600/80 space-y-1 text-sm">
                <li>• Passa wymaga ukończenia quizu w kolejnych dniach</li>
                <li>• Przerwa choćby jednego dnia resetuje passę</li>
                <li>• Możesz użyć 3 zamrożenia passy miesięcznie</li>
                <li>• Passa liczy się od północy do północy</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StreakDebugger;
