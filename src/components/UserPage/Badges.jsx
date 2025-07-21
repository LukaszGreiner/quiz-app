import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Award } from "lucide-react";

function Badges() {
  const { currentUser } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      if (!currentUser) return;

      try {
        // Mock data - replace with real data from statistics service
        const mockBadges = [
          { name: "Mistrz historii", earned: true, description: "Ukończ 10 quizów z historii" },
          { name: "Szybka odpowiedź", earned: true, description: "Odpowiedz w mniej niż 5 sekund" },
          { name: "Perfekcjonista", earned: false, description: "Zdobądź 100% w quizie" },
          { name: "Maraton", earned: true, description: "Ukończ 5 quizów w ciągu dnia" },
          { name: "Ekspert", earned: false, description: "Osiągnij średnią 90%" },
          { name: "Odkrywca", earned: true, description: "Ukończ quiz z każdej kategorii" },
        ];

        setBadges(mockBadges);
      } catch (error) {
        console.error("Error loading badges:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, [currentUser]);

  if (loading) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2 sm:mb-6">
          <Award className="text-yellow-500 h-4 w-4 sm:h-5 sm:w-5" />
          <h3 className="text-text text-base font-semibold sm:text-lg">Odznaki</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center gap-2">
                <div className="bg-surface-elevated h-4 w-4 rounded"></div>
                <div className="bg-surface-elevated h-4 w-20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <Award className="text-yellow-500 h-4 w-4 sm:h-5 sm:w-5" />
          <h3 className="text-text text-base font-semibold sm:text-lg">Odznaki</h3>
        </div>
        <div className="text-text-muted text-xs sm:text-sm">
          {earnedBadges.length} z {badges.length} zdobytych
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`group rounded-lg border p-3 transition-all duration-200 hover:shadow-sm ${
              badge.earned
                ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20"
                : "border-border bg-surface hover:bg-surface-elevated"
            }`}
          >
            <div className="flex items-start gap-2">
              <Award className={`mt-0.5 h-4 w-4 flex-shrink-0 ${badge.earned ? "text-yellow-500" : "text-text-muted"}`} />
              <div className="min-w-0 flex-1">
                <span className={`block text-sm font-medium ${badge.earned ? "text-text" : "text-text-muted"}`}>
                  {badge.name}
                </span>
                {badge.description && (
                  <span className={`mt-1 block text-xs ${badge.earned ? "text-text-muted" : "text-text-muted/70"}`}>
                    {badge.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="bg-surface border-border h-2 w-full rounded-full border">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
          />
        </div>
        <p className="text-text-muted mt-2 text-center text-xs">
          Postęp: {earnedBadges.length}/{badges.length} odznak
        </p>
      </div>
    </div>
  );
}

export default Badges;
