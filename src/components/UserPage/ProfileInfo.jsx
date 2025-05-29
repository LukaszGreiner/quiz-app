function ProfileInfo({ displayName, creationTime, userId, lastLogin }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <svg
            className="text-primary h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>{" "}
        <div>
          <h3 className="font-heading text-text text-lg font-semibold">
            Profile Information
          </h3>{" "}
          <p className="text-text-muted text-sm">Your account details</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
          {" "}
          <label className="text-text-muted mb-1 block text-sm font-medium">
            Display Name
          </label>
          <p className="font-heading text-text text-lg font-semibold">
            {displayName || "Not provided"}
          </p>
        </div>

        {/* UUID */}
        {userId && (
          <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
            {" "}
            <label className="text-text-muted mb-1 block text-sm font-medium">
              User ID
            </label>
            <p className="text-text font-mono text-sm break-all">{userId}</p>
          </div>
        )}

        {/* Joined */}
        <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
          {" "}
          <label className="text-text-muted mb-1 block text-sm font-medium">
            Member Since
          </label>
          <div className="flex items-center gap-2">
            <svg
              className="text-primary h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-text">
              {creationTime
                ? new Date(creationTime).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown"}
            </p>
          </div>
        </div>

        {/* Last Login */}
        <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
          {" "}
          <label className="text-text-muted mb-1 block text-sm font-medium">
            Last Active
          </label>
          <div className="flex items-center gap-2">
            <div className="bg-correct h-2 w-2 animate-pulse rounded-full"></div>
            <p className="text-text">
              {lastLogin && lastLogin !== "Unknown"
                ? new Date(lastLogin).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
