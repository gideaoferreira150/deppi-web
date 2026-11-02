'use client'

import { useMemo, useState } from 'react'
import Modal from '../Modal'
import { mascaraCnpj, validarInstituicao } from '../../utils/instituicao'

const VAZIO = { nome: '', campus: '', cidade: '', cnpj: '' }

function Campo({ rotulo, erro, ajuda, children }) {
  return (
    <label className={'campo' + (erro ? ' invalido' : '')}>
      {rotulo}
      <span className="campo-input">
        {children}
        {erro && <span className="mi campo-alerta">error</span>}
      </span>
      {erro ? (
        <small className="campo-erro" role="alert">{erro}</small>
      ) : (
        ajuda && <small className="campo-ajuda">{ajuda}</small>
      )}
    </label>
  )
}

export default function FormInstituicao({ inicial, onSalvar, onFechar }) {
  const editando = Boolean(inicial)
  const [f, setF] = useState(
    inicial
      ? { nome: inicial.nome, campus: inicial.campus, cidade: inicial.cidade, cnpj: mascaraCnpj(inicial.cnpj) }
      : VAZIO
  )
  const [tocado, setTocado] = useState({})
  const [erroApi, setErroApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  const erros = useMemo(() => validarInstituicao(f), [f])
  const mostrar = (k) => (tocado[k] ? erros[k] : undefined)
  const campo = (k) => ({
    value: f[k],
    onChange: (e) => setF((s) => ({ ...s, [k]: k === 'cnpj' ? mascaraCnpj(e.target.value) : e.target.value })),
    onBlur: () => setTocado((t) => ({ ...t, [k]: true })),
    disabled: enviando,
  })

  async function enviar(e) {
    e.preventDefault()
    setTocado({ nome: true, campus: true, cidade: true, cnpj: true })
    if (Object.keys(erros).length) return

    setErroApi('')
    setEnviando(true)
    try {
      await onSalvar({
        nome: f.nome.trim(),
        campus: f.campus.trim(),
        cidade: f.cidade.trim(),
        cnpj: f.cnpj,
      })
    } catch (err) {
      setErroApi(err.message || 'Não foi possível salvar a instituição.')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <Modal
        titulo={editando ? 'Editar instituição' : 'Nova instituição'}
        onFechar={onFechar}
        bloqueado={enviando}
        rodape={
          <>
            <button type="button" className="btn" onClick={onFechar} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="btn primario m" disabled={enviando}>
              <span className="mi">{editando ? 'check' : 'add'}</span>
              {enviando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar instituição'}
            </button>
          </>
        }
      >
        <div className="form-grade">
          <div className="span2">
            <Campo rotulo="Nome" erro={mostrar('nome')}>
              <input data-autofocus {...campo('nome')} />
            </Campo>
          </div>
          <Campo rotulo="Campus" erro={mostrar('campus')}>
            <input {...campo('campus')} />
          </Campo>
          <Campo rotulo="Cidade" erro={mostrar('cidade')}>
            <input {...campo('cidade')} />
          </Campo>
          <div className="span2">
            <Campo
              rotulo="CNPJ"
              erro={mostrar('cnpj')}
              ajuda="Somente números; a máscara é aplicada automaticamente."
            >
              <input className="mono" inputMode="numeric" placeholder="00.000.000/0000-00" {...campo('cnpj')} />
            </Campo>
          </div>
        </div>
        {erroApi && (
          <div className="erro" role="alert">
            <span className="mi">error</span>
            {erroApi}
          </div>
        )}
      </Modal>
    </form>
  )
}