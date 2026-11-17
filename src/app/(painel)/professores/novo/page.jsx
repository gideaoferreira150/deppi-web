'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Campo from '../../../../components/professores/Campo'
import ListaTelefones from '../../../../components/professores/ListaTelefones'
import Interruptor from '../../../../components/professores/Interruptor'
import { TITULACOES, ESCOLARIDADES, validarNovoProfessor } from '../../../../utils/professor'
import { criarProfessor } from '../../../../services/professores'

const VAZIO = {
  fkUsuario: '',
  siape: '',
  emailSiape: '',
  titulacao: '',
  escolaridade: '',
  emPGD: false,
}

export default function NovoProfessorPage() {
  const router = useRouter()
  const [f, setF] = useState(VAZIO)
  const [telInst, setTelInst] = useState([])
  const [telPess, setTelPess] = useState([])
  const [tocado, setTocado] = useState({})
  const [erroApi, setErroApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  const erros = useMemo(() => validarNovoProfessor(f), [f])
  const mostrar = (k) => (tocado[k] ? erros[k] : undefined)
  const campo = (k) => ({
    value: f[k],
    onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value })),
    onBlur: () => setTocado((t) => ({ ...t, [k]: true })),
    disabled: enviando,
  })

  async function enviar(e) {
    e.preventDefault()
    setTocado({ fkUsuario: true, siape: true, emailSiape: true })
    if (Object.keys(erros).length) return

    setErroApi('')
    setEnviando(true)
    try {
      await criarProfessor({
        fkUsuario: f.fkUsuario.trim(),
        siape: f.siape.trim(),
        emailSiape: f.emailSiape.trim() || null,
        titulacao: f.titulacao || null,
        escolaridade: f.escolaridade || null,
        emPGD: f.emPGD,
        telefonesInstitucionais: telInst.map((t) => t.trim()).filter(Boolean),
        telefonesPessoais: telPess.map((t) => t.trim()).filter(Boolean),
      })
      router.push('/professores')
    } catch (err) {
      setErroApi(err.message || 'Não foi possível cadastrar o professor.')
      setEnviando(false)
    }
  }

  return (
    <form
      onSubmit={enviar}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <div className="pagina-topo">
        <div>
          <h1>Novo professor</h1>
          <span className="muted">
            Vincule um usuário existente e informe os dados funcionais.
          </span>
        </div>
      </div>

      <div
        role="note"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          borderRadius: 8,
          background: '#FBF1E3',
          border: '1px solid #F0D9B5',
          color: '#8A4B0B',
        }}
      >
        <span className="mi">warning</span>
        Ainda não é possível criar o usuário do professor por aqui. Informe o ID de um usuário já cadastrado.
      </div>

      <div className="graficos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card">
            <div className="card-topo"><h3>Vínculo</h3></div>
            <Campo
              rotulo="ID do usuário"
              erro={mostrar('fkUsuario')}
              ajuda="UUID do usuário. O administrador encontra em Usuários."
            >
              <input
                className="mono"
                placeholder="00000000-0000-0000-0000-000000000000"
                {...campo('fkUsuario')}
              />
            </Campo>
          </section>

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
                  {TITULACOES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Campo>
              <Campo rotulo="Escolaridade" opcional>
                <select {...campo('escolaridade')}>
                  <option value="">Selecione…</option>
                  {ESCOLARIDADES.map((t) => (
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
        </div>

        <section className="card" style={{ alignSelf: 'start' }}>
          <div className="card-topo"><h3>Telefones</h3></div>
          <ListaTelefones
            titulo="Institucionais"
            valores={telInst}
            onChange={setTelInst}
            disabled={enviando}
          />
          <hr style={{ border: 0, borderTop: '1px solid var(--bd)', margin: 0, width: '100%' }} />
          <ListaTelefones
            titulo="Pessoais"
            valores={telPess}
            onChange={setTelPess}
            disabled={enviando}
          />
        </section>
      </div>

      {erroApi && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          {erroApi}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Link className="btn" href="/professores">Cancelar</Link>
        <button type="submit" className="btn primario m" disabled={enviando}>
          <span className="mi">person_add</span>
          {enviando ? 'Salvando…' : 'Cadastrar professor'}
        </button>
      </div>
    </form>
  )
}