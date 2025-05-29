import { useState } from "react";

function Achievements() {
  const [achievements] = useState([
    { id: 1, name: "Quiz Master", description: "Complete 10 quizzes" },
    { id: 2, name: "Streak Starter", description: "3-day streak" },
  ]);
  const [streak] = useState(5);
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
          <svg
            className="text-accent h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          {" "}
          <h3 className="font-heading text-text text-lg font-semibold">
            Achievements
          </h3>{" "}
          <p className="text-text-muted text-sm">Your progress milestones</p>
        </div>
      </div>

      <div className="from-accent/5 to-primary/5 border-border mb-6 rounded-xl border bg-gradient-to-r p-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-text-inverse h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
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
            <svg
              className="text-text-muted h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
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
                <div className="bg-primary/10 group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200">
                  <svg
                    className="text-primary h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
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
