import { User, Activity, BarChart3, Trophy, Calendar, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function MobileOverview({ activeTab, setActiveTab }) {
  const { currentUser } = useAuth();

  const overviewStats = [
    {
      id: "profile",
      label: "Profil",
      value: currentUser?.displayName || "Użytkownik",
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "activity",
      label: "Ostatnia aktywność",
      value: "Dziś",
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: "streak",
      label: "Passa",
      value: "3 dni",
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "achievements",
      label: "Osiągnięcia",
      value: "5",
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const quickActions = [
    {
      id: "activity",
      label: "Aktywność",
      description: "Historia quizów",
      icon: Activity,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "stats",
      label: "Statystyki",
      description: "Postępy i wyniki",
      icon: BarChart3,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-surface-elevated border-border rounded-lg border p-3 text-center transition-all duration-200 hover:shadow-sm sm:p-4"
            >
              <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </div>
              <div className="text-text text-sm font-bold sm:text-base">{stat.value}</div>
              <div className="text-text-muted text-xs leading-tight">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions - Mobile Only */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => setActiveTab(action.id)}
              className={`bg-surface-elevated border-border rounded-lg border p-3 text-left transition-all duration-200 hover:shadow-sm ${
                activeTab === action.id ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${action.bgColor}`}>
                  <Icon className={`h-3 w-3 ${action.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-text text-sm font-medium">{action.label}</div>
                  <div className="text-text-muted text-xs">{action.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Welcome Message - Mobile Optimized */}
      <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
        <h4 className="text-text mb-2 text-base font-semibold sm:text-lg">
          Witaj ponownie, {currentUser?.displayName || 'Użytkowniku'}! 👋
        </h4>
        <p className="text-text-muted text-sm sm:text-base">
          Kontynuuj swoją naukę i rozwijaj swoje umiejętności poprzez quizy. 
          Sprawdź swoje postępy w zakładkach powyżej.
        </p>
        
        {/* Mobile Quick Navigation */}
        <div className="mt-3 flex gap-2 sm:hidden">
          <button
            onClick={() => setActiveTab("stats")}
            className="bg-primary text-text-inverse rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Zobacz statystyki
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className="bg-surface text-text border-border rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-surface-elevated"
          >
            Osiągnięcia
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileOverview;
