import { Trophy, BookOpen, Clock, Target } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserStatistics } from "../../services/statisticsService";

const QuickStatsCard = memo(function QuickStatsCard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser) return;

      try {
        const userStats = await fetchUserStatistics(currentUser.uid);
        setStats(userStats);
      } catch (error) {
        console.error("Error loading quick stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        <div className="animate-pulse space-y-4">
          <div className="bg-surface h-4 w-32 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="bg-surface h-8 w-8 rounded-full"></div>
                <div className="bg-surface h-4 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      label: "Rozwiązane quizy",
      value: stats?.totalQuizzesCompleted || 0,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Średni wynik",
      value: stats?.averageScore ? `${Math.round(stats.averageScore)}%` : "0%",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Czas nauki",
      value: stats?.totalTimeSpent ? `${Math.round(stats.totalTimeSpent / 60)}min` : "0min",
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Ulubiona kategoria",
      value: stats?.favoriteCategory || "Brak",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-6">
      <h3 className="text-text mb-4 text-lg font-semibold">Szybkie statystyki</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-text text-sm font-bold">{stat.value}</div>
              <div className="text-text-muted text-xs">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default QuickStatsCard;
