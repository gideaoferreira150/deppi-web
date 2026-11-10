'use client'

import { useMemo, useState } from 'react'
import Modal from '../Modal'
import {
  validarCurso,
  dataParaInput,
  horaParaInput,
  dataParaApi,
  horaParaApi,
} from '../../utils/curso'

const VAZIO = {
  nome: '',
  fkInstituicao: '',
  carga_horaria: '',
  vagas: '',
  dataInicio: '',
  dataFim: '',
  horarioInicio: '',
  horarioFim: '',
}

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

export default function FormCurso({ inicial, instituicoes, onSalvar, onFechar }) {
  const editando = Boolean(inicial)
  const [f, setF] = useState(
    inicial
      ? {
          nome: inicial.nome,
          fkInstituicao: inicial.fkInstituicao,
          carga_horaria: String(inicial.carga_horaria),
          vagas: String(inicial.vagas),
          dataInicio: dataParaInput(inicial.dataInicio),
          dataFim: dataParaInput(inicial.dataFim),
          horarioInicio: horaParaInput(inicial.horarioInicio),
          horarioFim: horaParaInput(inicial.horarioFim),
        }
      : VAZIO
  )
  const [tocado, setTocado] = useState({})
  const [erroApi, setErroApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  const erros = useMemo(() => validarCurso(f), [f])
  const mostrar = (k) => (tocado[k] ? erros[k] : undefined)
  const campo = (k) => ({
    value: f[k],
    onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value })),
    onBlur: () => setTocado((t) => ({ ...t, [k]: true })),
    disabled: enviando,
  })

  async function enviar(e) {
    e.preventDefault()
    setTocado(Object.fromEntries(Object.keys(VAZIO).map((k) => [k, true])))
    if (Object.keys(erros).length) return

    setErroApi('')
    setEnviando(true)
    try {
      await onSalvar({
        nome: f.nome.trim(),
        fkInstituicao: f.fkInstituicao,
        carga_horaria: Number(f.carga_horaria),
        vagas: Number(f.vagas),
        dataInicio: dataParaApi(f.dataInicio),
        dataFim: dataParaApi(f.dataFim),
        horarioInicio: horaParaApi(f.horarioInicio),
        horarioFim: horaParaApi(f.horarioFim),
      })
    } catch (err) {
      setErroApi(err.message || 'Não foi possível salvar o curso.')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <Modal
        titulo={editando ? 'Editar curso' : 'Novo curso'}
        onFechar={onFechar}
        bloqueado={enviando}
        rodape={
          <>
            <button type="button" className="btn" onClick={onFechar} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="btn primario m" disabled={enviando}>
              <span className="mi">{editando ? 'check' : 'add'}</span>
              {enviando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Cadastrar curso'}
            </button>
          </>
        }
      >
        <div className="form-grade">
          <div className="span2">
            <Campo rotulo="Nome do curso" erro={mostrar('nome')}>
              <input data-autofocus {...campo('nome')} />
            </Campo>
          </div>

          <div className="span2">
            <Campo
              rotulo="Instituição"
              erro={mostrar('fkInstituicao')}
              ajuda={
                editando
                  ? 'A instituição não pode ser alterada depois do cadastro.'
                  : instituicoes.length === 0
                    ? 'Cadastre uma instituição antes de criar cursos.'
                    : undefined
              }
            >
              <select {...campo('fkInstituicao')} disabled={enviando || editando}>
                <option value="">Selecione…</option>
                {instituicoes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nome} · {i.campus}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <Campo rotulo="Carga horária (h)" erro={mostrar('carga_horaria')}>
            <input type="number" min="1" inputMode="numeric" {...campo('carga_horaria')} />
          </Campo>
          <Campo rotulo="Vagas" erro={mostrar('vagas')}>
            <input type="number" min="1" inputMode="numeric" {...campo('vagas')} />
          </Campo>

          <Campo rotulo="Data de início" erro={mostrar('dataInicio')}>
            <input type="date" {...campo('dataInicio')} />
          </Campo>
          <Campo rotulo="Data de término" erro={mostrar('dataFim')}>
            <input type="date" {...campo('dataFim')} />
          </Campo>

          <Campo rotulo="Horário de início" erro={mostrar('horarioInicio')}>
            <input type="time" {...campo('horarioInicio')} />
          </Campo>
          <Campo rotulo="Horário de término" erro={mostrar('horarioFim')}>
            <input type="time" {...campo('horarioFim')} />
          </Campo>
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