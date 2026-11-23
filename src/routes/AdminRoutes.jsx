import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminRoutes() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <p style={{ padding: 40 }}>Cargando...</p>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}

export default AdminRoutes