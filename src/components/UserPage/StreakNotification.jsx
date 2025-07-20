import { useState, useEffect } from "react";
import { Flame, Trophy, Target, Zap, Award } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";

function StreakNotification({ onClose, autoClose = 5000 }) {
  const { streakData, getStreakMessage } = useStreak();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Allow fade out animation
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  // Don't show notification if no streak data or currentStreak is 0
  if (!streakData || !visible || streakData.currentStreak === 0) return null;

  const getStreakIcon = () => {
    const { currentStreak } = streakData;
    if (currentStreak >= 30) return <Trophy className="h-6 w-6" />;
    if (currentStreak >= 7) return <Target className="h-6 w-6" />;
    if (currentStreak >= 3) return <Zap className="h-6 w-6" />;
    return <Flame className="h-6 w-6" />;
  };

  const getStreakColor = () => {
    const { currentStreak } = streakData;
    if (currentStreak >= 30) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    if (currentStreak >= 7) return "from-purple-500/20 to-pink-500/20 border-purple-500/30";
    if (currentStreak >= 3) return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
    return "from-accent/10 to-primary/10 border-accent/30";
  };

  const getStreakAchievement = () => {
    const { currentStreak } = streakData;
    if (currentStreak === 1) return "Passa rozpoczęta! 🎯";
    if (currentStreak === 3) return "Passa 3 dni! 🔥";
    if (currentStreak === 7) return "Wojownik tygodnia! 💪";
    if (currentStreak === 30) return "Mistrz miesiąca! 🏆";
    if (currentStreak === 100) return "Passa stulecia! 👑";
    return "Passa zaktualizowana! 📈";
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className={`rounded-xl border bg-gradient-to-r p-4 shadow-lg max-w-sm ${getStreakColor()}`}>
        <div className="flex items-center gap-3">
          <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
            <div className="text-text-inverse">
              {getStreakIcon()}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-text font-semibold text-sm">
              {getStreakAchievement()}
            </p>
            <p className="text-text-muted text-xs">
              Passa {streakData.currentStreak} dni
            </p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-text-muted hover:text-text text-sm"
          >
            ✕
          </button>
        </div>
        
        {/* Progress bar for current streak */}
        <div className="mt-3">
          <div className="text-text-muted mb-1 text-xs">
            {getStreakMessage()}
          </div>
          <div className="bg-surface-elevated border-border h-1.5 w-full rounded-full border">
            <div
              className="bg-accent h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((streakData.currentStreak % 7) * 14.3, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakNotification;
