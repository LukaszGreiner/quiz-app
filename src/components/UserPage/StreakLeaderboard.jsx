import { useState, useEffect } from "react";
import { Flame, Trophy, Medal, Crown } from "lucide-react";
import { streakService } from "../../services/streakService";

function StreakLeaderboard({ limit = 10, showTitle = true }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await streakService.getStreakLeaderboard(limit);
        setLeaderboard(data);
      } catch (err) {
        console.error("Error fetching streak leaderboard:", err);
        setError("Nie udało się załadować rankingu pass");
        // Set empty leaderboard on error to allow graceful fallback
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500 h-5 w-5" />;
      case 2:
        return <Trophy className="text-gray-400 h-5 w-5" />;
      case 3:
        return <Medal className="text-amber-600 h-5 w-5" />;
      default:
        return <Flame className="text-accent h-5 w-5" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/10 to-orange-500/10 border-yellow-500/20";
      case 2:
        return "from-gray-400/10 to-gray-500/10 border-gray-400/20";
      case 3:
        return "from-amber-600/10 to-amber-700/10 border-amber-600/20";
      default:
        return "from-surface-elevated to-surface border-border";
    }
  };

  if (loading) {
    return (
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        {showTitle && (
          <div className="mb-4 flex items-center gap-2">
            <Flame className="text-accent h-5 w-5" />
            <h3 className="text-text font-semibold">Ranking Pass</h3>
          </div>
        )}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface h-12 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        {showTitle && (
          <div className="mb-4 flex items-center gap-2">
            <Flame className="text-accent h-5 w-5" />
            <h3 className="text-text font-semibold">Ranking Pass</h3>
          </div>
        )}
        <div className="text-center">
          <p className="text-text-muted">Nie udało się załadować rankingu</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-surface-elevated border-border rounded-xl border p-6">
        {showTitle && (
          <div className="mb-4 flex items-center gap-2">
            <Flame className="text-accent h-5 w-5" />
            <h3 className="text-text font-semibold">Ranking Pass</h3>
          </div>
        )}
        <div className="text-center">
          <Flame className="text-text-muted mx-auto mb-2 h-8 w-8" />
          <p className="text-text-muted">Brak aktywnych pass</p>
          <p className="text-text-muted mt-1 text-sm">
            Ukończ quizy codziennie, aby się tu pojawić!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-6">
      {showTitle && (
        <div className="mb-4 flex items-center gap-2">
          <Flame className="text-accent h-5 w-5" />
          <h3 className="text-text font-semibold">Ranking Pass</h3>
        </div>
      )}
      
      <div className="space-y-2">
        {leaderboard.map((user, index) => {
          const rank = index + 1;
          return (
            <div
              key={user.userId}
              className={`rounded-lg border bg-gradient-to-r p-3 transition-all duration-200 hover:shadow-md ${getRankColor(rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(rank)}
                    <span className="text-text-muted text-sm font-medium">
                      #{rank}
                    </span>
                  </div>
                  <div>
                    <p className="text-text font-medium">
                      {user.username}
                    </p>
                    <p className="text-text-muted text-xs">
                      {user.totalQuizDays} dni quizów łącznie
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-text text-lg font-bold">
                    {user.currentStreak}
                  </p>
                  <p className="text-text-muted text-xs">
                    dni
                  </p>
                </div>
              </div>
              
              {user.longestStreak > user.currentStreak && (
                <div className="mt-2 text-text-muted text-xs">
                  Najlepsza passa: {user.longestStreak} dni
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {leaderboard.length < limit && (
        <div className="mt-4 text-center">
          <p className="text-text-muted text-sm">
            Rozpocznij swoją passę, aby dołączyć do rankingu!
          </p>
        </div>
      )}
    </div>
  );
}

export default StreakLeaderboard;
