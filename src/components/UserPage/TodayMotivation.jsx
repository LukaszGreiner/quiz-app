import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStreak } from "../../hooks/useStreak";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Play, Sparkles, Coffee, Heart, Clock, RotateCcw } from "lucide-react";
import Btn from "../common/Btn";
import { getUserLocalDayRange, getTimeUntilEndOfDay } from "../../utils/dateUtils";

function TodayMotivation({ onOpenReviveModal }) {
  const { currentUser } = useAuth();
  const { streakData } = useStreak();
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
        const hasPlayed = snapshot.size > 0;
        setHasPlayedToday(hasPlayed);
      } catch (error) {
        console.error("Error checking today's activity:", error);
        setHasPlayedToday(false); // Default to showing motivation
      } finally {
        setLoading(false);
      }
    };

    checkTodayActivity();
  }, [currentUser, streakData]);

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

  // Don't show anything if user already played today AND can't revive
  // If user can revive, always show the revive option regardless of today's activity
  if (hasPlayedToday && !streakData?.canRevive) {
    return null;
  }

  // If user can revive streak, show revive motivation instead
  if (streakData?.canRevive) {
    const timeRemaining = getTimeUntilEndOfDay();
    
    return (
      <div className="rounded-lg border bg-gradient-to-r p-4 transition-all duration-200 hover:shadow-md sm:rounded-xl sm:p-6 from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <div className="flex items-start gap-6 sm:items-center">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 sm:h-12 sm:w-12">
            {/* <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> */}
                <RotateCcw className="h-7 w-7 text-white" />

          </div>
          
          <div className="min-w-0 flex-1">
            <h4 className="text-text mb-1 text-base font-semibold sm:text-lg">
            Twoja passa została przerwana! 
            </h4>
            <p className="text-text-muted mb-2 text-sm sm:text-base">
              💡Możesz użyć przywracacza passy jeśli jest dostępny.
            </p>
            {timeRemaining && (
              <div className="flex items-center gap-1 mb-3 text-sm text-blue-600 dark:text-blue-400">
                <Clock className="h-4 w-4" />
                <span>Do końca dnia: {timeRemaining}</span>
              </div>
            )}
            
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Btn
                variant="primary"
                size="sm"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => onOpenReviveModal && onOpenReviveModal()}
              >
                Przywróć passę
              </Btn>
              
              <Btn
                variant="outline"
                size="sm"
                to="/app"
              >
                <div className="flex items-center justify-center py-1">
                  <Play className="mr-2 h-4 w-4" />
                  <span className="mt-[4px]">Graj dalej</span>
                </div>
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
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
