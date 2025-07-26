import { Flame } from "lucide-react";
import { useStreak } from "../../hooks/useStreak";
import { useAuth } from "../../context/AuthContext";

/**
 * StreakBadge Component
 * 
 * A reusable badge that displays the user's current daily streak.
 * Shows as an overlay on profile images or other elements.
 * 
 * @param {Object} props
 * @param {string} props.size - Badge size: "sm", "md", "lg" (default: "md")
 * @param {string} props.position - Badge position: "bottom-right", "top-right" (default: "bottom-right") 
 * @param {string} props.className - Additional CSS classes
 */
function StreakBadge({ 
  size = "md", 
  position = "bottom-right", 
  className = "" 
}) {
  const { currentUser } = useAuth();
  const { streakData } = useStreak();

  // Don't show badge if user is not logged in
  if (!currentUser) {
    return null;
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "px-1.5 py-0.5",
      icon: "size-3",
      text: "text-xs",
    },
    md: {
      container: "px-2 py-0.5", 
      icon: "size-3.5",
      text: "text-sm",
    },
    lg: {
      container: "px-2.5 py-1",
      icon: "size-4", 
      text: "text-base",
    }
  };

  // Position configurations
  const positionConfig = {
    "bottom-right": "-bottom-1 -right-1",
    "bottom":"-bottom-3 -right-0 ",
    "top-right": "-top-1 -right-1",
    "bottom-left": "-bottom-1 -left-1",
    "top-left": "-top-1 -left-1",
  };

  const sizeClasses = sizeConfig[size] || sizeConfig.md;
  const positionClasses = positionConfig[position] || positionConfig["bottom-right"];

  return (
    <div 
      className={`absolute ${positionClasses} flex items-center gap-1 rounded-full shadow-lg border-2 border-white ${sizeClasses.container} ${className} ${
        streakData?.hasCompletedToday 
          ? 'bg-gradient-to-r from-green-500 to-red-500' 
          : 'bg-gradient-to-r from-gray-400 to-gray-500'
      }`}
      title={`Aktualna passa: ${streakData?.currentStreak || 0} dni${!streakData?.hasCompletedToday ? ' (nie rozwiązano jeszcze dzisiaj)' : ''}`}
    >
      <Flame className={`${sizeClasses.icon} text-white drop-shadow-sm`} />
      <span className={`text-white ${sizeClasses.text} font-extrabold drop-shadow-sm`}>
        {streakData?.currentStreak || 0}
      </span>
    </div>
  );
}

export default StreakBadge;
