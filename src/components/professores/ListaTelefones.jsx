'use client'

import { mascaraTelefone } from '../../utils/professor'

export default function ListaTelefones({ titulo, valores, onChange, disabled }) {
  const mudar = (i, v) =>
    onChange(valores.map((t, idx) => (idx === i ? mascaraTelefone(v) : t)))
  const remover = (i) => onChange(valores.filter((_, idx) => idx !== i))
  const adicionar = () => onChange([...valores, ''])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontWeight: 500, fontSize: 13 }}>{titulo}</span>

      {valores.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="mono"
            inputMode="tel"
            placeholder="(85) 99999-9999"
            aria-label={`${titulo} ${i + 1}`}
            value={t}
            disabled={disabled}
            onChange={(e) => mudar(i, e.target.value)}
          />
          <button
            type="button"
            className="icone-btn"
            aria-label="Remover telefone"
            disabled={disabled}
            onClick={() => remover(i)}
          >
            <span className="mi">close</span>
          </button>
        </div>
      ))}

      <button
        type="button"
        className="link-btn"
        disabled={disabled}
        onClick={adicionar}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 4 }}
      >
        <span className="mi" style={{ fontSize: 18 }}>add</span>
        Adicionar telefone
      </button>
    </div>
  )
}