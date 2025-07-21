import { Star, Trophy, Zap } from "lucide-react";

export default function LevelBar({ currentUser, compact = false }) {
  const experience = currentUser?.experience || 0;
  const level = Math.floor(experience / 500) + 1;
  const experienceToNextLevel = 500 - (experience % 500);
  const progressPercentage = ((experience % 500) / 500) * 100;

  if (compact) {
    return (
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="text-accent h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-text text-xs font-medium sm:text-sm">Poziom {level}</span>
          </div>
          <span className="text-text-muted text-xs">{Math.floor(progressPercentage)}%</span>
        </div>
        <div className="bg-surface border-border h-2 w-full overflow-hidden rounded-full border">
          <div
            className="from-primary to-accent h-full rounded-full bg-gradient-to-r transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-accent/10 rounded-full p-1.5 sm:p-2">
            <Trophy className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h3 className="text-text text-base font-semibold sm:text-lg">Poziom {level}</h3>
            <p className="text-text-muted text-xs sm:text-sm">Twój postęp w nauce</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-text-muted text-xs font-medium sm:text-sm">
            Doświadczenie
          </div>
          <div className="text-text text-sm font-bold sm:text-lg">
            {experience.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-3 sm:mb-4">
        <div className="bg-surface border-border h-3 w-full overflow-hidden rounded-full border shadow-inner sm:h-4">
          <div
            className="from-primary via-accent to-secondary relative h-full overflow-hidden rounded-full bg-gradient-to-r transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>

        {/* Progress labels */}
        <div className="text-text-muted absolute -top-6 left-0 text-xs font-medium sm:-top-8">
          0 XP
        </div>
        <div className="text-text-muted absolute -top-6 right-0 text-xs font-medium sm:-top-8">
          {level * 500} XP
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Zap className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-text-muted text-xs sm:text-sm">
            <span className="text-primary font-medium">
              {experienceToNextLevel} XP
            </span>{" "}
            do następnego poziomu
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Star className="text-accent h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-text-muted text-xs font-medium">
            {Math.floor(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
}
