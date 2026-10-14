import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Forbidden from './pages/Forbidden.jsx'

export default function ProtectedRoute({ cargos, children }) {
  const { usuario } = useAuth()
  const loc = useLocation()
  if (!usuario) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (cargos && !cargos.includes(usuario.cargo)) return <Forbidden />
  return children
}
