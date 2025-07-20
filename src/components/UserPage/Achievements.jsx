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
      <div className="py-8 text-center">
        <div className="animate-pulse">
          <div className="bg-surface mx-auto mb-4 h-16 w-16 rounded-full"></div>
          <p className="text-text-muted">Ładowanie osiągnięć...</p>
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
        <p className="text-incorrect">Błąd podczas ładowania osiągnięć</p>
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
            Osiągnięcia
          </h3>
          <p className="text-text-muted text-sm">Twoje kamienie milowe</p>
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
                  Passa {streakData.currentStreak} dni
                </p>
                <p className="text-text-muted text-sm">
                  {getStreakMessage()}
                </p>
              </div>
            </div>
            
            {/* Streak Actions */}
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
                  {usingFreeze ? "Używanie..." : `Użyj Zamrożenia (${streakData.freezesRemaining})`}
                </Btn>
              )}
            </div>
          </div>
          
          {/* Streak Progress */}
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
        </div>
      )}

      {/* Achievements List */}
      {achievements.length === 0 ? (
        <div className="py-8 text-center">
          <div className="bg-surface mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Plus className="text-text-muted h-8 w-8" />
          </div>
          <p className="text-text-muted">Brak osiągnięć</p>
          <p className="text-text-muted mt-1 text-sm">
            Ukończ quizy, aby odblokować osiągnięcia
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
                        Odblokowane
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
            <div className="text-text-muted text-xs">Obecna Passa</div>
          </div>
          <div className="text-center">
            <div className="text-text text-lg font-bold">
              {streakData.longestStreak}
            </div>
            <div className="text-text-muted text-xs">Najdłuższa Passa</div>
          </div>
          <div className="text-center">
            <div className="text-text text-lg font-bold">
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
