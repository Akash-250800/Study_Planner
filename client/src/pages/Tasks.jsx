import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import api from '../api/axios.js'
import EmptyState from '../components/common/EmptyState.jsx'
import Loader from '../components/common/Loader.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import Toast from '../components/common/Toast.jsx'
import TaskCard from '../components/tasks/TaskCard.jsx'
import TaskFilters from '../components/tasks/TaskFilters.jsx'

const initialFilters = { search: '', status: '', priority: '', subject: '' }

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      const { data } = await api.get('/tasks', { params: { ...params, sortBy: 'deadline', order: 'asc' } })
      setTasks(data.tasks || [])
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to load tasks.' })
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    api.get('/subjects').then(({ data }) => setSubjects(data.subjects || [])).catch(() => setSubjects([]))
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 220)
    return () => clearTimeout(timer)
  }, [fetchTasks])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status })
      setToast({ type: 'success', message: status === 'completed' ? 'Task completed — nice work.' : 'Task moved back to pending.' })
      fetchTasks()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to update task.' })
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task permanently?')) return
    try {
      await api.delete(`/tasks/${id}`)
      setToast({ type: 'success', message: 'Task deleted.' })
      fetchTasks()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to delete task.' })
    }
  }

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <PageHeader
        eyebrow="Task management"
        title="Your study tasks"
        description="Search, prioritise, complete and organise academic work without losing sight of the next deadline."
        action={
          <Link to="/tasks/new" className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5">
            <Plus size={18} /> New task
          </Link>
        }
      />

      <TaskFilters
        filters={filters}
        subjects={subjects}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onClear={() => setFilters(initialFilters)}
      />

      {loading ? (
        <Loader label="Loading tasks..." />
      ) : tasks.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {tasks.map((task) => <TaskCard key={task._id} task={task} onStatusChange={updateStatus} onDelete={deleteTask} />)}
        </div>
      ) : (
        <EmptyState
          title="No tasks found"
          description="Create your first task, or clear the filters if you are looking for something that is already in your planner."
          action={<Link to="/tasks/new" className="inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white">Create a task</Link>}
        />
      )}
    </div>
  )
}
