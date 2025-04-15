import { useState } from "react";

function Achievements() {
  const [achievements] = useState([
    { id: 1, name: "Quiz Master", description: "Complete 10 quizzes" },
    { id: 2, name: "Streak Starter", description: "3-day streak" },
  ]);
  const [streak] = useState(5);

  return (
    <div className="mb-6">
      <label className="mb-1 block text-sm font-medium text-gray-600">
        Achievements & Daily Streak
      </label>
      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-900">
          Daily Streak: {streak} days
        </p>
      </div>
      {achievements.length === 0 ? (
        <p className="text-gray-500">No achievements yet.</p>
      ) : (
        <ul className="space-y-2">
          {achievements.map((achievement) => (
            <li
              key={achievement.id}
              className="rounded-lg border border-gray-200 p-3 text-gray-900"
            >
              {achievement.name}: {achievement.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Achievements;