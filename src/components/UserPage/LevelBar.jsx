import { Star, Trophy, Zap } from "lucide-react";

export default function LevelBar({ currentUser }) {
  const experience = currentUser?.experience || 0;
  const level = Math.floor(experience / 500) + 1;
  const experienceToNextLevel = 500 - (experience % 500);
  const progressPercentage = ((experience % 500) / 500) * 100;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 rounded-full p-2">
            <Trophy className="text-accent h-5 w-5" />
          </div>
          <div>
            <h3 className="text-text text-lg font-semibold">Poziom {level}</h3>
            <p className="text-text-muted text-sm">Twój postęp w nauce</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-text-muted text-sm font-medium">
            Doświadczenie
          </div>
          <div className="text-text text-lg font-bold">
            {experience.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="bg-surface border-border h-4 w-full overflow-hidden rounded-full border shadow-inner">
          <div
            className="from-primary via-accent to-secondary relative h-full overflow-hidden rounded-full bg-gradient-to-r transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>

        {/* Progress labels */}
        <div className="text-text-muted absolute -top-8 left-0 text-xs font-medium">
          0 XP
        </div>
        <div className="text-text-muted absolute -top-8 right-0 text-xs font-medium">
          {level * 500} XP
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="text-primary h-4 w-4" />
          <span className="text-text-muted text-sm">
            <span className="text-primary font-medium">
              {experienceToNextLevel} XP
            </span>{" "}
            do następnego poziomu
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Star className="text-accent h-4 w-4" />
          <span className="text-text-muted text-xs font-medium">
            {Math.floor(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
}
