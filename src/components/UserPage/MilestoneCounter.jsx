import { Target, Award, Trophy, Zap, Medal } from "lucide-react";
import useUserData from "../../hooks/useUserData";

function MilestoneCounter() {
  const { userData, loading } = useUserData();
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-surface-elevated h-36 sm:h-44 rounded-xl"></div>
      </div>
    );
  }

  // Get number of completed quizzes from userData
  const completedQuizzes = userData?.quizStats?.completed || 0;
  
  // Define milestones with their achievements
  const milestones = [
    { count: 10, name: "Debiutant", icon: <Zap />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { count: 25, name: "Regularny", icon: <Medal />, color: "text-green-500", bgColor: "bg-green-500/10" },
    { count: 50, name: "Zaangażowany", icon: <Award />, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
    { count: 100, name: "Ekspert", icon: <Trophy />, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { count: 250, name: "Mistrz", icon: <Award />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { count: 500, name: "Guru", icon: <Trophy />, color: "text-pink-500", bgColor: "bg-pink-500/10" },
    { count: 1000, name: "Legenda", icon: <Trophy />, color: "text-primary", bgColor: "bg-primary/10" }
  ];
  
  // Find current milestone level
  const currentMilestoneIndex = milestones.findIndex(milestone => milestone.count > completedQuizzes);
  const currentMilestoneLevel = currentMilestoneIndex > 0 ? currentMilestoneIndex - 1 : -1;
  
  // Find next milestone
  const nextMilestone = milestones[Math.max(0, currentMilestoneIndex)];
  
  // Calculate progress percentage
  const previousMilestoneCount = currentMilestoneIndex > 0 ? milestones[currentMilestoneIndex - 1].count : 0;
  const progress = Math.min(100, Math.round(((completedQuizzes - previousMilestoneCount) / (nextMilestone.count - previousMilestoneCount)) * 100));
  
  // Calculate remaining quizzes
  const remaining = nextMilestone.count - completedQuizzes;
  
  // Create achievement details
  const nextAchievementName = `${nextMilestone.name} Quiz`;
  const nextAchievementDescription = `Ukończ jeszcze ${remaining} ${remaining === 1 ? 'quiz' : remaining < 5 ? 'quizy' : 'quizów'}`;
  
  return (
    <div className="bg-surface-elevated border-border rounded-xl border p-5 sm:p-6 w-full shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full">
            <Target className="text-primary h-5 w-5" />
          </div>
          <h3 className="text-text text-sm sm:text-base font-semibold">Kolejne osiągnięcie</h3>
        </div>
        <div className="text-text font-bold text-sm sm:text-base">
          {completedQuizzes}/{nextMilestone.count}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-surface">
        <div 
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Next Achievement Card */}
      <div className="flex items-center gap-4 rounded-lg bg-surface p-3.5 sm:p-4 shadow-sm">
        <div className={`${nextMilestone.bgColor} flex h-11 w-11 items-center justify-center rounded-full`}>
          <div className={`${nextMilestone.color} h-5 w-5`}>
            {nextMilestone.icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-text font-medium text-sm sm:text-base">{nextAchievementName}</p>
          <p className="text-text-muted text-xs sm:text-sm">{nextAchievementDescription}</p>
        </div>
      </div>
      
      {/* Current Status */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-text-muted text-xs sm:text-sm">
          {currentMilestoneLevel >= 0 
            ? `Aktualny poziom: ${milestones[currentMilestoneLevel].name} (${milestones[currentMilestoneLevel].count} quizów)`
            : "Ukończ swój pierwszy quiz, aby zdobyć odznakę!"
          }
        </p>
      </div>
    </div>
  );
}

export default MilestoneCounter;
