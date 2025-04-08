import { useAuth } from "../../context/AuthContext";

export default function LevelBar({ currentUser }) {
  const experience = currentUser?.experience || 0;
  const level = Math.floor(experience / 500) + 1;
  const experienceToNextLevel = 500 - (experience % 500);
  const progressPercentage = ((experience % 500) / 500) * 100;

  console.log(currentUser);

  return (
    <div className="mb-8">
      {currentUser.email}
      <label className="mb-2 block text-sm font-medium text-gray-600">
        Level {level}
      </label>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {experience} / 500 XP •{" "}
        <span className="font-medium">{experienceToNextLevel} XP</span> to next
        level
      </p>
    </div>
  );
}
