import { CheckCircle2, XCircle, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  if (!toast) return null
  const success = toast.type !== 'error'

  return (
    <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
      <div className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${success ? 'border-emerald-100' : 'border-rose-100'}`}>
        <div className={`mt-0.5 ${success ? 'text-emerald-600' : 'text-rose-600'}`}>
          {success ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        </div>
        <p className="flex-1 text-sm font-semibold leading-6 text-slate-700">{toast.message}</p>
        <button onClick={onClose} className="text-slate-400 transition hover:text-slate-700" aria-label="Close message">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
