import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Target,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios.js";
import CompletionChart from "../components/analytics/CompletionChart.jsx";
import StatCard from "../components/analytics/StatCard.jsx";
import SubjectChart from "../components/analytics/SubjectChart.jsx";
import Loader from "../components/common/Loader.jsx";
import PageHeader from "../components/common/PageHeader.jsx";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/analytics/summary")
      .then(({ data: response }) => setData(response))
      .catch((err) =>
        setError(err.response?.data?.message || "Unable to load analytics."),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Calculating productivity insights..." />;

  const summary = data?.summary || {};

  return (
    <div>
      <PageHeader
        eyebrow="Productivity analytics"
        title="Understand your study progress"
        description="Use simple visual indicators to see completion patterns, workload by subject and recent momentum."
      />

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Completion rate"
          value={`${summary.completionRate || 0}%`}
          helper="Across all tasks"
          icon={Target}
          accent="indigo"
        />
        <StatCard
          title="Completed"
          value={summary.completed || 0}
          helper={`${summary.completedThisWeek || 0} this week`}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Upcoming"
          value={summary.upcoming || 0}
          helper="Due in the next 7 days"
          icon={Clock3}
          accent="sky"
        />
        <StatCard
          title="Overdue"
          value={summary.overdue || 0}
          helper="Requires attention"
          icon={AlertTriangle}
          accent="rose"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
        <section className="surface rounded-3xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                7-day completion trend
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Tasks completed on each day of the current seven-day window
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Activity size={19} />
            </div>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.completionTrend || []}
                margin={{ top: 8, right: 5, left: -28, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="completedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickFormatter={(value) => value.slice(5)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#completedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <CompletionChart
          completed={summary.completed || 0}
          pending={summary.pending || 0}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <SubjectChart data={data?.bySubject || []} />

        <section className="surface rounded-3xl p-5 sm:p-6">
          <h2 className="text-base font-extrabold text-slate-900">
            Priority mix
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Current workload grouped by priority
          </p>
          <div className="mt-5 space-y-4">
            {["high", "medium", "low"].map((priority) => {
              const item = (data?.byPriority || []).find(
                (entry) => entry.priority === priority,
              ) || { total: 0, completed: 0, pending: 0 };
              const tone =
                priority === "high"
                  ? "bg-rose-500"
                  : priority === "medium"
                    ? "bg-amber-500"
                    : "bg-emerald-500";
              const percentage = summary.total
                ? Math.round((item.total / summary.total) * 100)
                : 0;
              return (
                <div
                  key={priority}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold capitalize text-slate-800">
                        {priority} priority
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {item.completed} completed • {item.pending} pending
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-slate-700">
                      {item.total}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${tone}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
