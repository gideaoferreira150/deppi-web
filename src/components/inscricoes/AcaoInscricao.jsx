'use client'

import { useState } from 'react'
import Modal from '../Modal'

const TEXTOS = {
  APROVAR: { titulo: 'Deferir inscrição', para: 'Deferida', botao: 'Deferir', icone: 'check_circle', motivo: false },
  REJEITAR: { titulo: 'Indeferir inscrição', para: 'Indeferida', botao: 'Indeferir inscrição', icone: 'cancel', motivo: true },
  CANCELAR: { titulo: 'Cancelar inscrição', para: 'Cancelada', botao: 'Cancelar inscrição', icone: 'block', motivo: true },
}

export default function AcaoInscricao({ acao, aluno, curso, onConfirmar, onFechar }) {
  const t = TEXTOS[acao]
  const [motivo, setMotivo] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const limpo = motivo.trim()
  const invalido = t.motivo && limpo.length > 0 && limpo.length < 3

  async function confirmar() {
    if (invalido) return
    setErro('')
    setEnviando(true)
    try {
      await onConfirmar(limpo || undefined)
    } catch (e) {
      setErro(e.message || 'Não foi possível concluir a ação.')
      setEnviando(false)
    }
  }

  return (
    <Modal
      titulo={t.titulo}
      onFechar={onFechar}
      bloqueado={enviando}
      rodape={
        <>
          <button type="button" className="btn" onClick={onFechar} disabled={enviando}>
            Voltar
          </button>
          <button
            type="button"
            className="btn primario m"
            onClick={confirmar}
            disabled={enviando || invalido}
            style={acao !== 'APROVAR' ? { background: 'var(--red)', borderColor: 'var(--red)' } : undefined}
          >
            <span className="mi">{t.icone}</span>
            {enviando ? 'Enviando…' : t.botao}
          </button>
        </>
      }
    >
      <p>
        A inscrição de <b>{aluno}</b> em <b>{curso}</b> passará para “{t.para}”.
        {t.motivo && ' O motivo fica registrado no histórico.'}
      </p>

      {t.motivo && (
        <label className={'campo' + (invalido ? ' invalido' : '')}>
          <span>Motivo <span className="muted">(opcional)</span></span>
          <textarea
            data-autofocus
            value={motivo}
            maxLength={255}
            disabled={enviando}
            onChange={(e) => setMotivo(e.target.value)}
            style={{
              width: '100%',
              minHeight: 96,
              padding: 10,
              border: '1px solid var(--bd2)',
              borderRadius: 8,
              font: 'inherit',
              resize: 'vertical',
            }}
          />
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <small className={invalido ? 'campo-erro' : 'campo-ajuda'}>Entre 3 e 255 caracteres</small>
            <small className="mono muted">{motivo.length} / 255</small>
          </span>
        </label>
      )}

      {erro && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          {erro}
        </div>
      )}
    </Modal>
  )
}