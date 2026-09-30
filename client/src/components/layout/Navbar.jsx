import { Bell, Menu, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext.jsx'

const titles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'My Tasks',
  '/tasks/new': 'Create Task',
  '/subjects': 'Subjects',
  '/analytics': 'Analytics',
  '/notifications': 'Reminders',
  '/profile': 'Profile',
}

export default function Navbar({ onMenu }) {
  const { user } = useAuth()
  const location = useLocation()
  const title = location.pathname.startsWith('/tasks/') && location.pathname !== '/tasks/new' ? 'Edit Task' : titles[location.pathname] || 'Study Planner'
  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-xl lg:ml-[272px]">
      <div className="flex h-[74px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button onClick={onMenu} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm lg:hidden" aria-label="Open navigation">
          <Menu size={20} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold text-slate-900 sm:text-lg">{title}</p>
          <p className="hidden text-xs font-medium text-slate-400 sm:block">Keep your academic week clear and intentional.</p>
        </div>

        <div className="hidden max-w-xs flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 shadow-sm md:flex">
          <Search size={17} />
          <span className="text-xs font-semibold">Everything you need, in one place</span>
        </div>

        <Link to="/notifications" className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
        </Link>

        <Link to="/profile" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2.5 shadow-sm transition hover:border-indigo-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-xs font-extrabold text-white">{initials || 'S'}</div>
          <div className="hidden text-left sm:block">
            <p className="max-w-32 truncate text-xs font-extrabold text-slate-800">{user?.name || 'Student'}</p>
            <p className="max-w-32 truncate text-[10px] font-medium text-slate-400">{user?.email}</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
