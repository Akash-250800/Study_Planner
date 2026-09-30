import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function TaskFilters({ filters, subjects, onChange, onClear }) {
  const active = filters.search || filters.status || filters.priority || filters.subject

  return (
    <div className="surface mb-5 rounded-3xl p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="input-control pl-10"
            placeholder="Search title or description..."
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </label>

        <select className="input-control" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select className="input-control" value={filters.priority} onChange={(event) => onChange('priority', event.target.value)}>
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select className="input-control" value={filters.subject} onChange={(event) => onChange('subject', event.target.value)}>
          <option value="">All subjects</option>
          {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.name}</option>)}
        </select>

        <button
          onClick={onClear}
          disabled={!active}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {active ? <X size={17} /> : <SlidersHorizontal size={17} />}
          Clear
        </button>
      </div>
    </div>
  )
}
