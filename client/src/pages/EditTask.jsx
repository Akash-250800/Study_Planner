import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import api from '../api/axios.js'
import Loader from '../components/common/Loader.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import TaskForm from '../components/tasks/TaskForm.jsx'
import { toDateTimeLocal } from '../utils/dateUtils.js'

export default function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get(`/tasks/${id}`), api.get('/subjects')])
      .then(([taskRes, subjectRes]) => {
        const task = taskRes.data.task
        setSubjects(subjectRes.data.subjects || [])
        setForm({
          title: task.title || '',
          description: task.description || '',
          subject: task.subject?._id || task.subject || '',
          deadline: toDateTimeLocal(task.deadline),
          priority: task.priority || 'medium',
          status: task.status || 'pending',
        })
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load task.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.put(`/tasks/${id}`, { ...form, deadline: new Date(form.deadline).toISOString() })
      navigate('/tasks')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Unable to update task.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading task..." />

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Refine your plan" title="Edit task" description="Update the deadline, priority, subject or progress status as your study plan changes." action={<Link to="/tasks" className="text-sm font-extrabold text-slate-500 hover:text-indigo-600">Back to tasks</Link>} />
      {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}
      {form && <TaskForm form={form} subjects={subjects} loading={saving} submitLabel="Save changes" onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))} onSubmit={handleSubmit} />}
    </div>
  )
}
