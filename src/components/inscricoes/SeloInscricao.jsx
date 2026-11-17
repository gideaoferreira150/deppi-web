import { STATUS_INSCRICAO } from '../../utils/inscricao'

export default function SeloInscricao({ status }) {
  const s = STATUS_INSCRICAO[status] ?? { rotulo: status, icone: 'help', cor: '#5C5C5C' }
  return (
    <span className="selo" style={{ color: s.cor, background: `${s.cor}1A`, gap: 4 }}>
      <span className="mi" style={{ fontSize: 14 }}>{s.icone}</span>
      {s.rotulo}
    </span>
  )
}