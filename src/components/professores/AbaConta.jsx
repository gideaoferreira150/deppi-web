'use client'

import { useMemo, useState } from 'react'
import Campo from './Campo'
import ListaTelefones from './ListaTelefones'
import Interruptor from './Interruptor'
import { validarDadosConta } from '../../utils/professor'
import { atualizarContaProfessor } from '../../services/professores'

export default function AbaConta({ prof, onSalvo }) {
  const inicial = () => ({
    nomeUsual: prof.usuario?.nomeSocial || prof.usuario?.nome || '',
    emailInstitucional: prof.usuario?.emailInstitucional ?? '',
    emailSecundario: prof.usuario?.emailSecundario ?? '',
    emailSiape: prof.emailSiape ?? '',
    emailNotificacoes: prof.emailNotificacoes ?? '',
    emailClassroom: prof.emailClassroom ?? '',
    emPGD: Boolean(prof.emPGD),
  })

  const [f, setF] = useState(inicial)
  const [telInst, setTelInst] = useState(prof.telefonesInstitucionais ?? [])
  const [telPess, setTelPess] = useState(prof.telefonesPessoais ?? [])
  const [tocado, setTocado] = useState({})
  const [erroApi, setErroApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  const erros = useMemo(() => validarDadosConta(f), [f])
  const mostrar = (k) => (tocado[k] ? erros[k] : undefined)
  const campo = (k) => ({
    value: f[k],
    onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value })),
    onBlur: () => setTocado((t) => ({ ...t, [k]: true })),
    disabled: enviando,
  })

  function descartar() {
    setF(inicial())
    setTelInst(prof.telefonesInstitucionais ?? [])
    setTelPess(prof.telefonesPessoais ?? [])
    setTocado({})
    setErroApi('')
  }

  async function enviar(e) {
    e.preventDefault()
    setTocado({
      nomeUsual: true,
      emailInstitucional: true,
      emailSecundario: true,
      emailSiape: true,
      emailNotificacoes: true,
      emailClassroom: true,
    })
    if (Object.keys(erros).length) return

    setErroApi('')
    setEnviando(true)
    try {
      await atualizarContaProfessor(prof.id, {
        nomeUsual: f.nomeUsual.trim(),
        emailInstitucional: f.emailInstitucional.trim(),
        emailSecundario: f.emailSecundario.trim(),
        // o e-mail SIAPE é único no banco: só é enviado quando preenchido
        ...(f.emailSiape.trim() ? { emailSiape: f.emailSiape.trim() } : {}),
        emailNotificacoes: f.emailNotificacoes.trim(),
        emailClassroom: f.emailClassroom.trim(),
        telefonesInstitucionais: telInst.map((t) => t.trim()).filter(Boolean),
        telefonesPessoais: telPess.map((t) => t.trim()).filter(Boolean),
        emPGD: f.emPGD,
      })
      await onSalvo('Dados de conta atualizados.')
    } catch (err) {
      setErroApi(err.message || 'Não foi possível salvar as alterações.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="graficos">
        <section className="card">
          <div className="card-topo"><h3>Conta</h3></div>
          <div className="form-grade">
            <Campo rotulo="Nome usual" erro={mostrar('nomeUsual')}>
              <input {...campo('nomeUsual')} />
            </Campo>
            <Campo rotulo="E-mail institucional" erro={mostrar('emailInstitucional')}>
              <input type="email" {...campo('emailInstitucional')} />
            </Campo>
            <Campo rotulo="E-mail secundário" erro={mostrar('emailSecundario')}>
              <input type="email" {...campo('emailSecundario')} />
            </Campo>
            <Campo rotulo="E-mail SIAPE" opcional erro={mostrar('emailSiape')}>
              <input type="email" placeholder="nome@siape.gov.br" {...campo('emailSiape')} />
            </Campo>
            <Campo rotulo="E-mail de notificações" opcional erro={mostrar('emailNotificacoes')}>
              <input type="email" {...campo('emailNotificacoes')} />
            </Campo>
            <Campo rotulo="E-mail do Classroom" opcional erro={mostrar('emailClassroom')}>
              <input type="email" {...campo('emailClassroom')} />
            </Campo>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              border: '1px solid var(--bd)',
              borderRadius: 8,
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>Participa do PGD</div>
              <small className="muted">Programa de Gestão e Desempenho</small>
            </div>
            <Interruptor
              rotulo="Participa do PGD"
              ligado={f.emPGD}
              disabled={enviando}
              onChange={(v) => setF((s) => ({ ...s, emPGD: v }))}
            />
          </div>
        </section>

        <section className="card" style={{ alignSelf: 'start' }}>
          <div className="card-topo"><h3>Telefones</h3></div>
          <ListaTelefones titulo="Institucionais" valores={telInst} onChange={setTelInst} disabled={enviando} />
          <hr style={{ border: 0, borderTop: '1px solid var(--bd)', margin: 0, width: '100%' }} />
          <ListaTelefones titulo="Pessoais" valores={telPess} onChange={setTelPess} disabled={enviando} />
        </section>
      </div>

      {erroApi && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          {erroApi}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button type="button" className="btn" onClick={descartar} disabled={enviando}>
          Descartar
        </button>
        <button type="submit" className="btn primario m" disabled={enviando}>
          <span className="mi">check</span>
          {enviando ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </div>
    </form>
  )
}