'use client'

import { useState } from 'react'
import Modal from '../Modal'

export default function ConfirmarExclusao({ inst, onConfirmar, onFechar }) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function confirmar() {
    setErro('')
    setEnviando(true)
    try {
      await onConfirmar()
    } catch (err) {
      setErro(err.message || 'Não foi possível excluir a instituição.')
      setEnviando(false)
    }
  }

  return (
    <Modal
      titulo="Excluir instituição"
      onFechar={onFechar}
      bloqueado={enviando}
      rodape={
        <>
          <button type="button" className="btn" onClick={onFechar} disabled={enviando} data-autofocus>
            Voltar
          </button>
          <button type="button" className="btn destrutivo" onClick={confirmar} disabled={enviando}>
            <span className="mi">delete</span>
            {enviando ? 'Excluindo…' : 'Excluir instituição'}
          </button>
        </>
      }
    >
      <p className="dialogo-texto">
        <b>{inst.nome} · Campus {inst.campus}</b> será removida. Esta ação não pode ser desfeita.
      </p>
      {erro && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          {erro}
        </div>
      )}
    </Modal>
  )
}