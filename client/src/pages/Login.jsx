import { useState } from 'react'
import { ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

const getErrorMessage = (error) =>
  error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Unable to sign in. Please try again.'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-sky-500/15 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 shadow-xl shadow-indigo-500/20">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="text-xl font-extrabold">StudyFlow</p>
            <p className="text-[11px] font-bold tracking-[0.22em] text-slate-400">STUDENT PRODUCTIVITY</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-indigo-200">A calmer way to manage university life</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">Plan clearly.<br />Study confidently.</h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">Keep assignments, deadlines, priorities, subjects and productivity insights together in one focused workspace.</p>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {['Organise every deadline', 'See progress at a glance', 'Filter tasks instantly', 'Stay ahead with reminders'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                <CheckCircle2 size={17} className="text-sky-400" /> {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs font-medium text-slate-500">Built for focused academic planning.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
              <Sparkles size={19} />
            </div>
            <p className="text-lg font-extrabold text-slate-900">StudyFlow</p>
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">Welcome back</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Sign in to your planner</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Continue where you left off and keep your study week under control.</p>

          {error && <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Email address</label>
              <input
                type="email"
                autoComplete="email"
                className="input-control"
                placeholder="student@example.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-control pr-12"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm font-medium text-slate-500">
            New to StudyFlow? <Link to="/register" className="font-extrabold text-indigo-600 hover:text-indigo-700">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
