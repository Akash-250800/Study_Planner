import { Sparkles } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="surface rounded-3xl p-8 text-center sm:p-12">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Sparkles size={24} />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
