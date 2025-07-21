import { Flame, Clock, Target, CheckCircle } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import { useState, useEffect } from "react";
import Btn from "../common/Btn";

function StreakWidget() {
  const { streakData, needsQuizToday, isStreakInDanger, hasCompletedQuizToday } = useStreak();
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    const checkTodayCompletion = async () => {
      const completed = await hasCompletedQuizToday();
      setCompletedToday(completed);
    };

    if (streakData) {
      checkTodayCompletion();
    }
  }, [streakData, hasCompletedQuizToday]);

  if (!streakData) return null;

  const getWidgetStatus = () => {
    if (completedToday) {
      return {
        icon: <CheckCircle className="h-5 w-5" />,
        title: "Quiz ukończony dziś!",
        message: `Passa ${streakData.currentStreak} dni kontynuuje`,
        color: "from-correct/10 to-emerald-500/10 border-correct/30",
        iconColor: "text-correct"
      };
    }

    if (isStreakInDanger()) {
      return {
        icon: <Target className="h-5 w-5" />,
        title: "Passa zagrożona!",
        message: "Ukończ quiz, aby odzyskać swoją passę",
        color: "from-red-500/10 to-orange-500/10 border-red-500/30",
        iconColor: "text-red-500"
      };
    }
    
    if (needsQuizToday()) {
      return {
        icon: <Clock className="h-5 w-5" />,
        title: "Utrzymaj swoją passę",
        message: "Ukończ quiz dziś, aby kontynuować",
        color: "from-yellow-500/10 to-amber-500/10 border-yellow-500/30",
        iconColor: "text-yellow-600"
      };
    }

    return {
      icon: <Flame className="h-5 w-5" />,
      title: `Passa ${streakData.currentStreak} dni`,
      message: "Świetna robota! Kontynuuj dalej",
      color: "from-accent/10 to-primary/10 border-accent/30",
      iconColor: "text-accent"
    };
  };

  const status = getWidgetStatus();

  return (
    <div className={`rounded-xl border bg-gradient-to-r p-4 ${status.color}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${status.iconColor}`}>
            {status.icon}
          </div>
          <div>
            <p className="text-text font-semibold text-sm">
              {status.title}
            </p>
            <p className="text-text-muted text-xs">
              {status.message}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {streakData.currentStreak > 0 && (
            <div className="text-right">
              <div className="text-text text-lg font-bold">
                {streakData.currentStreak}
              </div>
              <div className="text-text-muted text-xs">
                dni
              </div>
            </div>
          )}
          
          <Btn 
            variant="secondary" 
            size="sm" 
            to="/streaks"
            className="text-xs"
          >
            Zobacz
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default StreakWidget;
