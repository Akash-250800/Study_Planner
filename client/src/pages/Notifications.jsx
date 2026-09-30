import { useEffect, useState } from 'react'
import { Bell, BellRing, CheckCheck, Clock3, Trash2 } from 'lucide-react'
import api from '../api/axios.js'
import EmptyState from '../components/common/EmptyState.jsx'
import Loader from '../components/common/Loader.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import Toast from '../components/common/Toast.jsx'
import { formatDateTime } from '../utils/dateUtils.js'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const load = async () => {
    try {
      const { data } = await api.get('/notifications')
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to load reminders.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      load()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to update reminder.' })
    }
  }

  const markAll = async () => {
    try {
      await api.patch('/notifications/read-all')
      setToast({ type: 'success', message: 'All reminders marked as read.' })
      load()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to update reminders.' })
    }
  }

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`)
      load()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to delete reminder.' })
    }
  }

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <PageHeader
        eyebrow="Deadline alerts"
        title="Reminders"
        description="StudyFlow automatically surfaces pending tasks that are due soon, so important deadlines stay visible."
        action={unreadCount > 0 ? (
          <button onClick={markAll} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600">
            <CheckCheck size={18} /> Mark all read
          </button>
        ) : null}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div className="surface flex items-center gap-4 rounded-3xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><BellRing size={21} /></div>
          <div><p className="text-2xl font-extrabold text-slate-950">{unreadCount}</p><p className="text-xs font-bold text-slate-400">Unread reminders</p></div>
        </div>
        <div className="surface flex items-center gap-4 rounded-3xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><Bell size={21} /></div>
          <div><p className="text-2xl font-extrabold text-slate-950">{notifications.length}</p><p className="text-xs font-bold text-slate-400">Active reminders</p></div>
        </div>
      </div>

      {loading ? <Loader label="Checking upcoming deadlines..." /> : notifications.length ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article key={notification._id} className={`surface flex flex-col gap-4 rounded-3xl p-5 transition sm:flex-row sm:items-center ${notification.read ? 'opacity-70' : 'ring-1 ring-indigo-100'}`}>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${notification.read ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'}`}>
                <Clock3 size={21} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">{notification.task?.title || 'Upcoming task'}</h3>
                  {!notification.read && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-indigo-600">New</span>}
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-500">{notification.message}</p>
                <p className="mt-2 text-xs font-bold text-slate-400">Due {formatDateTime(notification.dueAt || notification.task?.deadline)}</p>
              </div>
              <div className="flex gap-2 sm:justify-end">
                {!notification.read && <button onClick={() => markRead(notification._id)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600 hover:border-indigo-200 hover:text-indigo-600">Mark read</button>}
                <button onClick={() => remove(notification._id)} className="rounded-xl p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete reminder"><Trash2 size={17} /></button>
              </div>
            </article>
          ))}
        </div>
      ) : <EmptyState title="No deadline reminders" description="You are clear for now. Reminders appear automatically when pending tasks enter the upcoming deadline window." />}
    </div>
  )
}
