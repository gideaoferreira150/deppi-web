'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import SeloInscricao from '../../../../components/inscricoes/SeloInscricao'
import AcaoInscricao from '../../../../components/inscricoes/AcaoInscricao'
import {
  STATUS_INSCRICAO,
  CATEGORIAS,
  ACAO_PARA_ROTULO,
  formatarData,
  formatarDataHora,
  formatarBytes,
  moeda,
} from '../../../../utils/inscricao'
import {
  buscarInscricao,
  listarDocumentosInscricao,
  deferirInscricao,
  indeferirInscricao,
  cancelarInscricao,
} from '../../../../services/inscricoes'

function Info({ rotulo, valor, mono }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <small className="muted">{rotulo}</small>
      <span className={mono ? 'mono' : undefined}>{valor ?? '—'}</span>
    </div>
  )
}

const MENSAGENS = {
  APROVAR: 'Inscrição deferida.',
  REJEITAR: 'Inscrição indeferida.',
  CANCELAR: 'Inscrição cancelada.',
}

export default function InscricaoDetalhePage() {
  const { id } = useParams()
  const [insc, setInsc] = useState(null)
  const [docs, setDocs] = useState([])
  const [erro, setErro] = useState('')
  const [erroDocs, setErroDocs] = useState('')
  const [dialogo, setDialogo] = useState(null)
  const [aviso, setAviso] = useState('')

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setInsc(await buscarInscricao(id))
    } catch (e) {
      setErro(e.message)
    }
    try {
      setDocs(await listarDocumentosInscricao(id))
      setErroDocs('')
    } catch (e) {
      setErroDocs(e.message)
      setDocs([])
    }
  }, [id])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 4000)
    return () => clearTimeout(t)
  }, [aviso])

  async function executar(motivo) {
    if (dialogo === 'APROVAR') await deferirInscricao(id)
    else if (dialogo === 'REJEITAR') await indeferirInscricao(id, motivo)
    else await cancelarInscricao(id, motivo)
    setAviso(MENSAGENS[dialogo])
    setDialogo(null)
    await carregar()
  }

  if (erro && !insc) {
    return (
      <>
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível carregar a inscrição: {erro}
          <button className="link-btn" onClick={carregar}>Tentar de novo</button>
        </div>
        <Link className="btn" href="/inscricoes" style={{ alignSelf: 'flex-start' }}>
          Voltar para a lista
        </Link>
      </>
    )
  }

  if (!insc) return <p className="muted">Carregando…</p>

  const alunoNome = insc.aluno?.usuario?.nome ?? 'Aluno'
  const cursoNome = insc.curso?.nome ?? 'Curso'
  const podeDeferir = insc.status === 'PENDENTE'
  const podeIndeferir = insc.status !== 'INDEFERIDO'
  const podeCancelar = insc.status !== 'CANCELADO'
  const renda = insc.rendaFamiliar

  return (
    <>
      <Link
        href="/inscricoes"
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 4 }}
      >
        <span className="mi" style={{ fontSize: 18 }}>arrow_back</span>
        Inscrições
      </Link>

      <div className="pagina-topo">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>{alunoNome}</h1>
            <SeloInscricao status={insc.status} />
          </div>
          <span className="muted">
            {cursoNome} · inscrito em {formatarData(insc.data)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {podeCancelar && (
            <button className="btn" onClick={() => setDialogo('CANCELAR')}>
              <span className="mi">block</span>
              Cancelar
            </button>
          )}
          {podeIndeferir && (
            <button
              className="btn"
              onClick={() => setDialogo('REJEITAR')}
              style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
            >
              <span className="mi">cancel</span>
              Indeferir
            </button>
          )}
          {podeDeferir && (
            <button className="btn primario m" onClick={() => setDialogo('APROVAR')}>
              <span className="mi">check_circle</span>
              Deferir
            </button>
          )}
        </div>
      </div>

      {aviso && (
        <div className="sucesso" role="status">
          <span className="mi">check_circle</span>
          {aviso}
        </div>
      )}

      <div className="graficos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card">
            <div className="card-topo"><h3>Aluno</h3></div>
            <div className="form-grade">
              <Info rotulo="E-mail" valor={insc.aluno?.usuario?.emailInstitucional} />
              <Info rotulo="Matrícula" valor={insc.aluno?.matricula} mono />
            </div>
          </section>

          <section className="card">
            <div className="card-topo"><h3>Curso</h3></div>
            <div className="form-grade">
              <Info rotulo="Curso" valor={cursoNome} />
              <Info rotulo="Vagas" valor={insc.curso?.vagas} mono />
            </div>
          </section>

          <section className="card">
            <div className="card-topo"><h3>Renda familiar</h3></div>
            {renda ? (
              <div className="form-grade">
                <Info rotulo="Renda mensal" valor={moeda(renda.rendaFamiliar)} mono />
                <Info rotulo="Pessoas na casa" valor={renda.numeroPessoas} mono />
                <Info
                  rotulo="Renda per capita"
                  valor={moeda(renda.rendaFamiliar / (renda.numeroPessoas || 1))}
                  mono
                />
              </div>
            ) : (
              <span className="muted">O aluno ainda não informou a renda familiar.</span>
            )}
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="card">
            <div className="card-topo"><h3>Documentos</h3></div>
            {erroDocs && (
              <div className="erro" role="alert">
                <span className="mi">error</span>
                Não foi possível carregar os documentos: {erroDocs}
              </div>
            )}
            {!erroDocs && docs.length === 0 && (
              <span className="muted">Nenhum documento enviado.</span>
            )}
            {docs.map((d) => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '8px 0',
                  borderTop: '1px solid var(--bd)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div className="forte" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {CATEGORIAS[d.categoria] ?? d.categoria}
                  </div>
                  <small className="mono muted">
                    {d.nomeOriginal} · {formatarBytes(d.tamanho)} · {formatarData(d.criadoEm)}
                  </small>
                </div>
                {/^https?:/.test(d.caminho ?? '') ? (
                  <a className="btn" href={d.caminho} target="_blank" rel="noreferrer" style={{ height: 32 }}>
                    Abrir
                  </a>
                ) : (
                  <span className="muted peq">Indisponível</span>
                )}
              </div>
            ))}
          </section>

          <section className="card">
            <div className="card-topo"><h3>Histórico</h3></div>
            {(insc.historico ?? []).length === 0 && (
              <span className="muted">Nenhuma alteração registrada.</span>
            )}
            {(insc.historico ?? []).map((h) => (
              <div
                key={h.id}
                style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 0', borderTop: '1px solid var(--bd)' }}
              >
                <span className="forte">
                  {ACAO_PARA_ROTULO[h.alteracao] ?? h.alteracao}
                  {' · '}
                  <span className="muted">
                    {STATUS_INSCRICAO[h.statusAnterior]?.rotulo ?? h.statusAnterior} →{' '}
                    {STATUS_INSCRICAO[h.statusAtual]?.rotulo ?? h.statusAtual}
                  </span>
                </span>
                {h.descricao && <span>{h.descricao}</span>}
                <small className="mono muted">
                  {h.usuario?.nome ?? '—'} · {formatarDataHora(h.dataModificacao)}
                </small>
              </div>
            ))}
          </section>
        </div>
      </div>

      {dialogo && (
        <AcaoInscricao
          acao={dialogo}
          aluno={alunoNome}
          curso={cursoNome}
          onConfirmar={executar}
          onFechar={() => setDialogo(null)}
        />
      )}
    </>
  )
}