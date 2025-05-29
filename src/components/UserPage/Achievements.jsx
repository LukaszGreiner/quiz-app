import { useState } from "react";
import { Award, Flame, Medal, Plus } from "lucide-react";

function Achievements() {
  const [achievements] = useState([
    { id: 1, name: "Quiz Master", description: "Complete 10 quizzes" },
    { id: 2, name: "Streak Starter", description: "3-day streak" },
  ]);
  const [streak] = useState(5);
  return (
    <div>
      {" "}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
          <Award className="text-accent h-5 w-5" />
        </div>
        <div>
          {" "}
          <h3 className="font-heading text-text text-lg font-semibold">
            Achievements
          </h3>{" "}
          <p className="text-text-muted text-sm">Your progress milestones</p>
        </div>
      </div>{" "}
      <div className="from-accent/5 to-primary/5 border-border mb-6 rounded-xl border bg-gradient-to-r p-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
            <Flame className="text-text-inverse h-6 w-6" />
          </div>
          <div>
            {" "}
            <p className="font-heading text-text text-lg font-semibold">
              {streak} Day Streak
            </p>{" "}
            <p className="text-text-muted text-sm">Keep up the great work!</p>
          </div>
        </div>
      </div>
      {achievements.length === 0 ? (
        <div className="py-8 text-center">
          <div className="bg-surface mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Plus className="text-text-muted h-8 w-8" />
          </div>{" "}
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
                {" "}
                <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200">
                  <Medal className="text-primary h-5 w-5" />
                </div>
                <div className="flex-1">
                  {" "}
                  <h4 className="text-text font-semibold">
                    {achievement.name}
                  </h4>
                  <p className="text-text-muted text-sm">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Achievements;
