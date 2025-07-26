    import { useState } from "react";
    import { RotateCcw, Clock, X, RefreshCw } from "lucide-react";
    import { useStreak } from "../../hooks/useStreak";
    import { useAuth } from "../../context/AuthContext";
    import Btn from "../common/Btn";
    import { toast } from "react-toastify";
    import { getTimeUntilEndOfDay } from "../../utils/dateUtils";

    function StreakReviveModal({ isOpen, onClose }) {
    const { currentUser } = useAuth();
    const { streakData, reviveStreak, refreshStreakData } = useStreak();
    const [isReviving, setIsReviving] = useState(false);

    // Don't render if not open or user can't revive
    if (!isOpen || !currentUser || !streakData?.canRevive) {
        return null;
    }

    const handleRevive = async () => {
        try {
        setIsReviving(true);
        await reviveStreak();
        toast.success(`Wczorajszy dzień został przywrócony! Passa ${streakData.lostStreakLength} dni wraca!`);
        await refreshStreakData();
        onClose(); // Close modal after successful revive
        } catch (error) {
        console.error("Error reviving streak:", error);
        toast.error(error.message || "Nie udało się przywrócić passy");
        } finally {
        setIsReviving(false);
        }
    };

    const timeRemaining = getTimeUntilEndOfDay();

    return (
        <>
        {/* Backdrop */}
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
            onClick={onClose}
        />
        
        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface-elevated border border-border rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface bg-surface-elevated hover:bg-surface transition-colors z-10  cursor-pointer"
            >
                <X className="h-5 w-5 text-text-muted hover:text-textr" />
            </button>

            {/* Content */}
            <div className="p-6 text-center">            {/* Animated icon */}
            <div className="mb-6 relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center">
                <RotateCcw className="h-8 w-8 text-white" />
              </div>
            </div>{/* Main heading */}
            <h2 className="text-text text-lg font-semibold mb-4">
              Twoja passa została przerwana!
            </h2>

            {/* Streak info */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30 p-4 mb-6">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {streakData.lostStreakLength} dni
              </div>
              <p className="text-text-muted text-sm">
                Utracona passa
              </p>
            </div>            {/* Time remaining */}
            {timeRemaining && (
              <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-surface rounded-lg">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-text text-sm">
                  Do końca dnia: <span className="font-medium text-blue-600 dark:text-blue-400">{timeRemaining}</span>
                </span>
              </div>
            )}

                {/* Action buttons */}
                <div className="space-y-3">
                <div className="relative">
                    <Btn
                    variant="primary"
                    size="lg"
                    onClick={handleRevive}
                    disabled={isReviving || !timeRemaining}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 shadow-md"
                    >
                    {isReviving ? (
                        <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Przywracanie...
                        </>
                    ) : (
                        <>
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Przywróć passę!
                        </>
                    )}
                    </Btn>
                    
                    {/* Badge with remaining revives */}
                    <div className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-md">
                    {streakData.maxRevives - streakData.revivesUsed}
                    </div>
                </div>
                
                
                </div>
            </div>
            </div>
        </div>
        </>
    );
    }

    export default StreakReviveModal;
