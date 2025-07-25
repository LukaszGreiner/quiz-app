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
        showSuccess("Użyto zamrożenia passy! Twoja passa jest chroniona na dziś.");
      } catch (err) {
        showError(err.message || "Nie udało się użyć zamrożenia passy");
      } finally {
        setUsingFreeze(false);
      }
  };

  if (loading) {
    return (
      <div className="from-accent/5 to-primary/5 border-border rounded-lg border bg-gradient-to-r p-3 sm:rounded-xl sm:p-4">
        <div className="animate-pulse">
          <div className="bg-surface mx-auto mb-2 h-8 w-8 rounded-full sm:h-10 sm:w-10"></div>
          <div className="bg-surface mx-auto h-3 w-20 rounded sm:h-4 sm:w-24"></div>
        </div>
      </div>
    );
  }

  if (error || !streakData) {
    return (
      <div className="from-accent/5 to-primary/5 border-border rounded-lg border bg-gradient-to-r p-3 sm:rounded-xl sm:p-4">
        <div className="text-center">
          <Flame className="text-accent mx-auto mb-2 h-6 w-6 sm:h-8 sm:w-8" />
          <p className="text-text-muted text-xs sm:text-sm">Rozpocznij swoją passę już dziś!</p>
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
      <div className={`rounded-lg border bg-gradient-to-r p-3 sm:rounded-xl sm:p-4 ${getStreakColor()}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10">
            <div className="text-text-inverse [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
              {getStreakIcon()}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text text-sm font-semibold sm:text-base">
              Passa {streakData.currentStreak} dni
            </p>
            <p className="text-text-muted text-xs">
              Najdłuższa: {streakData.longestStreak}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-gradient-to-r p-4 sm:rounded-xl sm:p-6 ${getStreakColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
            <div className="text-text-inverse [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
              {getStreakIcon()}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-text text-base font-semibold sm:text-lg">
              Passa {streakData.currentStreak} dni
            </p>
            <p className="text-text-muted text-sm">
              {getStreakMessage()}
            </p>
          </div>
        </div>
        
        {showActions && (
          <div className="flex flex-col items-end gap-2">
            <div className="text-text-muted text-xs">
              Najdłuższa: {streakData.longestStreak} dni
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
                <span className="hidden sm:inline">{usingFreeze ? "Używanie..." : `Zamroź (${streakData.freezesRemaining})`}</span>
                <span className="sm:hidden">{streakData.freezesRemaining}</span>
              </Btn>
            )}
          </div>
        )}
      </div>
      
      {/* Monthly Progress */}
      <div className="mt-4">
        <div className="text-text-muted mb-2 flex justify-between text-xs">
          <span>W tym miesiącu: {streakData.monthlyCompletionDates?.length || 0} dni</span>
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
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="text-center">
          <div className="text-text text-sm font-bold sm:text-base">
            {streakData.currentStreak}
          </div>
          <div className="text-text-muted text-xs">Obecna</div>
        </div>
        <div className="text-center">
          <div className="text-text text-sm font-bold sm:text-base">
            {streakData.longestStreak}
          </div>
          <div className="text-text-muted text-xs">Najlepsza</div>
        </div>
        <div className="text-center">
          <div className="text-text text-sm font-bold sm:text-base">
            {streakData.totalQuizDays}
          </div>
          <div className="text-text-muted text-xs">Łącznie</div>
        </div>
      </div>
    </div>
  );
}

export default StreakCard;
