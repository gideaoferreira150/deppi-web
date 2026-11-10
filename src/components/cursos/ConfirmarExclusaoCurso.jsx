'use client'

import { useState } from 'react'
import Modal from '../Modal'

export default function ConfirmarExclusaoCurso({ curso, onConfirmar, onFechar }) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function confirmar() {
    setErro('')
    setEnviando(true)
    try {
      await onConfirmar()
    } catch (e) {
      setErro(e.message || 'Não foi possível excluir o curso.')
      setEnviando(false)
    }
  }

  return (
    <Modal
      titulo="Excluir curso"
      onFechar={onFechar}
      bloqueado={enviando}
      rodape={
        <>
          <button type="button" className="btn" onClick={onFechar} disabled={enviando}>
            Cancelar
          </button>
          <button type="button" className="btn primario m" onClick={confirmar} disabled={enviando}>
            <span className="mi">delete</span>
            {enviando ? 'Excluindo…' : 'Excluir'}
          </button>
        </>
      }
    >
      <p>
        Tem certeza que deseja excluir <b>{curso.nome}</b>? Essa ação não pode ser desfeita.
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