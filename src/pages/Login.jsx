import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export default function Login() {
  const { entrar } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [ver, setVer] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setErro(''); setCarregando(true)
    try {
      await entrar(email.trim(), senha)
      nav(loc.state?.from || '/inicio', { replace: true })
    } catch (err) {
      setErro(err.status === 401 || err.status === 400 ? 'E-mail ou senha inválidos.' : err.message || 'Não foi possível entrar.')
    } finally { setCarregando(false) }
  }

  return (
    <div className="login">
      <div className="login-hero">
        <div className="brand"><div className="logo">D</div><div><strong>DEPPI</strong><small>IFCE · Extensão</small></div></div>
        <h1>Cursos de extensão do IFCE, num só lugar.</h1>
        <p>Inscreva-se, envie seus documentos e acompanhe a análise da sua inscrição.</p>
      </div>
      <form className="login-form" onSubmit={enviar}>
        <h2>Entrar</h2>
        <p className="muted">Use seu e-mail institucional.</p>
        {erro && <div className="erro" role="alert"><span className="mi">error</span>{erro}</div>}
        <label>E-mail institucional
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@deppi.local" autoComplete="username" />
        </label>
        <label>Senha
          <span className="senha">
            <input type={ver ? 'text' : 'password'} required value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />
            <button type="button" className="mi olho" onClick={() => setVer(!ver)} aria-label="Mostrar senha">{ver ? 'visibility_off' : 'visibility'}</button>
          </span>
        </label>
        <button className="btn primario" disabled={carregando}>{carregando ? 'Entrando…' : 'Entrar'}</button>
        {carregando && <p className="muted peq">A API gratuita pode levar ~30 s para acordar na primeira vez.</p>}
      </form>
    </div>
  )
}
