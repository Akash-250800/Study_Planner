import { CalendarDays, Save } from 'lucide-react'

export default function TaskForm({ form, subjects, loading, submitLabel, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="surface rounded-3xl p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Task title</label>
          <input className="input-control" value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="e.g. Complete AI literature review" required minLength={2} />
        </div>

        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Description</label>
          <textarea className="input-control min-h-32 resize-y" value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Add useful notes or a short study objective..." maxLength={1000} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Subject</label>
          <select className="input-control" value={form.subject} onChange={(e) => onChange('subject', e.target.value)} required>
            <option value="">Choose a subject</option>
            {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Deadline</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input type="datetime-local" className="input-control pl-10" value={form.deadline} onChange={(e) => onChange('deadline', e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Priority</label>
          <select className="input-control" value={form.priority} onChange={(e) => onChange('priority', e.target.value)}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Status</label>
          <select className="input-control" value={form.status} onChange={(e) => onChange('status', e.target.value)}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="mt-7 flex justify-end border-t border-slate-100 pt-6">
        <button disabled={loading} className="flex min-w-40 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
          <Save size={17} />
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
