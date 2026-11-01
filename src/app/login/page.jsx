
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { entrar, usuario, carregando } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [ver, setVer] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!carregando && usuario) {
      router.replace('/inicio')
    }
  }, [usuario, carregando, router])

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      await entrar(email.trim(), senha)
      router.replace('/inicio')
    } catch (err) {
      setErro(
        err.status === 401 || err.status === 400
          ? 'E-mail ou senha inválidos.'
          : err.message || 'Não foi possível entrar.'
      )
    } finally {
      setEnviando(false)
    }
  }

  if (carregando || usuario) {
    return <p className="muted">Carregando...</p>
  }

  return (
    <main className="login">
      <section className="login-hero">
        <div className="brand">
          <div className="logo">D</div>
          <div>
            <strong>DEPPI</strong>
            <small>IFCE · Extensão</small>
          </div>
        </div>

        <h1>Cursos de extensão do IFCE, num só lugar.</h1>

        <p>
          Inscreva-se, envie seus documentos e acompanhe
          a análise da sua inscrição.
        </p>
      </section>

      <form className="login-form" onSubmit={enviar}>
        <h2>Entrar</h2>
        <p className="muted">Use seu e-mail institucional.</p>

        {erro && (
          <div className="erro" role="alert">
            {erro}
          </div>
        )}

        <label>
          E-mail institucional
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@deppi.local"
            autoComplete="username"
          />
        </label>

        <label>
          Senha
          <span className="senha">
            <input
              type={ver ? 'text' : 'password'}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="mi olho"
              onClick={() => setVer(!ver)}
              aria-label="Mostrar senha"
            >
              {ver ? 'visibility_off' : 'visibility'}
            </button>
          </span>
        </label>

        <button
          className="btn primario"
          disabled={enviando}
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        {enviando && (
          <p className="muted peq">
            A API pode levar alguns segundos para responder.
          </p>
        )}
      </form>
    </main>
  )
}
