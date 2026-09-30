export default function StatCard({ title, value, helper, icon: Icon, accent = 'indigo' }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    rose: 'bg-rose-50 text-rose-600 ring-rose-100',
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
  }

  return (
    <article className="surface rounded-3xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{value}</p>
          {helper && <p className="mt-2 text-xs font-semibold text-slate-500">{helper}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${tones[accent] || tones.indigo}`}>
          <Icon size={20} />
        </div>
      </div>
    </article>
  )
}
