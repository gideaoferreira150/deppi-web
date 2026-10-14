import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import { menuDoCargo } from './permissoes.js'

const iniciais = (nome = '') => nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

export default function Layout({ titulo, children }) {
  const { usuario, sair } = useAuth()
  const nav = useNavigate()
  const fazerLogout = () => { sair(); nav('/login', { replace: true }) }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">D</div>
          <div><strong>DEPPI</strong><small>IFCE · Extensão</small></div>
        </div>
        <nav>
          {menuDoCargo(usuario.cargo).map((t) => (
            <NavLink key={t.path} to={t.path} className={({ isActive }) => 'nav-item' + (isActive ? ' ativo' : '')}>
              <span className="mi">{t.icon}</span>{t.label}
            </NavLink>
          ))}
        </nav>
        <button className="nav-item sair" onClick={fazerLogout}><span className="mi">logout</span>Sair</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="crumb"><span className="mi">menu</span>{titulo}</span>
          <div className="user">
            <div className="user-txt"><b>{usuario.nome}</b><span className="cargo">{usuario.cargo}</span></div>
            <span className="avatar">{iniciais(usuario.nome)}</span>
          </div>
        </header>
        <section className="conteudo">{children}</section>
      </main>
    </div>
  )
}
