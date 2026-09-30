import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2, CircleDot, Clock3, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import api from '../api/axios.js'
import CompletionChart from '../components/analytics/CompletionChart.jsx'
import StatCard from '../components/analytics/StatCard.jsx'
import SubjectChart from '../components/analytics/SubjectChart.jsx'
import Loader from '../components/common/Loader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { daysUntil, formatDateTime } from '../utils/dateUtils.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/analytics/summary')
        setData(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loader label="Building your dashboard..." />

  const summary = data?.summary || {}
  const firstName = user?.name?.split(' ')[0] || 'Student'

  return (
    <div>
      <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10 sm:p-8 lg:p-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-indigo-200">
              <Sparkles size={14} /> Your academic command centre
            </div>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Good to see you, {firstName}.</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">You have <span className="font-extrabold text-white">{summary.pending || 0} pending tasks</span>. Keep the next deadline visible and turn progress into a routine.</p>
          </div>
          <Link to="/tasks/new" className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5">
            <Plus size={18} /> Add a task
          </Link>
        </div>
      </section>

      {error && <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total tasks" value={summary.total || 0} helper="Across all subjects" icon={CircleDot} accent="indigo" />
        <StatCard title="Completed" value={summary.completed || 0} helper={`${summary.completionRate || 0}% completion rate`} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Pending" value={summary.pending || 0} helper={`${summary.upcoming || 0} due in 7 days`} icon={Clock3} accent="amber" />
        <StatCard title="Overdue" value={summary.overdue || 0} helper="Needs attention" icon={AlertTriangle} accent="rose" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
        <SubjectChart data={data?.bySubject || []} />
        <CompletionChart completed={summary.completed || 0} pending={summary.pending || 0} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="surface rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Upcoming deadlines</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">The next tasks that deserve your attention</p>
            </div>
            <Link to="/tasks" className="flex items-center gap-1 text-xs font-extrabold text-indigo-600">View all <ArrowRight size={14} /></Link>
          </div>

          <div className="mt-5 space-y-3">
            {(data?.upcomingTasks || []).length ? (
              data.upcomingTasks.map((task) => {
                const days = daysUntil(task.deadline)
                return (
                  <div key={task._id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                      <Clock3 size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-900">{task.title}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-slate-400">{task.subject?.name || 'Subject'} • {formatDateTime(task.deadline)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${days <= 1 ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-400">No upcoming deadlines yet.</div>
            )}
          </div>
        </section>

        <section className="surface rounded-3xl p-5 sm:p-6">
          <h2 className="text-base font-extrabold text-slate-900">This week</h2>
          <p className="mt-1 text-xs font-medium text-slate-500">A simple productivity pulse</p>
          <div className="mt-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 p-6 text-white">
            <p className="text-sm font-bold text-indigo-100">Tasks completed</p>
            <p className="mt-2 text-5xl font-extrabold">{summary.completedThisWeek || 0}</p>
            <p className="mt-3 text-xs leading-5 text-indigo-100">Consistency matters more than perfection. Keep one meaningful task moving each day.</p>
          </div>
          <Link to="/analytics" className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 p-4 text-sm font-extrabold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600">
            Explore analytics <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </div>
  )
}
