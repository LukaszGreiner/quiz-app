import { Flame, Calendar, Trophy, Target, Zap, Shield } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import { showSuccess, showError } from "../../utils/toastUtils";
import Btn from "../common/Btn";
import { useState } from "react";

function StreakCard({ compact = false, showActions = true }) {
  const { streakData, loading, error, useStreakFreeze, getStreakMessage } = useStreak();
  const [usingFreeze, setUsingFreeze] = useState(false);

  const handleStreakFreeze = async () => {
    if (!streakData?.canUseFreeze) return;

    try {
      setUsingFreeze(true);
      await useStreakFreeze();
      showSuccess("Streak freeze used! Your streak is protected for today.");
    } catch (err) {
      showError(err.message || "Failed to use streak freeze");
    } finally {
      setUsingFreeze(false);
    }
  };

  if (loading) {
    return (
      <div className="from-accent/5 to-primary/5 border-border rounded-xl border bg-gradient-to-r p-4">
        <div className="animate-pulse">
          <div className="bg-surface mx-auto mb-2 h-8 w-8 rounded-full"></div>
          <div className="bg-surface mx-auto h-4 w-24 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !streakData) {
    return (
      <div className="from-accent/5 to-primary/5 border-border rounded-xl border bg-gradient-to-r p-4">
        <div className="text-center">
          <Flame className="text-accent mx-auto mb-2 h-8 w-8" />
          <p className="text-text-muted text-sm">Start your streak today!</p>
        </div>
      </div>
    );
  }

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
    return "from-accent/5 to-primary/5 border-border";
  };

  if (compact) {
    return (
      <div className={`rounded-lg border bg-gradient-to-r p-3 ${getStreakColor()}`}>
        <div className="flex items-center gap-2">
          <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full">
            {getStreakIcon()}
          </div>
          <div>
            <p className="text-text font-semibold">
              {streakData.currentStreak} Day Streak
            </p>
            <p className="text-text-muted text-xs">
              Longest: {streakData.longestStreak}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border bg-gradient-to-r p-4 ${getStreakColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
            <div className="text-text-inverse">
              {getStreakIcon()}
            </div>
          </div>
          <div>
            <p className="font-heading text-text text-lg font-semibold">
              {streakData.currentStreak} Day Streak
            </p>
            <p className="text-text-muted text-sm">
              {getStreakMessage()}
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="flex flex-col items-end gap-2">
            <div className="text-text-muted text-xs">
              Longest: {streakData.longestStreak} days
            </div>
            {streakData.canUseFreeze && streakData.freezesRemaining > 0 && (
              <Btn
                variant="secondary"
                size="sm"
                onClick={handleStreakFreeze}
                disabled={usingFreeze}
                className="text-xs"
              >
                <Shield className="mr-1 h-3 w-3" />
                {usingFreeze ? "Using..." : `Freeze (${streakData.freezesRemaining})`}
              </Btn>
            )}
          </div>
        )}
      </div>
      
      {/* Monthly Progress */}
      <div className="mt-4">
        <div className="text-text-muted mb-2 flex justify-between text-xs">
          <span>This Month: {streakData.monthlyCompletionDates?.length || 0} days</span>
          <span>{streakData.monthlyPercentage || 0}%</span>
        </div>
        <div className="bg-surface-elevated border-border h-2 w-full rounded-full border">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(streakData.monthlyPercentage || 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-text text-sm font-bold">
            {streakData.currentStreak}
          </div>
          <div className="text-text-muted text-xs">Current</div>
        </div>
        <div className="text-center">
          <div className="text-text text-sm font-bold">
            {streakData.longestStreak}
          </div>
          <div className="text-text-muted text-xs">Best</div>
        </div>
        <div className="text-center">
          <div className="text-text text-sm font-bold">
            {streakData.totalQuizDays}
          </div>
          <div className="text-text-muted text-xs">Total</div>
        </div>
      </div>
    </div>
  );
}

export default StreakCard;
