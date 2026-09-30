import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#6366f1', '#cbd5e1']

export default function CompletionChart({ completed = 0, pending = 0 }) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ]
  const total = completed + pending
  const rate = total ? Math.round((completed / total) * 100) : 0

  return (
    <div className="surface rounded-3xl p-5 sm:p-6">
      <div>
        <p className="text-base font-extrabold text-slate-900">Completion overview</p>
        <p className="mt-1 text-xs font-medium text-slate-500">Your current task balance</p>
      </div>
      <div className="relative mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={68} outerRadius={92} paddingAngle={4} stroke="none">
              {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Tasks']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-950">{rate}%</span>
          <span className="text-xs font-semibold text-slate-400">complete</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-indigo-50 p-3">
          <p className="text-xs font-bold text-indigo-500">Completed</p>
          <p className="mt-1 text-xl font-extrabold text-indigo-950">{completed}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3">
          <p className="text-xs font-bold text-slate-500">Pending</p>
          <p className="mt-1 text-xl font-extrabold text-slate-900">{pending}</p>
        </div>
      </div>
    </div>
  )
}
