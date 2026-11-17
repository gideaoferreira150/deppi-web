'use client'

export default function Interruptor({ ligado, onChange, disabled, rotulo }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      disabled={disabled}
      onClick={() => onChange(!ligado)}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        border: 0,
        padding: 3,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: ligado ? 'flex-end' : 'flex-start',
        background: ligado ? 'var(--acc)' : 'var(--bd2)',
      }}
    >
      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
    </button>
  )
}