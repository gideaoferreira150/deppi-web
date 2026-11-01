'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { menuDoCargo, TELAS } from '../../permissoes'
import Forbidden from '../../components/Forbidden'

const iniciais = (nome = '') =>
  nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

export default function PainelLayout({ children }) {
  const { usuario, carregando, sair } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!carregando && !usuario) router.replace('/login')
  }, [carregando, usuario, router])

  if (carregando || !usuario) return null

  const menu = menuDoCargo(usuario.cargo)
  const tela = TELAS.find((t) => pathname.startsWith(t.path))
  const permitido = !tela || tela.cargos.includes(usuario.cargo)
  const titulo = permitido ? (tela?.label ?? '') : 'Acesso negado'

  const fazerLogout = () => {
    sair()
    router.replace('/login')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">D</div>
          <div>
            <strong>DEPPI</strong>
            <small>IFCE · Extensão</small>
          </div>
        </div>

        <nav>
          {menu.map((t) => (
            <Link
              key={t.path}
              href={t.path}
              className={'nav-item' + (pathname.startsWith(t.path) ? ' ativo' : '')}
            >
              <span className="mi">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </nav>

        <button className="nav-item sair" onClick={fazerLogout}>
          <span className="mi">logout</span>Sair
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="crumb">
            <span className="mi">menu</span>
            {titulo}
          </span>
          <div className="user">
            <div className="user-txt">
              <b>{usuario.nome}</b>
              <span className="cargo">{usuario.cargo}</span>
            </div>
            <span className="avatar">{iniciais(usuario.nome)}</span>
          </div>
        </header>
        <section className="conteudo">{permitido ? children : <Forbidden />}</section>
      </main>
    </div>
  )
}