import { useEffect, useState } from 'react'
import { BookOpen, Edit3, Plus, Trash2, X } from 'lucide-react'
import api from '../api/axios.js'
import EmptyState from '../components/common/EmptyState.jsx'
import Loader from '../components/common/Loader.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import Toast from '../components/common/Toast.jsx'

const emptyForm = { name: '', description: '' }

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const loadSubjects = async () => {
    try {
      const { data } = await api.get('/subjects')
      setSubjects(data.subjects || [])
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to load subjects.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSubjects() }, [])

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/subjects/${editing}`, form)
        setToast({ type: 'success', message: 'Subject updated.' })
      } else {
        await api.post('/subjects', form)
        setToast({ type: 'success', message: 'Subject created.' })
      }
      setForm(emptyForm)
      setEditing(null)
      loadSubjects()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Unable to save subject.' })
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (subject) => {
    setEditing(subject._id)
    setForm({ name: subject.name, description: subject.description || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this subject? Subjects with assigned tasks cannot be deleted.')) return
    try {
      await api.delete(`/subjects/${id}`)
      setToast({ type: 'success', message: 'Subject deleted.' })
      loadSubjects()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to delete subject.' })
    }
  }

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <PageHeader eyebrow="Academic organisation" title="Subjects" description="Create a clean subject structure so every task has an academic home." />

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <form onSubmit={submit} className="surface h-fit rounded-3xl p-5 sm:p-6 xl:sticky xl:top-24">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{editing ? 'Edit subject' : 'Add a subject'}</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">Keep subject names short and recognisable.</p>
            </div>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyForm) }} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>}
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Subject name</label>
              <input className="input-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Artificial Intelligence" required minLength={2} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Description</label>
              <textarea className="input-control min-h-28 resize-y" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Optional module note" maxLength={500} />
            </div>
            <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-700 disabled:opacity-60">
              <Plus size={17} /> {saving ? 'Saving...' : editing ? 'Update subject' : 'Add subject'}
            </button>
          </div>
        </form>

        <div>
          {loading ? <Loader label="Loading subjects..." /> : subjects.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.map((subject) => (
                <article key={subject._id} className="surface rounded-3xl p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"><BookOpen size={20} /></div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(subject)} className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><Edit3 size={17} /></button>
                      <button onClick={() => remove(subject._id)} className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={17} /></button>
                    </div>
                  </div>
                  <h3 className="mt-5 text-base font-extrabold text-slate-900">{subject.name}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{subject.description || 'No description added.'}</p>
                </article>
              ))}
            </div>
          ) : <EmptyState title="No subjects yet" description="Create your first subject to start assigning and organising study tasks." />}
        </div>
      </div>
    </div>
  )
}
