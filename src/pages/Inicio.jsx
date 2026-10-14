import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { buscarResumo } from '../api.js'

const INSCRICAO = [
  ['PENDENTE', 'Pendente', 'schedule', '#B45309'],
  ['DEFERIDA', 'Deferida', 'check_circle', '#15803D'],
  ['INDEFERIDA', 'Indeferida', 'cancel', '#B91C1C'],
  ['CANCELADA', 'Cancelada', 'block', '#5C5C5C']
]
const CURSO = [
  ['EM_ANALISE', 'Em análise', 'hourglass_top', '#B45309'],
  ['EM_ANDAMENTO', 'Em andamento', 'play_circle', '#15803D'],
  ['CONCLUIDO', 'Concluído', 'task_alt', '#1D4ED8'],
  ['FECHADO', 'Fechado', 'lock', '#5C5C5C']
]
const fmt = (n) => n.toLocaleString('pt-BR')

function Barras({ titulo, itens, dados, rodape }) {
  const max = Math.max(1, ...itens.map(([k]) => dados[k]))
  return (
    <div className="card">
      <div className="card-topo"><h3>{titulo}</h3>{rodape}</div>
      {itens.map(([k, rotulo, icone, cor]) => (
        <div className="barra-linha" key={k}>
          <span className="rotulo" style={{ color: cor }}><span className="mi">{icone}</span>{rotulo}</span>
          <div className="trilho"><div style={{ width: `${(dados[k] / max) * 100}%`, background: cor }} /></div>
          <span className="valor">{fmt(dados[k])}</span>
        </div>
      ))}
    </div>
  )
}

function InicioAdmin() {
  const { usuario } = useAuth()
  const [d, setD] = useState(null)
  const [erro, setErro] = useState('')
  useEffect(() => { buscarResumo().then(setD).catch((e) => setErro(e.message)) }, [])

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <>
      <div className="pagina-topo">
        <div><h1>Bom dia, administrador</h1><span className="muted">{hoje[0].toUpperCase() + hoje.slice(1)}</span></div>
        <Link className="btn" to="/relatorios"><span className="mi">bar_chart</span>Ver relatórios</Link>
      </div>

      {erro && <div className="erro" role="alert"><span className="mi">error</span>Não foi possível carregar o resumo: {erro}</div>}
      {!d && !erro && <p className="muted">Carregando…</p>}

      {d && (
        <>
          <div className="totais">
            {Object.entries(d.totais).map(([rot, v]) => (
              <div key={rot}><span>{rot}</span><b className={rot === 'Vagas restantes' ? 'destaque' : ''}>{fmt(v)}</b></div>
            ))}
          </div>
          <div className="graficos">
            <Barras titulo="Inscrições por situação" itens={INSCRICAO} dados={d.inscricoes} rodape={<Link to="/inscricoes">Detalhes</Link>} />
            <Barras titulo="Cursos por situação" itens={CURSO} dados={d.cursos} rodape={<span className="muted">{d.totais.Cursos} {d.totais.Cursos === 1 ? 'curso' : 'cursos'}</span>} />
          </div>
        </>
      )}
    </>
  )
}

export default function Inicio() {
  const { usuario } = useAuth()
  if (usuario.cargo === 'ADMIN') return <InicioAdmin />
  const primeiro = usuario.nome.split(' ')[0]
  return (
    <div className="pagina-topo"><div><h1>Olá, {primeiro}</h1><span className="muted">A tela de Início do cargo {usuario.cargo} entra nas próximas entregas.</span></div></div>
  )
}
