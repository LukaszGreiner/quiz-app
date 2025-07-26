import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import { formatDateToString } from "../../utils/dateUtils";

function ActivityCalendar() {
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
      <div className="animate-pulse">
        <div className="bg-surface h-48 rounded-xl"></div>
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
    const dateString = formatDateToString(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
    );
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
      days.push(<div key={`empty-${i}`} className="h-8 sm:h-10 lg:h-12"></div>);
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
            h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg flex items-center justify-center 
            text-xs sm:text-sm font-medium transition-all duration-200 border mx-auto
            ${isCompleted 
              ? 'bg-correct/20 border-correct text-correct' 
              : isPast 
                ? 'bg-surface border-border text-text-muted' 
                : 'bg-surface-elevated border-border text-text'
            }
            ${isToday ? 'ring-1 sm:ring-2 ring-primary' : ''}
          `}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 text-center">
        {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'].map(day => (
          <div key={day} className="text-text-muted text-center text-xs font-medium p-1 sm:p-2 mx-auto">
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-text flex items-center gap-2 text-base sm:text-lg font-semibold">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          Kalendarz aktywności
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="text-text-muted hover:text-text rounded p-1 transition-colors touch-manipulation"
            aria-label="Poprzedni miesiąc"
          >
            ←
          </button>
          <span className="text-text text-xs sm:text-sm font-medium min-w-[120px] text-center">
            {selectedMonth.toLocaleDateString('pl-PL', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="text-text-muted hover:text-text rounded p-1 transition-colors touch-manipulation"
            disabled={selectedMonth.getMonth() >= new Date().getMonth() && 
                     selectedMonth.getFullYear() >= new Date().getFullYear()}
            aria-label="Następny miesiąc"
          >
            →
          </button>
        </div>
      </div>
      
      {renderCalendar()}
      
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs">
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
  );
}

export default ActivityCalendar;
