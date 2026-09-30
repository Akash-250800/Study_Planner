import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './components/layout/AppLayout.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import AddTask from './pages/AddTask.jsx'
import Analytics from './pages/Analytics.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditTask from './pages/EditTask.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import Subjects from './pages/Subjects.jsx'
import Tasks from './pages/Tasks.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/new" element={<AddTask />} />
        <Route path="/tasks/:id/edit" element={<EditTask />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
