import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchGlobalStatistics,
  fetchTopQuizzes,
  fetchUserStatistics,
  fetchCategoryStatistics,
  fetchRecentActivity,
} from "../services/statisticsService";
import { formatTotalTime } from "../utils/quizUtils";
import {
  TrendingUp,
  Users,
  Trophy,
  Target,
  Clock,
  Star,
  Activity,
  BookOpen,
  Award,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";
import StreakLeaderboard from "../components/UserPage/StreakLeaderboard";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CalendarComponent from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarCustomStyles.css";

// Chart colors for consistent theming
const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#f59e0b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  neutral: "#6b7280",
};

export default function StatisticsPage() {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Statistics state
  const [globalStats, setGlobalStats] = useState(null);
  const [topQuizzes, setTopQuizzes] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [quizActivityDates, setQuizActivityDates] = useState([]);

  // UI state
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load global statistics and top quizzes for everyone
        const [globalData, topQuizzesData, categoryData, recentData] =
          await Promise.allSettled([
            fetchGlobalStatistics(),
            fetchTopQuizzes(10),
            fetchCategoryStatistics(),
            fetchRecentActivity(15),
          ]);

        // Extract successful results or use defaults
        setGlobalStats(
          globalData.status === "fulfilled"
            ? globalData.value
            : {
                totalQuizzes: 0,
                totalUsers: 0,
                totalPlays: 0,
                totalQuestions: 0,
                categoryStats: [],
                difficultyStats: [],
              },
        );
        setTopQuizzes(
          topQuizzesData.status === "fulfilled" ? topQuizzesData.value : [],
        );
        setCategoryStats(
          categoryData.status === "fulfilled" ? categoryData.value : [],
        );
        setRecentActivity(
          recentData.status === "fulfilled" ? recentData.value : [],
        );

        // Load user-specific statistics if logged in
        if (currentUser) {
          try {
            const userData = await fetchUserStatistics(currentUser.uid);
            setUserStats(userData);

            const dates = userData.recentActivity.map(
              (activity) => new Date(activity.completedAt),
            );
            setQuizActivityDates(dates);
          } catch (userErr) {
            console.error("Error loading user statistics:", userErr);
            // Don't set global error for user stats failure
          }
        }
      } catch (err) {
        console.error("Error loading statistics:", err);
        setError("Wystąpił błąd podczas ładowania statystyk");
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
              <p className="text-text-muted text-lg">Ładowanie statystyk...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-surface-elevated border-border rounded-3xl border p-8 text-center">
            <div className="bg-incorrect/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Activity className="text-incorrect h-8 w-8" />
            </div>
            <h2 className="text-text mb-2 text-2xl font-bold">
              Błąd ładowania
            </h2>
            <p className="text-text-muted">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Przegląd", icon: BarChart3 },
    {
      id: "personal",
      label: "Moje statystyki",
      icon: Target,
      requiresAuth: true,
    },
    { id: "categories", label: "Kategorie", icon: PieChart },
    { id: "activity", label: "Aktywność", icon: Calendar },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="from-primary/5 via-background to-accent/5 bg-gradient-to-br pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-text mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              📊 Statystyki Platformy
            </h1>
            <p className="text-text-muted mx-auto max-w-2xl text-xl">
              Odkryj fascynujące dane o QuizMaster - analizuj trendy, postępy i
              osiągnięcia społeczności
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border-border -mt-6 rounded-2xl border p-2 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {tabs
              .filter((tab) => !tab.requiresAuth || currentUser)
              .map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary text-text-inverse shadow-md"
                        : "text-text hover:bg-surface-elevated"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Overview Tab - Przegląd */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Global Statistics Cards - Główne statystyki */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Users}
                title="Liczba użytkowników"
                value={globalStats?.totalUsers || 0}
                color="primary"
              />
              <StatCard
                icon={Target}
                title="Liczba kategorii"
                value={globalStats?.categoryStats?.length || 0}
                color="secondary"
              />
              <StatCard
                icon={BookOpen}
                title="Liczba quizów"
                value={globalStats?.totalQuizzes || 0}
                color="accent"
              />
              <StatCard
                icon={Activity}
                title="Liczba rozegranych quizów"
                value={globalStats?.totalPlays || 0}
                color="info"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Category Distribution Bar Chart */}
              <CategoryDistributionChart
                data={globalStats?.categoryStats || []}
              />

              {/* Top Quizzes Bar Chart */}
              <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
                <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                  <Trophy className="text-accent h-6 w-6" />
                  Najpopularniejsze quizy
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topQuizzes.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="title"
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                      <Tooltip
                        formatter={(value) => [`${value}`, "Rozgrywek"]}
                        labelFormatter={(label) => `Quiz: ${label}`}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="playsCount" fill={CHART_COLORS.accent} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Streak Leaderboard */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <StreakLeaderboard limit={10} />
            </div>
          </div>
        )}

        {/* Personal Statistics Tab */}
        {activeTab === "personal" && currentUser && userStats && (
          <div className="space-y-8">
            {/* Personal Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={BookOpen}
                title="Utworzone quizy"
                value={userStats.totalQuizzesCreated}
                color="primary"
              />
              <StatCard
                icon={Target}
                title="Ukończone quizy"
                value={userStats.totalQuizzesCompleted}
                color="secondary"
              />
              <StatCard
                icon={Star}
                title="Średni wynik"
                value={`${userStats.averageScore}%`}
                color="accent"
              />
              <StatCard
                icon={Clock}
                title="Średni czas"
                value={formatTotalTime(userStats.averageCompletionTime / 1000)}
                color="info"
              />
            </div>

            {/* Personal Performance Charts */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Category Performance Chart */}
              <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
                <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                  <Award className="text-primary h-6 w-6" />
                  Wyniki według kategorii
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userStats.categoryStats || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Średni wynik"]}
                        labelFormatter={(label) => `Kategoria: ${label}`}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="averagePercentage"
                        fill={CHART_COLORS.primary}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
                <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                  <TrendingUp className="text-accent h-6 w-6" />
                  Postęp w czasie
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userStats.recentActivity?.slice().reverse() || []}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="completedAt"
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Wynik"]}
                        labelFormatter={(label) =>
                          `Data: ${new Date(label).toLocaleDateString()}`
                        }
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke={CHART_COLORS.accent}
                        strokeWidth={3}
                        dot={{
                          fill: CHART_COLORS.accent,
                          strokeWidth: 2,
                          r: 4,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                <Activity className="text-accent h-6 w-6" />
                Ostatnia aktywność - szczegóły
              </h2>
              <div className="space-y-4">
                {userStats.recentActivity?.length > 0 ? (
                  userStats.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="bg-surface border-border rounded-xl border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-text font-medium">
                            {activity.quizTitle}
                          </h3>
                          <p className="text-text-muted text-sm">
                            {new Date(
                              activity.completedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-bold ${
                              parseFloat(activity.percentage) >= 80
                                ? "text-correct"
                                : parseFloat(activity.percentage) >= 60
                                  ? "text-accent"
                                  : "text-incorrect"
                            }`}
                          >
                            {activity.percentage}%
                          </span>
                          <p className="text-text-muted text-sm">
                            {activity.score}/{activity.totalQuestions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-text-muted text-lg">
                      Brak ostatniej aktywności
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quiz Activity Calendar */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                <Calendar className="text-primary h-6 w-6" />
                Kalendarz aktywności quizowej
              </h2>
              <CalendarComponent
                tileClassName={({ date }) =>
                  quizActivityDates.some(
                    (activityDate) =>
                      activityDate.toDateString() === date.toDateString(),
                  )
                    ? "bg-primary text-text-inverse"
                    : "bg-surface text-text"
                }
                className="custom-calendar"
              />
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-8">
            {/* Categories Overview Chart */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                <BarChart3 className="text-primary h-6 w-6" />
                Przegląd wszystkich kategorii
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="totalQuizzes"
                      name="Liczba quizów"
                      fill={CHART_COLORS.primary}
                    />
                    <Bar
                      dataKey="totalPlays"
                      name="Rozgrywki"
                      fill={CHART_COLORS.accent}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Category Details */}
            <div className="grid gap-6">
              {categoryStats.map((category) => (
                <div
                  key={category.category}
                  className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-text text-2xl font-bold">
                      {category.category}
                    </h2>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-primary text-2xl font-bold">
                          {category.totalQuizzes}
                        </p>
                        <p className="text-text-muted text-sm">quizów</p>
                      </div>
                      <div className="text-center">
                        <p className="text-accent text-2xl font-bold">
                          {category.totalPlays}
                        </p>
                        <p className="text-text-muted text-sm">rozgrywek</p>
                      </div>
                      <div className="text-center">
                        <p className="text-secondary text-2xl font-bold">
                          {category.averageRating}
                        </p>
                        <p className="text-text-muted text-sm">średnia ocena</p>
                      </div>
                    </div>
                  </div>

                  {/* Top quizzes in category */}
                  <div>
                    <h3 className="text-text mb-4 text-lg font-semibold">
                      Najpopularniejsze quizy
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {category.quizzes?.slice(0, 3).map((quiz) => (
                        <div
                          key={quiz.id}
                          className="bg-surface border-border hover:bg-surface-elevated rounded-xl border p-4 transition-all duration-200 hover:shadow-sm"
                        >
                          <h4 className="text-text mb-2 font-medium">
                            {quiz.title}
                          </h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Rozgrywek:</span>
                            <span className="text-primary font-medium">
                              {quiz.playsCount || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-8">
            {/* Activity Timeline Chart */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                <TrendingUp className="text-primary h-6 w-6" />
                Trend aktywności
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={recentActivity.slice().reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="completedAt"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Wynik"]}
                      labelFormatter={(label) =>
                        `Data: ${new Date(label).toLocaleDateString()}`
                      }
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="percentage"
                      stroke={CHART_COLORS.primary}
                      fill={`${CHART_COLORS.primary}20`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
              <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
                <Calendar className="text-primary h-6 w-6" />
                Ostatnia aktywność platformy - szczegóły
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-surface border-border rounded-xl border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-text font-medium">
                          {activity.quizTitle}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {new Date(activity.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold ${
                            parseFloat(activity.percentage) >= 80
                              ? "text-correct"
                              : parseFloat(activity.percentage) >= 60
                                ? "text-accent"
                                : "text-incorrect"
                          }`}
                        >
                          {activity.percentage}%
                        </span>
                        <p className="text-text-muted text-sm">
                          {activity.score}/{activity.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable StatCard component
function StatCard({ icon: Icon, title, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    info: "bg-info/10 text-info",
    correct: "bg-correct/10 text-correct",
  };

  return (
    <div className="bg-surface-elevated border-border rounded-3xl border p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses[color]}`}
        >
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-text-muted text-sm font-medium">{title}</p>
          <p className="text-text text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

const CategoryDistributionChart = ({ data }) => {
  return (
    <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg">
      <h2 className="text-text mb-6 flex items-center gap-3 text-2xl font-bold">
        <BarChart3 className="text-primary h-6 w-6" />
        Rozkład Kategorii
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
            <Tooltip
              formatter={(value) => [`${value}`, "Quizy"]}
              labelFormatter={(label) => `Kategoria: ${label}`}
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="count"
              name="Liczba quizów"
              fill={CHART_COLORS.primary}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
