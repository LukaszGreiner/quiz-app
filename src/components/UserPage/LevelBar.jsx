export default function LevelBar({ currentUser }) {
  const experience = currentUser?.experience || 0;
  const level = Math.floor(experience / 500) + 1;
  const experienceToNextLevel = 500 - (experience % 500);
  const progressPercentage = ((experience % 500) / 500) * 100;
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        {" "}
        <h3 className="font-heading text-text text-lg font-semibold">
          Level {level}
        </h3>{" "}
        <span className="text-text-muted text-sm font-medium">
          {experience} XP
        </span>
      </div>

      <div className="bg-surface border-border relative h-4 w-full overflow-hidden rounded-full border">
        <div
          className="from-primary to-accent absolute h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="mt-2 flex items-center justify-between">
        {" "}
        <p className="text-text-muted text-sm">
          <span className="text-primary font-medium">
            {experienceToNextLevel} XP
          </span>{" "}
          to next level
        </p>
        <div className="flex items-center gap-1">
          <svg
            className="text-accent h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-quicksand text-text-muted text-xs">
            {Math.floor(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
}
