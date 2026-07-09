import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, usuario } = useAuth()

  if (!token) {
    return <Navigate to='/login' />
  }

  if (allowedRoles && !allowedRoles.includes(usuario?.rol)) {
    return <Navigate to='/equipos' />
  }

  return children || <Outlet />
}