import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import api from '../api/axios.js'
import PageHeader from '../components/common/PageHeader.jsx'
import TaskForm from '../components/tasks/TaskForm.jsx'

const initialForm = { title: '', description: '', subject: '', deadline: '', priority: 'medium', status: 'pending' }

export default function AddTask() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/subjects').then(({ data }) => setSubjects(data.subjects || [])).catch(() => setSubjects([]))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/tasks', { ...form, deadline: new Date(form.deadline).toISOString() })
      navigate('/tasks')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Unable to create task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Plan the next step"
        title="Create a new task"
        description="Give the task a clear outcome, assign it to a subject and choose a realistic deadline."
        action={<Link to="/tasks" className="text-sm font-extrabold text-slate-500 hover:text-indigo-600">Back to tasks</Link>}
      />
      {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}
      {!subjects.length && (
        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          You need at least one subject before creating a task. <Link to="/subjects" className="underline">Create a subject</Link>.
        </div>
      )}
      <TaskForm form={form} subjects={subjects} loading={loading} submitLabel="Create task" onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))} onSubmit={handleSubmit} />
    </div>
  )
}
