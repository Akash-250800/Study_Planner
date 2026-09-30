import { useState } from 'react'
import { ArrowRight, BookOpenCheck, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

const getErrorMessage = (error) =>
  error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Unable to create your account.'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
              <Sparkles size={19} />
            </div>
            <p className="text-lg font-extrabold text-slate-900">StudyFlow</p>
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">Start planning</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Create your student workspace</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">One account for tasks, subjects, deadlines, reminders and analytics.</p>

          {error && <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Full name</label>
              <input className="input-control" placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Email address</label>
              <input type="email" className="input-control" placeholder="student@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-control pr-12"
                  placeholder="8+ chars, upper/lowercase + number"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm font-medium text-slate-500">
            Already have an account? <Link to="/login" className="font-extrabold text-indigo-600 hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-center xl:p-16">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-xl">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-sky-300 ring-1 ring-white/10">
            <BookOpenCheck size={30} />
          </div>
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight">Make every study session count.</h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">Organise your academic workload visually, see what matters next, and use simple analytics to understand your progress.</p>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm font-bold text-indigo-200">Your planner, your progress</p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {['Tasks', 'Subjects', 'Analytics'].map((item, index) => (
                <div key={item} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-2xl font-extrabold">0{index + 1}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
