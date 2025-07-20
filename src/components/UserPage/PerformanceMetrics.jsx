import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { TrendingUp, TrendingDown, Minus, Target, Clock, Award } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function PerformanceMetrics() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!currentUser) return;

      try {
        // Mock data - replace with real data from statistics service
        const mockMetrics = {
          averageScore: 78,
          scoreChange: 5, // +5% compared to last week
          averageTime: 120, // seconds per quiz
          timeChange: -10, // -10 seconds compared to last week
          accuracy: 85,
          accuracyChange: 2,
          categoryPerformance: [
            { name: "Historia", value: 85, color: "#3b82f6" },
            { name: "Nauka", value: 92, color: "#10b981" },
            { name: "Sport", value: 76, color: "#f59e0b" },
            { name: "Geografia", value: 88, color: "#8b5cf6" },
            { name: "Inne", value: 70, color: "#ef4444" },
          ],
          weeklyGoals: {
            completed: 15,
            target: 20,
            percentage: 75,
          },
          badges: [
            { name: "Mistrz historii", earned: true },
            { name: "Szybka odpowiedź", earned: true },
            { name: "Perfekcjonista", earned: false },
          ],
        };

        setMetrics(mockMetrics);
      } catch (error) {
        console.error("Error loading performance metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [currentUser]);

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="text-green-500 h-4 w-4" />;
    if (change < 0) return <TrendingDown className="text-red-500 h-4 w-4" />;
    return <Minus className="text-gray-500 h-4 w-4" />;
  };

  const getTrendColor = (change) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        <div className="animate-pulse space-y-4">
          <div className="bg-surface h-4 w-32 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface h-20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        <p className="text-text-muted text-center">Brak danych o wydajności</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        <h3 className="text-text mb-4 text-lg font-semibold">Wydajność</h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Average Score */}
          <div className="text-center">
            <div className="text-text text-2xl font-bold">{metrics.averageScore}%</div>
            <div className="text-text-muted mb-2 text-sm">Średni wynik</div>
            <div className={`flex items-center justify-center gap-1 text-sm ${getTrendColor(metrics.scoreChange)}`}>
              {getTrendIcon(metrics.scoreChange)}
              <span>{Math.abs(metrics.scoreChange)}%</span>
            </div>
          </div>

          {/* Average Time */}
          <div className="text-center">
            <div className="text-text text-2xl font-bold">{Math.round(metrics.averageTime / 60)}min</div>
            <div className="text-text-muted mb-2 text-sm">Średni czas</div>
            <div className={`flex items-center justify-center gap-1 text-sm ${getTrendColor(-metrics.timeChange)}`}>
              {getTrendIcon(-metrics.timeChange)}
              <span>{Math.abs(metrics.timeChange)}s</span>
            </div>
          </div>

          {/* Accuracy */}
          <div className="text-center">
            <div className="text-text text-2xl font-bold">{metrics.accuracy}%</div>
            <div className="text-text-muted mb-2 text-sm">Celność</div>
            <div className={`flex items-center justify-center gap-1 text-sm ${getTrendColor(metrics.accuracyChange)}`}>
              {getTrendIcon(metrics.accuracyChange)}
              <span>{Math.abs(metrics.accuracyChange)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        <h3 className="text-text mb-4 text-lg font-semibold">Wydajność według kategorii</h3>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.categoryPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Wynik"]}
                  contentStyle={{
                    backgroundColor: "rgba(var(--surface-elevated-rgb), 1)",
                    border: "1px solid rgba(var(--border-rgb), 1)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {metrics.categoryPerformance.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-text text-sm">{category.name}</span>
                </div>
                <span className="text-text font-medium">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Target className="text-primary h-5 w-5" />
          <h3 className="text-text text-lg font-semibold">Tygodniowe cele</h3>
        </div>
        
        <div className="mb-4">
          <div className="text-text-muted mb-2 flex justify-between text-sm">
            <span>Rozwiązane quizy: {metrics.weeklyGoals.completed}/{metrics.weeklyGoals.target}</span>
            <span>{metrics.weeklyGoals.percentage}%</span>
          </div>
          <div className="bg-surface h-3 w-full rounded-full">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${metrics.weeklyGoals.percentage}%` }}
            />
          </div>
        </div>
        
        <p className="text-text-muted text-sm">
          Zostało {metrics.weeklyGoals.target - metrics.weeklyGoals.completed} quizów do ukończenia celu tygodniowego.
        </p>
      </div>

      {/* Recent Badges */}
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Award className="text-yellow-500 h-5 w-5" />
          <h3 className="text-text text-lg font-semibold">Odznaki</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.badges.map((badge, index) => (
            <div
              key={index}
              className={`rounded-lg border p-3 ${
                badge.earned
                  ? "border-yellow-500/30 bg-yellow-500/10"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className={`h-4 w-4 ${badge.earned ? "text-yellow-500" : "text-text-muted"}`} />
                <span className={`text-sm font-medium ${badge.earned ? "text-text" : "text-text-muted"}`}>
                  {badge.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
