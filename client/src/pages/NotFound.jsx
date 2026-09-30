import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">
      <div>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-indigo-300"><Compass size={28} /></div>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-300">404</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">This page wandered off.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">The page you requested does not exist in your StudyFlow workspace.</p>
        <Link to="/dashboard" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950"><ArrowLeft size={17} /> Back to dashboard</Link>
      </div>
    </div>
  )
}
