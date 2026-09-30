import { useState } from 'react'
import { KeyRound, Save, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import api from '../api/axios.js'
import PageHeader from '../components/common/PageHeader.jsx'
import Toast from '../components/common/Toast.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate } from '../utils/dateUtils.js'

export default function Profile() {
  const { user, refreshProfile, logout } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [toast, setToast] = useState(null)

  const updateProfile = async (event) => {
    event.preventDefault()
    setSavingProfile(true)
    try {
      await api.put('/users/profile', profile)
      await refreshProfile()
      setToast({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Unable to update profile.' })
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (event) => {
    event.preventDefault()
    setSavingPassword(true)
    try {
      const { data } = await api.put('/users/password', passwords)
      if (data.token) localStorage.setItem('studyPlannerToken', data.token)
      setPasswords({ currentPassword: '', newPassword: '' })
      setToast({ type: 'success', message: 'Password changed successfully.' })
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Unable to change password.' })
    } finally {
      setSavingPassword(false)
    }
  }

  const deleteAccount = async () => {
    const confirmed = window.confirm('Delete your StudyFlow account and all tasks permanently? This cannot be undone.')
    if (!confirmed) return
    try {
      await api.delete('/users/account')
      await logout()
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to delete account.' })
    }
  }

  const initials = user?.name?.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'S'

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <PageHeader eyebrow="Account settings" title="Your profile" description="Keep your account details current and manage your sign-in password." />

      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <section className="surface h-fit rounded-3xl p-6 text-center xl:sticky xl:top-24">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-600 to-sky-500 text-2xl font-extrabold text-white shadow-xl shadow-indigo-500/20">{initials}</div>
          <h2 className="mt-5 text-xl font-extrabold text-slate-950">{user?.name}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{user?.email}</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">
            <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck size={17} /><span className="text-xs font-extrabold">Protected student account</span></div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Member since {formatDate(user?.createdAt)}</p>
          </div>
        </section>

        <div className="space-y-5">
          <form onSubmit={updateProfile} className="surface rounded-3xl p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><UserRound size={20} /></div>
              <div><h2 className="text-base font-extrabold text-slate-900">Personal details</h2><p className="mt-1 text-xs font-medium text-slate-500">Name and account email</p></div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div><label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Full name</label><input className="input-control" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required /></div>
              <div><label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Email</label><input type="email" className="input-control" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></div>
            </div>
            <div className="mt-6 flex justify-end"><button disabled={savingProfile} className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"><Save size={17} /> {savingProfile ? 'Saving...' : 'Save profile'}</button></div>
          </form>

          <form onSubmit={changePassword} className="surface rounded-3xl p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><KeyRound size={20} /></div>
              <div><h2 className="text-base font-extrabold text-slate-900">Change password</h2><p className="mt-1 text-xs font-medium text-slate-500">Use at least 8 characters with upper/lowercase and a number</p></div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div><label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">Current password</label><input type="password" className="input-control" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required /></div>
              <div><label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">New password</label><input type="password" className="input-control" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required minLength={8} /></div>
            </div>
            <div className="mt-6 flex justify-end"><button disabled={savingPassword} className="flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white disabled:opacity-60"><KeyRound size={17} /> {savingPassword ? 'Updating...' : 'Update password'}</button></div>
          </form>

          <section className="rounded-3xl border border-rose-100 bg-rose-50/70 p-5 sm:p-7">
            <h2 className="text-base font-extrabold text-rose-900">Danger zone</h2>
            <p className="mt-2 text-sm leading-6 text-rose-700/80">Deleting your account permanently removes your profile, subjects, tasks and reminders.</p>
            <button onClick={deleteAccount} className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-extrabold text-rose-700 hover:bg-rose-100"><Trash2 size={17} /> Delete account</button>
          </section>
        </div>
      </div>
    </div>
  )
}
