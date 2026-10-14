import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import { TELAS } from './permissoes.js'
import ProtectedRoute from './ProtectedRoute.jsx'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import Inicio from './pages/Inicio.jsx'
import Forbidden from './pages/Forbidden.jsx'
import EmConstrucao from './pages/EmConstrucao.jsx'

export default function App() {
  const { usuario } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/inicio" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/inicio" replace />} />

      {TELAS.map((t) => (
        <Route
          key={t.path}
          path={t.path}
          element={
            <ProtectedRoute cargos={t.cargos}>
              <Layout titulo={t.label}>
                {t.path === '/inicio' ? <Inicio /> : <EmConstrucao titulo={t.label} />}
              </Layout>
            </ProtectedRoute>
          }
        />
      ))}

      {/* rotas que existem no sistema mas ainda sem menu: protegidas igual */}
      <Route path="/403" element={<ProtectedRoute><Layout titulo="Acesso negado"><Forbidden dentro /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={usuario ? '/inicio' : '/login'} replace />} />
    </Routes>
  )
}
