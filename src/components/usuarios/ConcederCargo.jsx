'use client'

import { useState } from 'react'
import Modal from '../Modal'
import { cargosDisponiveis } from '../../utils/usuario'

export default function ConcederCargo({ usuario, onConfirmar, onFechar }) {
  const opcoes = cargosDisponiveis(usuario)
  const [cargo, setCargo] = useState(opcoes[0]?.valor ?? '')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function enviar(e) {
    e.preventDefault()
    if (!cargo) return
    setErro('')
    setEnviando(true)
    try {
      await onConfirmar(cargo)
    } catch (err) {
      setErro(err.message || 'Não foi possível conceder o cargo.')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <Modal
        titulo="Conceder cargo"
        onFechar={onFechar}
        bloqueado={enviando}
        rodape={
          <>
            <button type="button" className="btn" onClick={onFechar} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="btn primario m" disabled={enviando || !cargo}>
              <span className="mi">shield_person</span>
              {enviando ? 'Concedendo…' : `Conceder ${cargo}`}
            </button>
          </>
        }
      >
        <p className="dialogo-texto">
          Escolha o cargo para <b>{usuario.nome}</b>. Os cargos atuais são mantidos.
        </p>

        <div className="opcoes-cargo" role="radiogroup" aria-label="Cargo a conceder">
          {opcoes.map((o, i) => (
            <label key={o.valor} className={'opcao-cargo' + (cargo === o.valor ? ' sel' : '')}>
              <input
                type="radio"
                name="cargo"
                value={o.valor}
                checked={cargo === o.valor}
                onChange={() => setCargo(o.valor)}
                disabled={enviando}
                data-autofocus={i === 0 ? '' : undefined}
              />
              <span className="opcao-radio" aria-hidden="true" />
              <span>
                <b>{o.valor}</b>
                <small>{o.descricao}</small>
              </span>
            </label>
          ))}
        </div>

        <div className="atencao">
          <span className="mi">warning</span>
          Esta ação não pode ser desfeita pela interface.
        </div>

        {erro && (
          <div className="erro" role="alert">
            <span className="mi">error</span>
            {erro}
          </div>
        )}
      </Modal>
    </form>
  )
}