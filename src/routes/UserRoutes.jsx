import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function UserRoutes() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p style={{ padding: 40 }}>Cargando...</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}

export default UserRoutes