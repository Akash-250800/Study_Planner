import { CalendarDays, CheckCircle2, Circle, Edit3, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { formatDateTime, isOverdue } from '../../utils/dateUtils.js'

const priorityStyles = {
  high: 'bg-rose-50 text-rose-700 ring-rose-100',
  medium: 'bg-amber-50 text-amber-700 ring-amber-100',
  low: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const overdue = isOverdue(task.deadline, task.status)

  return (
    <article className="surface group rounded-3xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onStatusChange(task._id, task.status === 'completed' ? 'pending' : 'completed')}
          className={`mt-0.5 transition ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
          aria-label="Toggle task status"
        >
          {task.status === 'completed' ? <CheckCircle2 size={23} /> : <Circle size={23} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`truncate text-base font-extrabold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h3>
              <p className="mt-1 text-xs font-semibold text-indigo-600">{task.subject?.name || 'Unassigned'}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ring-1 ${priorityStyles[task.priority] || priorityStyles.medium}`}>
              {task.priority}
            </span>
          </div>

          {task.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className={`flex items-center gap-2 text-xs font-bold ${overdue ? 'text-rose-600' : 'text-slate-500'}`}>
              <CalendarDays size={15} />
              {overdue ? 'Overdue • ' : ''}{formatDateTime(task.deadline)}
            </div>

            <div className="flex items-center gap-1">
              <Link to={`/tasks/${task._id}/edit`} className="rounded-xl p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600" aria-label="Edit task">
                <Edit3 size={17} />
              </Link>
              <button onClick={() => onDelete(task._id)} className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Delete task">
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
