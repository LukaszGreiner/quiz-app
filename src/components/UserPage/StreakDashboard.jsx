import { useState, useEffect } from "react";
import { Calendar, Flame, Trophy, TrendingUp, Users } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import StreakReminder from "./StreakReminder";

function StreakDashboard() {
  const { streakData, loading, getQuizCalendar } = useStreak();
  const [calendarData, setCalendarData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (streakData) {
        const dates = await getQuizCalendar(selectedMonth);
        setCalendarData(dates);
      }
    };

    fetchCalendarData();
  }, [streakData, selectedMonth, getQuizCalendar]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-surface-elevated h-32 rounded-xl"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="animate-pulse">
            <div className="bg-surface-elevated h-48 rounded-xl"></div>
          </div>
          <div className="animate-pulse">
            <div className="bg-surface-elevated h-48 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const isDateCompleted = (day) => {
    const dateString = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
      .toISOString().split('T')[0];
    return calendarData.includes(dateString);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedMonth);
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const isCurrentMonth = selectedMonth.getMonth() === currentMonth && 
                          selectedMonth.getFullYear() === currentYear;

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCompleted = isDateCompleted(day);
      const isToday = isCurrentMonth && day === today;
      const isPast = isCurrentMonth ? day < today : selectedMonth < new Date();

      days.push(
        <div
          key={day}
          className={`
            h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium
            transition-all duration-200 border
            ${isCompleted 
              ? 'bg-correct/20 border-correct text-correct' 
              : isPast 
                ? 'bg-surface border-border text-text-muted' 
                : 'bg-surface-elevated border-border text-text'
            }
            ${isToday ? 'ring-2 ring-primary' : ''}
          `}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'].map(day => (
          <div key={day} className="text-text-muted text-center text-xs font-medium p-2">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const changeMonth = (direction) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-text text-3xl font-bold mb-2">
          Codzienne Passy
        </h1>
        <p className="text-text-muted">
          Śledź swoje postępy i utrzymuj motywację do nauki
        </p>
      </div>

      {/* Streak Reminder - shown if needed */}
      <StreakReminder />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-surface-elevated border-border rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Flame className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-text text-2xl font-bold">
                {streakData?.currentStreak || 0}
              </p>
              <p className="text-text-muted text-sm">Obecna passa</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated border-border rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Trophy className="text-accent h-5 w-5" />
            </div>
            <div>
              <p className="text-text text-2xl font-bold">
                {streakData?.longestStreak || 0}
              </p>
              <p className="text-text-muted text-sm">Najdłuższa passa</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated border-border rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-correct/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Calendar className="text-correct h-5 w-5" />
            </div>
            <div>
              <p className="text-text text-2xl font-bold">
                {streakData?.totalQuizDays || 0}
              </p>
              <p className="text-text-muted text-sm">Łączne dni</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated border-border rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/10 flex h-10 w-10 items-center justify-center rounded-full">
              <TrendingUp className="text-yellow-500 h-5 w-5" />
            </div>
            <div>
              <p className="text-text text-2xl font-bold">
                {streakData?.monthlyPercentage || 0}%
              </p>
              <p className="text-text-muted text-sm">W tym miesiącu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar and Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <div className="bg-surface-elevated border-border rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-text flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5" />
              Kalendarz Quizów
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="text-text-muted hover:text-text rounded p-1 transition-colors"
              >
                ←
              </button>
              <span className="text-text text-sm font-medium">
                {selectedMonth.toLocaleDateString('pl-PL', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="text-text-muted hover:text-text rounded p-1 transition-colors"
                disabled={selectedMonth.getMonth() >= new Date().getMonth() && 
                         selectedMonth.getFullYear() >= new Date().getFullYear()}
              >
                →
              </button>
            </div>
          </div>
          
          {renderCalendar()}
          
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="bg-correct/20 border-correct h-3 w-3 rounded border"></div>
              <span className="text-text-muted">Quiz ukończony</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-surface border-border h-3 w-3 rounded border"></div>
              <span className="text-text-muted">Brak aktywności</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakDashboard;
