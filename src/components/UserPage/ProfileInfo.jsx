import { User, Calendar, Activity } from "lucide-react";

function ProfileInfo({ displayName, creationTime, userId, lastLogin }) {
  return (
    <div>
      {" "}      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <User className="text-primary h-5 w-5" />
        </div>{" "}
        <div>
          <h3 className="font-heading text-text text-lg font-semibold">
            Informacje o profilu
          </h3>{" "}
          <p className="text-text-muted text-sm">Szczegóły Twojego konta</p>
        </div>
      </div>
      <div className="space-y-4">
        {/* Name */}        <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
          {" "}
          <label className="text-text-muted mb-1 block text-sm font-medium">
            Nazwa użytkownika
          </label>
          <p className="font-heading text-text text-lg font-semibold">
            {displayName || "Nie określono"}
          </p>
        </div>

        {/* UUID */}        {userId && (
          <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
            {" "}
            <label className="text-text-muted mb-1 block text-sm font-medium">
              ID użytkownika
            </label>
            <p className="text-text font-mono text-sm break-all">{userId}</p>
          </div>
        )}

        {/* Joined */}        <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
          {" "}
          <label className="text-text-muted mb-1 block text-sm font-medium">
            Członek od
          </label>{" "}
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            <p className="text-text">
              {creationTime
                ? new Date(creationTime).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Nieznana data"}
            </p>
          </div>
        </div>

        {/* Last Login */}        <div className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200">
          {" "}
          <label className="text-text-muted mb-1 block text-sm font-medium">
            Ostatnia aktywność
          </label>{" "}
          <div className="flex items-center gap-2">
            <div className="bg-correct h-2 w-2 animate-pulse rounded-full"></div>
            <Activity className="text-correct h-4 w-4" />
            <p className="text-text">
              {lastLogin && lastLogin !== "Nieznana"
                ? new Date(lastLogin).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Przed chwilą"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
