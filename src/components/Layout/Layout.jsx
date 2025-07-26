import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navigationConfig } from "../../config/navigationConfig";
import { useLocation } from "react-router-dom";
import Logo from "../common/Logo";
import Btn from "../common/Btn";
import ProfileAvatar from "../Header/ProfileAvatar";
import WeeklyStreakWidget from "../Header/WeeklyStreakWidget";
import Footer from "./Footer";
import LoadingSpinner from "../common/LoadingSpinner";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useStreak } from "../../hooks/useStreak";
import { getUserTitle, getNextTitle } from "../../utils/titleUtils";
import { Trophy, CheckCircle, Flame } from "lucide-react";

function Layout() {
  const location = useLocation();
  const { currentUser, loading } = useAuth();
  const { userData } = useCurrentUserProfile();
  const { streakData } = useStreak();
  
  // Show loading spinner while auth is initializing
  if (loading) {
    return <LoadingSpinner message="Inicjalizowanie aplikacji..." />;
  }
  
  // Oblicz tytuł użytkownika
  const userXP = userData?.totalXP || 0;
  const currentTitle = getUserTitle(userXP);
  const nextTitle = getNextTitle(userXP);

  return (
    <div className="bg-background min-h-screen">
      {/* Desktop Layout */}
      <div className="hidden sm:flex min-h-screen">
        {/* Left Sidebar - Navigation */}
        <div className="bg-background fixed left-0 top-0 z-40 h-full w-24 xl:w-64 border-r border-border p-4">
          {/* Logo */}
          <div className="mb-6 px-3 py-2">
            <Logo className="text-3xl hidden xl:block"/>
            <span className="xl:hidden inline-block text-primary !font-ptserif text-3xl font-bold text-nowrap dark:text-white w-full text-center">Q</span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2 flex flex-col">
            {navigationConfig
              .filter((item) => item.showInDesktop)
              .map(({ path, label, icon: Icon }) => (
                <Btn
                  key={path}
                  to={path}
                  variant={location.pathname === path ? "primary" : "ghost"}
                  size="lg"
                  className="w-full justify-start gap-3 text-left"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="hidden xl:block">{label}</span>
                </Btn>
              ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-24 xl:ml-64">
          <div className="flex min-h-screen">
            {/* Center Content */}
            <div className="flex-1 max-w-none">
              <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
              </div>
            </div>

            {/* Right Sidebar - User Profile, exp-bar,daily-streak, Daily Quest */}
            {currentUser && (
              <div className="hidden lg:block w-80 border-l border-border bg-background scrollbar">
                <div className="sticky top-0 p-6 space-y-6 max-h-screen overflow-y-auto">
                  {/* User Profile */}
                  <div className="border-surface-elevated bg-background rounded-2xl border-2 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <ProfileAvatar />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-text">
                          {userData?.username || currentUser?.displayName || "Użytkownik"}
                        </h3>
                        {/* User Title with XP Tooltip */}
                        <div className="group relative">
                          <div className="flex items-center gap-2 mt-1 cursor-pointer">
                            <span className="text-xs">{currentTitle.emoji}</span>
                            <span className={`text-sm font-medium ${currentTitle.color}`}>
                              {currentTitle.title}
                            </span>
                          </div>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute left-0 top-full mt-2 z-50 hidden group-hover:block">
                            <div className="bg-surface-elevated border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
                              <div className="text-sm font-medium text-text mb-2">
                                {currentTitle.emoji} {currentTitle.title}
                              </div>
                              <div className="text-xs text-text-muted space-y-1">
                                <div>Łączne XP: <span className="font-medium text-primary">{userXP}</span></div>
                                {nextTitle && (
                                  <div>
                                    Do następnego tytułu: 
                                    <span className="font-medium text-accent ml-1">
                                      {nextTitle.xpNeeded} XP
                                    </span>
                                  </div>
                                )}
                                {nextTitle && (
                                  <div className="text-text-muted">
                                    Następny: {nextTitle.emoji} {nextTitle.title}
                                  </div>
                                )}
                                {!nextTitle && (
                                  <div className="text-accent font-medium">
                                    🌟 Maksymalny tytuł osiągnięty!
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Daily Streak */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                      streakData?.hasCompletedToday 
                        ? 'bg-gradient-to-r from-accent/10 to-yellow-600/10 border-accent/20' 
                        : 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/20'
                    }`}>
                      <div className={`rounded-full p-2 ${
                        streakData?.hasCompletedToday 
                          ? 'bg-gradient-to-r from-accent to-yellow-600' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}>
                        <Flame className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-text">Dzienna passa</span>
                        <div className={`text-lg font-bold ${
                          streakData?.hasCompletedToday 
                            ? 'text-accent' 
                            : 'text-gray-500'
                        }`}>
                          {streakData?.currentStreak || 0} {(streakData?.currentStreak || 0) === 1 ? 'dzień' : 'dni'}
                        </div>
                      </div>
                    </div>

                    {/* Debug: Show streak comparison in development */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-text-muted mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                        <div>DB Streak: {streakData?.currentStreak || 0}</div>
                        <div>Last Recalc: {streakData?.lastRecalculated ? new Date(streakData.lastRecalculated).toLocaleString() : 'Never'}</div>
                      </div>
                    )}
                  </div>

                  {/* Weekly Streak Widget */}
                  <WeeklyStreakWidget />


                  {/* Daily Quest */}
                  <div className="border-surface-elevated bg-background rounded-2xl border-2 p-6">
                    <h3 className="font-bold text-lg mb-4 text-text">Misje</h3>
                    <div className="flex items-center gap-3 p-4 bg-surface rounded-lg border">
                      <div className="w-6 h-6 bg-gradient-to-r from-correct to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-text">Ukończ 3 quizy</span>
                        <div className="mt-1">
                          <div className="bg-border h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-correct to-green-600 h-full rounded-full transition-all duration-300" style={{ width: '33%' }}></div>
                          </div>
                          <span className="text-xs text-text-muted mt-1 block">1/3 ukończone</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="sm:hidden">
        <main className="container mx-auto max-w-md px-4 sm:px-6 py-6 pb-20">
          <Outlet />
        </main>
      </div>

      {/* Mobile Footer Navigation - Only on mobile */}
      <div className="sm:hidden">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
