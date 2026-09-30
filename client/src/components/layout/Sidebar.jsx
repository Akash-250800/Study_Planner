import {
  BarChart3,
  Bell,
  BookOpen,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { to: '/tasks/new', label: 'Add Task', icon: PlusCircle },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Reminders', icon: Bell },
  { to: '/profile', label: 'Profile', icon: Settings },
]

export default function Sidebar({ mobile = false, onClose }) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    onClose?.()
  }

  return (
    <aside className={`${mobile ? 'h-full w-[285px]' : 'fixed inset-y-0 left-0 hidden w-[272px] lg:flex'} flex-col bg-slate-950 px-4 py-5 text-white`}>
      <div className="flex items-center justify-between px-2">
        <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 shadow-lg shadow-indigo-500/20">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight">StudyFlow</p>
            <p className="text-[11px] font-semibold text-slate-400">PLAN • FOCUS • ACHIEVE</p>
          </div>
        </NavLink>
        {mobile && (
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles size={15} />
          <span className="text-xs font-extrabold uppercase tracking-wider">Study smarter</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">Turn deadlines into a clear plan and track every win.</p>
      </div>

      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            end={to === '/tasks'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/25 to-sky-400/10 text-white ring-1 ring-indigo-400/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </aside>
  )
}
