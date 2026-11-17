'use client'

import { useMemo, useState } from 'react'
import Campo from './Campo'
import ListaTelefones from './ListaTelefones'
import Interruptor from './Interruptor'
import { TITULACOES, ESCOLARIDADES, validarDadosFuncionais } from '../../utils/professor'
import { atualizarProfessor } from '../../services/professores'

const com = (lista, atual) => (atual && !lista.includes(atual) ? [...lista, atual] : lista)

export default function AbaFuncionais({ prof, onSalvo }) {
  const inicial = () => ({
    siape: prof.siape ?? '',
    emailSiape: prof.emailSiape ?? '',
    titulacao: prof.titulacao ?? '',
    escolaridade: prof.escolaridade ?? '',
    emPGD: Boolean(prof.emPGD),
  })

  const [f, setF] = useState(inicial)
  const [telInst, setTelInst] = useState(prof.telefonesInstitucionais ?? [])
  const [telPess, setTelPess] = useState(prof.telefonesPessoais ?? [])
  const [tocado, setTocado] = useState({})
  const [erroApi, setErroApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  const erros = useMemo(() => validarDadosFuncionais(f), [f])
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
    setTocado({ siape: true, emailSiape: true })
    if (Object.keys(erros).length) return

    setErroApi('')
    setEnviando(true)
    try {
      await atualizarProfessor(prof.id, {
        siape: f.siape.trim(),
        emailSiape: f.emailSiape.trim() || null,
        titulacao: f.titulacao || null,
        escolaridade: f.escolaridade || null,
        emPGD: f.emPGD,
        telefonesInstitucionais: telInst.map((t) => t.trim()).filter(Boolean),
        telefonesPessoais: telPess.map((t) => t.trim()).filter(Boolean),
      })
      await onSalvo('Dados funcionais atualizados.')
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
          <div className="card-topo"><h3>Dados funcionais</h3></div>
          <div className="form-grade">
            <Campo rotulo="SIAPE" erro={mostrar('siape')}>
              <input className="mono" inputMode="numeric" {...campo('siape')} />
            </Campo>
            <Campo rotulo="E-mail SIAPE" opcional erro={mostrar('emailSiape')}>
              <input type="email" placeholder="nome@siape.gov.br" {...campo('emailSiape')} />
            </Campo>
            <Campo rotulo="Titulação" opcional>
              <select {...campo('titulacao')}>
                <option value="">Selecione…</option>
                {com(TITULACOES, f.titulacao).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Campo>
            <Campo rotulo="Escolaridade" opcional>
              <select {...campo('escolaridade')}>
                <option value="">Selecione…</option>
                {com(ESCOLARIDADES, f.escolaridade).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
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