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
        name: "Początek Passy",
        description: "Ukończ quizy przez 3 kolejne dni",
        icon: <Flame className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    if (currentStreak >= 7) {
      generatedAchievements.push({
        id: "streak-7",
        name: "Wojownik Tygodnia",
        description: "Ukończ quizy przez 7 kolejnych dni",
        icon: <Target className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    if (currentStreak >= 30) {
      generatedAchievements.push({
        id: "streak-30",
        name: "Mistrz Miesiąca",
        description: "Ukończ quizy przez 30 kolejnych dni",
        icon: <Trophy className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    if (longestStreak >= 100) {
      generatedAchievements.push({
        id: "streak-100",
        name: "Passa Stulecia",
        description: "Osiągnij passę 100 dni",
        icon: <Zap className="h-5 w-5" />,
        achieved: true,
        category: "streak"
      });
    }

    // Total quiz days achievements
    if (totalQuizDays >= 10) {
      generatedAchievements.push({
        id: "total-10",
        name: "Entuzjasta Quizów",
        description: "Ukończ quizy w 10 różnych dniach",
        icon: <Medal className="h-5 w-5" />,
        achieved: true,
        category: "total"
      });
    }

    if (totalQuizDays >= 50) {
      generatedAchievements.push({
        id: "total-50",
        name: "Mistrz Quizów",
        description: "Ukończ quizy w 50 różnych dniach",
        icon: <Award className="h-5 w-5" />,
        achieved: true,
        category: "total"
      });
    }

    if (totalQuizDays >= 100) {
      generatedAchievements.push({
        id: "total-100",
        name: "Legenda Quizów",
        description: "Ukończ quizy w 100 różnych dniach",
        icon: <Trophy className="h-5 w-5" />,
        achieved: true,
        category: "total"
      });
    }

    setAchievements(generatedAchievements);
  }, [streakData]);

  const handleStreakFreeze = async () => {
    if (!streakData?.canUseFreeze) return;      try {
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
      <div className="py-6 text-center sm:py-8">
        <div className="animate-pulse">
          <div className="bg-surface mx-auto mb-3 h-12 w-12 rounded-full sm:mb-4 sm:h-16 sm:w-16"></div>
          <p className="text-text-muted text-sm">Ładowanie osiągnięć...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center sm:py-8">
        <div className="bg-incorrect/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full sm:mb-4 sm:h-16 sm:w-16">
          <Award className="text-incorrect h-6 w-6 sm:h-8 sm:w-8" />
        </div>
        <p className="text-incorrect text-sm">Błąd podczas ładowania osiągnięć</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 sm:mb-6">
        <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10">
          <Award className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <h3 className="font-heading text-text text-base font-semibold sm:text-lg">
            Osiągnięcia
          </h3>
          <p className="text-text-muted text-xs sm:text-sm">Twoje kamienie milowe</p>
        </div>
      </div>

      {/* Current Streak Display */}
      {streakData && (
        <div className="from-accent/5 to-primary/5 border-border mb-4 rounded-lg border bg-gradient-to-r p-3 sm:mb-6 sm:rounded-xl sm:p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12">
                <Flame className="text-text-inverse h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-text text-base font-semibold sm:text-lg">
                  Passa {streakData.currentStreak} dni
                </p>
                <p className="text-text-muted text-xs sm:text-sm">
                  {getStreakMessage()}
                </p>
              </div>
            </div>
            
            {/* Streak Actions */}
            <div className="flex flex-col items-end gap-1 sm:gap-2">
              <div className="text-text-muted text-xs">
                Najd.: {streakData.longestStreak}
              </div>
              {streakData.canUseFreeze && streakData.freezesRemaining > 0 && (
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={handleStreakFreeze}
                  disabled={usingFreeze}
                  className="text-xs"
                >
                  <span className="hidden sm:inline">
                    {usingFreeze ? "Używanie..." : `Użyj Zamrożenia (${streakData.freezesRemaining})`}
                  </span>
                  <span className="sm:hidden">
                    {usingFreeze ? "..." : `🧊 ${streakData.freezesRemaining}`}
                  </span>
                </Btn>
              )}
            </div>
          </div>
          
          {/* Streak Progress */}
          <div className="mt-3 sm:mt-4">
            <div className="text-text-muted mb-1 flex justify-between text-xs sm:mb-2">
              <span>W tym miesiącu: {streakData.monthlyCompletionDates?.length || 0} dni</span>
              <span>{streakData.monthlyPercentage || 0}%</span>
            </div>
            <div className="bg-surface-elevated border-border h-1.5 w-full rounded-full border sm:h-2">
              <div
                className="bg-accent h-1.5 rounded-full transition-all duration-300 sm:h-2"
                style={{ width: `${Math.min(streakData.monthlyPercentage || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Achievements List */}
      {achievements.length === 0 ? (
        <div className="py-6 text-center sm:py-8">
          <div className="bg-surface mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full sm:mb-4 sm:h-16 sm:w-16">
            <Plus className="text-text-muted h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <p className="text-text-muted text-sm">Brak osiągnięć</p>
          <p className="text-text-muted mt-1 text-xs sm:text-sm">
            Ukończ quizy, aby odblokować osiągnięcia
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="group border-border bg-surface-elevated hover:bg-surface rounded-lg border p-3 transition-all duration-200 hover:shadow-md sm:rounded-xl sm:p-4"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 sm:h-10 sm:w-10">
                  <div className="[&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                    {achievement.icon}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <h4 className="text-text text-sm font-semibold sm:text-base">
                      {achievement.name}
                    </h4>
                    {achievement.achieved && (
                      <div className="bg-correct/10 text-correct self-start rounded-full px-1.5 py-0.5 text-xs font-medium sm:px-2 sm:py-1">
                        Odblokowane
                      </div>
                    )}
                  </div>
                  <p className="text-text-muted text-xs sm:text-sm">
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
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
          <div className="text-center">
            <div className="text-text text-base font-bold sm:text-lg">
              {streakData.currentStreak}
            </div>
            <div className="text-text-muted text-xs">Obecna Passa</div>
          </div>
          <div className="text-center">
            <div className="text-text text-base font-bold sm:text-lg">
              {streakData.longestStreak}
            </div>
            <div className="text-text-muted text-xs">Najdłuższa Passa</div>
          </div>
          <div className="text-center">
            <div className="text-text text-base font-bold sm:text-lg">
              {streakData.totalQuizDays}
            </div>
            <div className="text-text-muted text-xs">Łączne Dni Quizów</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Achievements;
