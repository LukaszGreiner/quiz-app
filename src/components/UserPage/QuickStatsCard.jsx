import { Trophy, BookOpen, Clock, Target, Flame } from "lucide-react";
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
      <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="bg-surface h-3 w-24 rounded sm:h-4 sm:w-32"></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 text-center">
                <div className="bg-surface mx-auto h-8 w-8 rounded-full sm:h-10 sm:w-10"></div>
                <div className="bg-surface mx-auto h-3 w-12 rounded sm:h-4 sm:w-16"></div>
                <div className="bg-surface mx-auto h-2 w-16 rounded sm:h-3 sm:w-20"></div>
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
      label: "Aktualna passa",
      value: stats?.currentStreak ? `${stats.currentStreak} dni` : "0 dni",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Ulubiona kategoria",
      value: stats?.favoriteCategory || "Brak danych",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
      <h3 className="text-text mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Statystyki</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
              <div className="text-text text-sm font-bold sm:text-base">{stat.value}</div>
              <div className="text-text-muted text-xs leading-tight">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default QuickStatsCard;
