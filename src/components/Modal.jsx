'use client'

import { useEffect, useRef } from 'react'

export default function Modal({ titulo, children, rodape, onFechar, bloqueado = false }) {
  const ref = useRef(null)
  const estado = useRef({ onFechar, bloqueado })
  estado.current = { onFechar, bloqueado }

  useEffect(() => {
    const anterior = document.activeElement
    const alvo = ref.current?.querySelector('[data-autofocus]') ?? ref.current
    alvo?.focus()

    const aoTeclar = (e) => {
      const { onFechar: fechar, bloqueado: travado } = estado.current
      if (e.key === 'Escape' && !travado) fechar()
    }
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
      anterior?.focus?.()
    }
  }, [])

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !bloqueado) onFechar()
      }}
    >
      <div
        className="dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogo-titulo"
        tabIndex={-1}
        ref={ref}
      >
        <div className="dialogo-topo">
          <h2 id="dialogo-titulo">{titulo}</h2>
          <button
            type="button"
            className="icone-btn"
            aria-label="Fechar"
            onClick={onFechar}
            disabled={bloqueado}
          >
            <span className="mi">close</span>
          </button>
        </div>
        <div className="dialogo-corpo">{children}</div>
        {rodape && <div className="dialogo-rodape">{rodape}</div>}
      </div>
    </div>
  )
}