export default function Loader({ fullPage = false, label = 'Loading...' }) {
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'min-h-screen' : 'min-h-52'}`}>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 shadow-sm">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
    </div>
  )
}
