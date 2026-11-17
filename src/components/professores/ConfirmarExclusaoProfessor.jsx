'use client'

import { useState } from 'react'
import Modal from '../Modal'

export default function ConfirmarExclusaoProfessor({ nome, onConfirmar, onFechar }) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function confirmar() {
    setErro('')
    setEnviando(true)
    try {
      await onConfirmar()
    } catch (e) {
      setErro(e.message || 'Não foi possível excluir o professor.')
      setEnviando(false)
    }
  }

  return (
    <Modal
      titulo="Excluir professor"
      onFechar={onFechar}
      bloqueado={enviando}
      rodape={
        <>
          <button type="button" className="btn" onClick={onFechar} disabled={enviando}>
            Voltar
          </button>
          <button type="button" className="btn primario m" onClick={confirmar} disabled={enviando}>
            <span className="mi">delete</span>
            {enviando ? 'Excluindo…' : 'Excluir professor'}
          </button>
        </>
      }
    >
      <p>
        O cadastro de professor de <b>{nome}</b> será excluído. A conta de usuário não é apagada.
      </p>
      <small className="muted">
        Professores vinculados a cursos não podem ser excluídos.
      </small>
      {erro && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          {erro}
        </div>
      )}
    </Modal>
  )
}