import { useState, useEffect, memo } from "react";
import { useAuth } from "../../context/AuthContext";
import { TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { fetchUserStatistics } from "../../services/statisticsService";

const ProgressChart = memo(function ProgressChart({ compact = false }) {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("area");

  useEffect(() => {
    const loadProgressData = async () => {
      if (!currentUser) return;

      try {
        const stats = await fetchUserStatistics(currentUser.uid);
        
        // Generate last 7 days progress data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          
          return {
            date: date.toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' }),
            quizy: Math.floor(Math.random() * 5) + 1, // Mock data - replace with real data
            wynik: Math.floor(Math.random() * 30) + 70, // Mock data - replace with real data
            czas: Math.floor(Math.random() * 60) + 15, // Mock data - replace with real data
          };
        });

        setChartData(last7Days);
      } catch (error) {
        console.error("Error loading progress data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
        <div className="animate-pulse">
          <div className="bg-surface mb-3 h-3 w-24 rounded sm:mb-4 sm:h-4 sm:w-32"></div>
          <div className="bg-surface h-24 w-full rounded sm:h-32"></div>
        </div>
      </div>
    );
  }

  const ChartComponent = chartType === "area" ? AreaChart : LineChart;
  const DataComponent = chartType === "area" ? Area : Line;

  return (
    <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
          <h3 className="text-text text-base font-semibold sm:text-lg">Postępy (7 dni)</h3>
        </div>
        
        {!compact && (
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setChartType("area")}
              className={`rounded-md px-2 py-1 text-xs transition-all sm:rounded-lg sm:px-3 sm:text-sm ${
                chartType === "area"
                  ? "bg-primary text-text-inverse"
                  : "bg-surface text-text hover:bg-surface-elevated"
              }`}
            >
              Obszar
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`rounded-md px-2 py-1 text-xs transition-all sm:rounded-lg sm:px-3 sm:text-sm ${
                chartType === "line"
                  ? "bg-primary text-text-inverse"
                  : "bg-surface text-text hover:bg-surface-elevated"
              }`}
            >
              Linia
            </button>
          </div>
        )}
      </div>

      <div className={compact ? "h-24 sm:h-32" : "h-32 sm:h-48"}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border-rgb), 0.1)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "rgba(var(--text-muted-rgb), 1)" }}
              className="sm:text-xs"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "rgba(var(--text-muted-rgb), 1)" }}
              className="sm:text-xs"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(var(--surface-elevated-rgb), 1)",
                border: "1px solid rgba(var(--border-rgb), 1)",
                borderRadius: "8px",
                fontSize: "12px"
              }}
              labelStyle={{ color: "rgba(var(--text-rgb), 1)" }}
            />
            <DataComponent
              type="monotone"
              dataKey="wynik"
              stroke="#3b82f6"
              strokeWidth={2}
              fill={chartType === "area" ? "rgba(59, 130, 246, 0.1)" : undefined}
              dot={{ r: 3, fill: "#3b82f6" }}
              activeDot={{ r: 4, fill: "#3b82f6" }}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex justify-center sm:mt-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <div className="bg-blue-500 h-2 w-2 rounded-full sm:h-3 sm:w-3"></div>
          <span className="text-text-muted">Średni wynik (%)</span>
        </div>
      </div>
    </div>
  );
});

export default ProgressChart;
