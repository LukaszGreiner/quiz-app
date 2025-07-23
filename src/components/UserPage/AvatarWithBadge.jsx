import { Flame } from "lucide-react";

export default function AvatarWithBadge(Avatar, streakData, currentUser) {
    return <div className="flex justify-center sm:justify-start">
                      <div className="relative">
                        <img
                          src={Avatar}
                          alt="Zdjęcie profilowe"
                          className="border-border h-16 w-16 rounded-full border-2 object-cover sm:h-20 sm:w-20"
                        />
                        {/* Daily Streak Badge - Always show when user is logged in */}
                        {currentUser && (
                          <div className={`absolute -bottom-1 -right-1 flex items-center gap-[2px] rounded-full px-1.5 py-0.5 shadow-sm ${
                            streakData?.hasCompletedToday 
                              ? 'bg-gradient-to-r from-accent to-yellow-600' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}>
                            <Flame className="size-3 text-white" />
                            <span className="text-white text-xs font-bold">
                              {streakData?.currentStreak || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
  };
