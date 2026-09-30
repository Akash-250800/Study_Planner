import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext.jsx'
import Loader from './Loader.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullPage label="Opening your planner..." />

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
