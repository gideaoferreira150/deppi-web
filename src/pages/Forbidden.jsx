import { Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import Layout from '../Layout.jsx'

export default function Forbidden({ dentro }) {
  const { usuario } = useAuth()
  const corpo = (
    <div className="vazio">
      <span className="mi grande">lock</span>
      <h1>403 · Acesso negado</h1>
      <p>Seu cargo ({usuario?.cargo}) não tem permissão para acessar esta página.</p>
      <Link className="btn primario" to="/inicio">Voltar ao início</Link>
    </div>
  )
  return dentro ? corpo : <Layout titulo="Acesso negado">{corpo}</Layout>
}
