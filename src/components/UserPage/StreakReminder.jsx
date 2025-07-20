import { useState, useEffect } from "react";
import { Clock, Flame, Target, AlertTriangle } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import Btn from "../common/Btn";

function StreakReminder({ compact = false }) {
  const { streakData, needsQuizToday, isStreakInDanger } = useStreak();
  const [timeLeft, setTimeLeft] = useState("");

  // Calculate time left in the day
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft("0h 0m");
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!streakData) return null;

  const shouldShowReminder = needsQuizToday() || isStreakInDanger();
  
  if (!shouldShowReminder) return null;

  const getReminderIcon = () => {
    if (isStreakInDanger()) return <AlertTriangle className="h-5 w-5" />;
    return <Clock className="h-5 w-5" />;
  };

  const getReminderText = () => {
    if (isStreakInDanger()) {
      return "Twoja passa jest zagrożona! Ukończ quiz, aby ją odzyskać.";
    }
    return "Ukończ quiz dziś, aby utrzymać swoją passę!";
  };

  const getReminderColor = () => {
    if (isStreakInDanger()) {
      return "from-red-500/10 to-orange-500/10 border-red-500/30";
    }
    return "from-yellow-500/10 to-amber-500/10 border-yellow-500/30";
  };

  if (compact) {
    return (
      <div className={`rounded-lg border bg-gradient-to-r p-3 ${getReminderColor()}`}>
        <div className="flex items-center gap-2">
          <div className="text-amber-600">
            {getReminderIcon()}
          </div>
          <div>
            <p className="text-text text-sm font-medium">
              {isStreakInDanger() ? "Passa zagrożona!" : "Przypomnienie o passie"}
            </p>
            <p className="text-text-muted text-xs">
              Pozostało: {timeLeft}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border bg-gradient-to-r p-4 ${getReminderColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600/20 flex h-12 w-12 items-center justify-center rounded-full">
            <div className="text-amber-600">
              {getReminderIcon()}
            </div>
          </div>
          <div>
            <p className="font-heading text-text text-lg font-semibold">
              {isStreakInDanger() ? "Passa zagrożona!" : "Utrzymaj swoją passę"}
            </p>
            <p className="text-text-muted text-sm">
              {getReminderText()}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-text-muted text-xs">
            Pozostało czasu:
          </div>
          <div className="text-text text-lg font-bold">
            {timeLeft}
          </div>
        </div>
      </div>
      
      {/* Current streak info */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="text-accent h-4 w-4" />
          <span className="text-text-muted text-sm">
            Obecna passa: {streakData.currentStreak} dni
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="text-primary h-4 w-4" />
          <span className="text-text-muted text-sm">
            Cel: {streakData.currentStreak + 1} dni
          </span>
        </div>
      </div>
      
      {/* Action button */}
      <div className="mt-4">
        <Btn 
          variant="primary" 
          to="/home" 
          className="w-full"
          size="sm"
        >
          Rozwiąż quiz teraz
        </Btn>
      </div>
    </div>
  );
}

export default StreakReminder;
