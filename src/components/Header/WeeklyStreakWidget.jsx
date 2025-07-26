import { Calendar, CheckCircle2, Circle } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { streakService } from "../../services/streakService";

function WeeklyStreakWidget() {
  const { currentUser } = useAuth();
  const { streakData } = useStreak();
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Get the current week (7 days starting from today going backwards)
        const today = new Date();
        const weekDays = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          weekDays.push({
            date: date,
            dateString: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('pl-PL', { weekday: 'short' }),
            isToday: i === 0,
            completed: false
          });
        }

        // Use the same method as ActivityCalendar - get calendar data for each month
        const months = [...new Set(weekDays.map(day => 
          new Date(day.date.getFullYear(), day.date.getMonth(), 1)
        ))];
        
        let allQuizDates = [];
        
        // Get quiz calendar data for all relevant months
        for (const month of months) {
          const monthData = await streakService.getUserQuizCalendar(currentUser.uid, month);
          allQuizDates = [...allQuizDates, ...monthData];
        }
        
        // Remove duplicates
        allQuizDates = [...new Set(allQuizDates)];
        
        // Mark completed days
        weekDays.forEach(day => {
          const hasQuiz = allQuizDates.includes(day.dateString);
          day.completed = hasQuiz;
        });

        setWeeklyData(weekDays);
      } catch (error) {
        console.error("Error fetching weekly streak data:", error);
        // Set empty week data on error
        setWeeklyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [currentUser, streakData]); // Re-fetch when streak data changes

  if (loading) {
    return (
      <div className="border-surface-elevated Wbackground rounded-2xl border-2 p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-border rounded w-32 mb-3"></div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1">
                <div className="w-6 h-6 bg-border rounded-full mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress
  const completedDays = weeklyData.filter(day => day.completed).length;
  
  // Calculate consecutive days from the end (today backwards)
  // But consider current daily streak to determine if streak is still active
  let consecutiveDays = 0;
  
  // Helper function to check if a day is part of active streak
  const isDayPartOfActiveStreak = (day, index) => {
    // If day has completed quiz, it's definitely part of streak
    if (day.completed) return true;
    
    // If no active daily streak, day without quiz is not part of streak
    if (!streakData || streakData.currentStreak === 0) return false;
    
    // If this is today and we have active streak from yesterday
    if (day.isToday) {
      // Check if yesterday was completed (yesterday should be part of streak)
      const yesterdayIndex = index - 1;
      if (yesterdayIndex >= 0 && weeklyData[yesterdayIndex] && weeklyData[yesterdayIndex].completed) {
        return true; // Today is part of ongoing streak from yesterday
      }
    }
    
    return false;
  };
  
  // Count consecutive active streak days from today backwards
  for (let i = weeklyData.length - 1; i >= 0; i--) {
    if (isDayPartOfActiveStreak(weeklyData[i], i)) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  // For weekly streak, we show consecutive days progress, not total completed days
  const weeklyStreakProgress = consecutiveDays;
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('WeeklyStreakWidget Debug:', {
      dailyStreak: streakData?.currentStreak || 0,
      weeklyStreak: weeklyStreakProgress,
      completedDays,
      weeklyData: weeklyData.map(d => ({
        day: d.dayName,
        date: d.dateString,
        completed: d.completed,
        isToday: d.isToday
      }))
    });
  }
  const progressPercentage = (weeklyStreakProgress / 7) * 100;
  const daysRemaining = 7 - weeklyStreakProgress;

  const isWeeklyStreakComplete = weeklyStreakProgress === 7;

  return (
    <div className="border-surface-elevated bg-background rounded-2xl border-2 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
          <Calendar className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-text">Tygodniowa passa</span>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {weeklyStreakProgress}/7 dni
            {isWeeklyStreakComplete && " 🏆"}
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="flex gap-1 mb-3">
        {weeklyData.map((day, index) => (
          <div key={day.dateString} className="flex-1 text-center">
            {/* Day name */}
            <div className="text-xs text-text-muted mb-1 font-medium">
              {day.dayName}
            </div>
            
            {/* Day circle */}
            <div className="relative">
              {day.completed ? (
                <div className="w-6 h-6 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              ) : isDayPartOfActiveStreak(day, index) ? (
                // Day is part of active streak but not completed yet (today with ongoing streak)
                <div className="w-6 h-6 mx-auto border-2 border-blue-500 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Circle className="h-2 w-2 text-blue-500" />
                </div>
              ) : (
                <div className={`w-6 h-6 mx-auto rounded-full border-2 flex items-center justify-center ${
                  day.isToday 
                    ? "border-blue-500 bg-blue-500/10" 
                    : "border-border bg-surface"
                }`}>
                  <Circle className={`h-2 w-2 ${day.isToday ? "text-blue-500" : "text-text-muted"}`} />
                </div>
              )}
              
              {/* Today indicator */}
              {day.isToday && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="bg-border h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center">
        {isWeeklyStreakComplete ? (
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Gratulacje! Tygodniowa passa ukończona!
          </div>
        ) : daysRemaining > 0 ? (
          <div className="text-xs text-text-muted">
            {weeklyStreakProgress > 0 ? (
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {weeklyStreakProgress} {weeklyStreakProgress === 1 ? 'dzień' : 'dni'} z rzędu!
              </span>
            ) : null}
            <span className={weeklyStreakProgress > 0 ? "block" : ""}>
              {daysRemaining} {daysRemaining === 1 ? 'dzień' : 'dni'} do tygodniowej passy!
            </span>
          </div>
        ) : (
          <div className="text-xs text-text-muted">
            Ukończ quiz dziś, aby rozpocząć tygodniową passę!
          </div>
        )}
      </div>

      {/* Debug: Show calculated streak in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-text-muted mt-2 p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
          <div>Calc Streak: {weeklyStreakProgress} dni z rzędu</div>
          <div>Total Days: {completedDays}/{weeklyData.length}</div>
          <div>Daily Streak: {streakData?.currentStreak || 0}</div>
          <div>Week Data: {weeklyData.map((d, i) => 
            `${d.dayName}:${d.completed ? '✓' : (isDayPartOfActiveStreak(d, i) ? '⭐' : '✗')}`
          ).join(' ')}</div>
        </div>
      )}
    </div>
  );
}

export default WeeklyStreakWidget;
