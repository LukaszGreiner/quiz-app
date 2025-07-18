import { useState, useEffect } from "react";
import { Award, Flame, Medal, Plus, Calendar, Trophy, Target, Zap } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import { showSuccess, showError } from "../../utils/toastUtils";
import Btn from "../common/Btn";

function Achievements() {
  const { streakData, loading, error, useStreakFreeze, getStreakMessage } = useStreak();
  const [achievements, setAchievements] = useState([]);
  const [usingFreeze, setUsingFreeze] = useState(false);

  // Generate achievements based on streak data
  useEffect(() => {
    if (!streakData) return;

    const generatedAchievements = [];
    const { currentStreak, longestStreak, totalQuizDays } = streakData;

    // Streak achievements
    if (currentStreak >= 3) {
      generatedAchievements.push({
        id: "streak-3",
        name: "Streak Starter",
        description: "Complete quizzes for 3 consecutive days",
        icon: <Flame className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    if (currentStreak >= 7) {
      generatedAchievements.push({
        id: "streak-7",
        name: "Week Warrior",
        description: "Complete quizzes for 7 consecutive days",
        icon: <Target className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    if (currentStreak >= 30) {
      generatedAchievements.push({
        id: "streak-30",
        name: "Month Master",
        description: "Complete quizzes for 30 consecutive days",
        icon: <Trophy className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    if (longestStreak >= 100) {
      generatedAchievements.push({
        id: "streak-100",
        name: "Century Streak",
        description: "Achieve a 100-day streak",
        icon: <Zap className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    // Total quiz days achievements
    if (totalQuizDays >= 10) {
      generatedAchievements.push({
        id: "total-10",
        name: "Quiz Enthusiast",
        description: "Complete quizzes on 10 different days",
        icon: <Medal className="h-5 w-5" />,
        achieved: true,
        category: "total"
      });
    }

    if (totalQuizDays >= 50) {
      generatedAchievements.push({
        id: "total-50",
        name: "Quiz Master",
        description: "Complete quizzes on 50 different days",
        icon: <Award className="h-5 w-5" />,
        achieved: true,
        category: "total"
      });
    }

    if (totalQuizDays >= 100) {
      generatedAchievements.push({
        id: "total-100",
        name: "Quiz Legend",
        description: "Complete quizzes on 100 different days",
        icon: <Trophy className="h-5 w-5" />,
        achieved: true,
        category: "total"
      });
    }

    setAchievements(generatedAchievements);
  }, [streakData]);

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
      <div className="py-8 text-center">
        <div className="animate-pulse">
          <div className="bg-surface mx-auto mb-4 h-16 w-16 rounded-full"></div>
          <p className="text-text-muted">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-incorrect/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Award className="text-incorrect h-8 w-8" />
        </div>
        <p className="text-incorrect">Error loading achievements</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
          <Award className="text-accent h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-text text-lg font-semibold">
            Achievements
          </h3>
          <p className="text-text-muted text-sm">Your progress milestones</p>
        </div>
      </div>

      {/* Current Streak Display */}
      {streakData && (
        <div className="from-accent/5 to-primary/5 border-border mb-6 rounded-xl border bg-gradient-to-r p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                <Flame className="text-text-inverse h-6 w-6" />
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
            
            {/* Streak Actions */}
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
                  {usingFreeze ? "Using..." : `Use Freeze (${streakData.freezesRemaining})`}
                </Btn>
              )}
            </div>
          </div>
          
          {/* Streak Progress */}
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
        </div>
      )}

      {/* Achievements List */}
      {achievements.length === 0 ? (
        <div className="py-8 text-center">
          <div className="bg-surface mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Plus className="text-text-muted h-8 w-8" />
          </div>
          <p className="text-text-muted">No achievements yet</p>
          <p className="text-text-muted mt-1 text-sm">
            Complete quizzes to unlock achievements
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="group border-border bg-surface-elevated hover:bg-surface rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-text font-semibold">
                      {achievement.name}
                    </h4>
                    {achievement.achieved && (
                      <div className="bg-correct/10 text-correct rounded-full px-2 py-1 text-xs font-medium">
                        Unlocked
                      </div>
                    )}
                  </div>
                  <p className="text-text-muted text-sm">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Streak Stats */}
      {streakData && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-text text-lg font-bold">
              {streakData.currentStreak}
            </div>
            <div className="text-text-muted text-xs">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-text text-lg font-bold">
              {streakData.longestStreak}
            </div>
            <div className="text-text-muted text-xs">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-text text-lg font-bold">
              {streakData.totalQuizDays}
            </div>
            <div className="text-text-muted text-xs">Total Quiz Days</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Achievements;
