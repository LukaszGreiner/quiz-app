import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Play, Sparkles, Coffee } from "lucide-react";
import Btn from "../common/Btn";
import { getUserLocalDayRange } from "../../utils/dateUtils";

function TodayMotivation() {
  const { currentUser } = useAuth();
  const [hasPlayedToday, setHasPlayedToday] = useState(null); // null = loading, true/false = result
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTodayActivity = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Get user's local day range (handles timezone automatically)
        const { start: todayStartUTC, end: todayEndUTC } = getUserLocalDayRange();

        // Query quiz results for user's local today
        const resultsRef = collection(db, "quizResults");
        const q = query(
          resultsRef,
          where("userId", "==", currentUser.uid),
          where("completedAt", ">=", todayStartUTC),
          where("completedAt", "<=", todayEndUTC)
        );

        const snapshot = await getDocs(q);
        setHasPlayedToday(snapshot.size > 0);
      } catch (error) {
        console.error("Error checking today's activity:", error);
        setHasPlayedToday(false); // Default to showing motivation
      } finally {
        setLoading(false);
      }
    };

    checkTodayActivity();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="from-primary/5 to-accent/5 animate-pulse rounded-lg border border-border bg-gradient-to-r p-4 sm:rounded-xl sm:p-6">
        <div className="flex items-center gap-3">
          <div className="bg-surface h-10 w-10 rounded-full sm:h-12 sm:w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-surface h-4 w-48 rounded"></div>
            <div className="bg-surface h-3 w-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't show anything if user already played today
  if (hasPlayedToday) {
    return null;
  }

  const motivationMessages = [
    {
      title: "Nie przerwij swojej passy! 🔥",
      message: "Czy rozegrałeś już dzisiaj quiz? Utrzymaj swoją codzienną passę!",
      icon: Coffee,
      color: "text-orange-500",
      bgColor: "from-orange-500/5 to-red-500/5",
      borderColor: "border-orange-500/20"
    },
    {
      title: "Daily streak czeka! 🎯",
      message: "Kontynuuj swoją codzienną passę - rozegraj quiz już dziś!",
      icon: Play,
      color: "text-green-500",
      bgColor: "from-green-500/5 to-emerald-500/5",
      borderColor: "border-green-500/20"
    },
    {
      title: "Zachowaj swoją passę! ⚡",
      message: "Dzisiaj jeszcze nie grałeś - czas na quiz, żeby utrzymać streak!",
      icon: Sparkles,
      color: "text-purple-500",
      bgColor: "from-purple-500/5 to-pink-500/5",
      borderColor: "border-purple-500/20"
    }
  ];

  // Choose random motivation message
  const motivation = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
  const Icon = motivation.icon;

  return (
    <div className={`rounded-lg border bg-gradient-to-r p-4 transition-all duration-200 hover:shadow-md sm:rounded-xl sm:p-6 ${motivation.bgColor} ${motivation.borderColor}`}>
      <div className="flex items-start gap-3 sm:items-center">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/80 sm:h-12 sm:w-12`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${motivation.color}`} />
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className="text-text mb-1 text-base font-semibold sm:text-lg">
            {motivation.title}
          </h4>
          <p className="text-text-muted mb-3 text-sm sm:text-base">
            {motivation.message}
          </p>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Btn
              variant="primary"
              size="sm"
              to="/app"
              className="w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4" />
              Rozegraj Quiz
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodayMotivation;
