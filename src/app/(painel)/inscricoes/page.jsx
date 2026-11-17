'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import SeloInscricao from '../../../components/inscricoes/SeloInscricao'
import { semAcento } from '../../../utils/instituicao'
import { iniciais } from '../../../utils/professor'
import { ABAS, STATUS_INSCRICAO, formatarData } from '../../../utils/inscricao'
import { listarInscricoes } from '../../../services/inscricoes'

const POR_PAGINA = 10

export default function InscricoesPage() {
  const router = useRouter()
  const [lista, setLista] = useState(null)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('PENDENTE')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState('asc')
  const [pagina, setPagina] = useState(1)

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setLista(await listarInscricoes())
    } catch (e) {
      setErro(e.message)
      setLista((l) => l ?? [])
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const contagem = useMemo(() => {
    const c = { PENDENTE: 0, DEFERIDO: 0, INDEFERIDO: 0, CANCELADO: 0, TODAS: 0 }
    for (const i of lista ?? []) {
      c[i.status] = (c[i.status] ?? 0) + 1
      c.TODAS += 1
    }
    return c
  }, [lista])

  const filtradas = useMemo(() => {
    const q = semAcento(busca.trim())
    return (lista ?? [])
      .filter((i) => aba === 'TODAS' || i.status === aba)
      .filter(
        (i) =>
          !q ||
          [i.aluno?.usuario?.nome, i.curso?.nome].some((v) => semAcento(v ?? '').includes(q))
      )
      .sort((a, b) => {
        const d = new Date(a.data) - new Date(b.data)
        return ordem === 'asc' ? d : -d
      })
  }, [lista, aba, busca, ordem])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = filtradas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)
  const rotuloAba = aba === 'TODAS' ? 'inscrições' : STATUS_INSCRICAO[aba].plural

  return (
    <>
      <div className="pagina-topo">
        <div>
          <h1>Inscrições</h1>
          <span className="muted">Analise, defira ou indefira as inscrições dos alunos.</span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--bd)',
        }}
      >
        <div role="tablist" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ABAS.map(([chave, rotulo]) => {
            const ativa = aba === chave
            return (
              <button
                key={chave}
                type="button"
                role="tab"
                aria-selected={ativa}
                onClick={() => { setAba(chave); setPagina(1) }}
                style={{
                  background: 'none',
                  border: 0,
                  padding: '10px 10px',
                  font: 'inherit',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: -1,
                  color: ativa ? 'var(--tx)' : 'var(--tx2)',
                  borderBottom: ativa ? '2px solid var(--acc)' : '2px solid transparent',
                }}
              >
                {rotulo}
                <span
                  className="mono"
                  style={{
                    marginLeft: 8,
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 11,
                    background: ativa ? 'rgba(194,65,12,.12)' : 'var(--sur2)',
                    color: ativa ? 'var(--acc)' : 'var(--tx2)',
                  }}
                >
                  {contagem[chave].toLocaleString('pt-BR')}
                </span>
              </button>
            )
          })}
        </div>

        <div className="busca" style={{ minWidth: 260, marginBottom: 8 }}>
          <span className="mi">search</span>
          <input
            type="search"
            placeholder="Buscar aluno ou curso"
            aria-label="Buscar inscrições"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
          />
        </div>
      </div>

      {erro && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível carregar as inscrições: {erro}
          <button className="link-btn" onClick={carregar}>Tentar de novo</button>
        </div>
      )}

      {lista && (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>E-mail</th>
                <th>Matrícula</th>
                <th>Curso</th>
                <th>
                  <button
                    type="button"
                    onClick={() => setOrdem((o) => (o === 'asc' ? 'desc' : 'asc'))}
                    style={{
                      background: 'none',
                      border: 0,
                      padding: 0,
                      font: 'inherit',
                      color: 'inherit',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Data
                    <span className="mi" style={{ fontSize: 14 }}>
                      {ordem === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  </button>
                </th>
                <th>Status</th>
                <th aria-label="Abrir" />
              </tr>
            </thead>
            <tbody>
              {visiveis.map((i) => {
                const abrir = () => router.push(`/inscricoes/${i.id}`)
                return (
                  <tr
                    key={i.id}
                    tabIndex={0}
                    onClick={abrir}
                    onKeyDown={(e) => e.key === 'Enter' && abrir()}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                        <span className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                          {iniciais(i.aluno?.usuario?.nome)}
                        </span>
                        <span className="forte">{i.aluno?.usuario?.nome ?? '—'}</span>
                      </span>
                    </td>
                    <td
                      className="muted"
                      style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {i.aluno?.usuario?.emailInstitucional ?? '—'}
                    </td>
                    <td className="mono">{i.aluno?.matricula ?? '—'}</td>
                    <td>{i.curso?.nome ?? '—'}</td>
                    <td className="mono">{formatarData(i.data)}</td>
                    <td><SeloInscricao status={i.status} /></td>
                    <td className="acoes"><span className="mi muted">chevron_right</span></td>
                  </tr>
                )
              })}
              {visiveis.length === 0 && (
                <tr>
                  <td colSpan={7} className="tabela-vazia">
                    {busca
                      ? 'Nenhuma inscrição encontrada para essa busca.'
                      : `Nenhuma inscrição ${aba === 'TODAS' ? 'cadastrada' : rotuloAba}.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 16px',
              borderTop: '1px solid var(--bd)',
            }}
          >
            <span className="muted peq">
              Mostrando {visiveis.length} de {filtradas.length} {rotuloAba}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                className="icone-btn"
                aria-label="Página anterior"
                disabled={paginaAtual <= 1}
                onClick={() => setPagina(paginaAtual - 1)}
              >
                <span className="mi">chevron_left</span>
              </button>
              <span className="mono peq">{paginaAtual} / {totalPaginas}</span>
              <button
                type="button"
                className="icone-btn"
                aria-label="Próxima página"
                disabled={paginaAtual >= totalPaginas}
                onClick={() => setPagina(paginaAtual + 1)}
              >
                <span className="mi">chevron_right</span>
              </button>
            </span>
          </div>
        </div>
      )}
    </>
  )
}