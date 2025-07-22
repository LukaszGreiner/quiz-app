import { useStreak } from "../../hooks/useStreak";
import { Flame } from "lucide-react";

export default function StreakBadge() {
  const { streakData, loading } = useStreak();
  const currentStreak = streakData?.currentStreak || 0;

  if (loading || currentStreak === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-white shadow-lg ${
      streakData?.hasCompletedToday 
        ? 'bg-gradient-to-r from-orange-500 to-red-500' 
        : 'bg-gradient-to-r from-gray-400 to-gray-500'
    }`}>
      <Flame className="h-4 w-4 text-yellow-200" />
      <div className="flex flex-col">
        <span className="text-xs font-medium leading-none">
          {streakData?.hasCompletedToday ? 'Passa' : 'Brak dzisiaj'}
        </span>
        <span className="text-sm font-bold leading-none">
          {currentStreak} {currentStreak === 1 ? 'dzień' : "dni"}
        </span>
      </div>
    </div>
  );
}
