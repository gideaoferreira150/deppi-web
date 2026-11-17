'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { semAcento } from '../../../utils/instituicao'
import { listarProfessores } from '../../../services/professores'

const iniciais = (nome = '') =>
  nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

const selectEstilo = {
  height: 44,
  width: 'auto',
  minWidth: 200,
  padding: '0 12px',
  border: '1px solid var(--bd2)',
  borderRadius: 8,
  background: '#fff',
  font: 'inherit',
}

export default function ProfessoresPage() {
  const router = useRouter()
  const [lista, setLista] = useState(null)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [titulacao, setTitulacao] = useState('')

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setLista(await listarProfessores())
    } catch (e) {
      setErro(e.message)
      setLista((l) => l ?? [])
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const titulacoes = useMemo(
    () => [...new Set((lista ?? []).map((p) => p.titulacao).filter(Boolean))].sort(),
    [lista]
  )

  const filtrados = useMemo(() => {
    if (!lista) return []
    const q = semAcento(busca.trim())
    return lista
      .filter((p) => {
        if (titulacao && p.titulacao !== titulacao) return false
        if (!q) return true
        return [p.usuario?.nome, p.siape].some((v) => semAcento(v ?? '').includes(q))
      })
      .sort((a, b) =>
        (a.usuario?.nome ?? '').localeCompare(b.usuario?.nome ?? '', 'pt-BR')
      )
  }, [lista, busca, titulacao])

  const total = lista?.length ?? 0

  return (
    <>
      <div className="pagina-topo">
        <div>
          <h1>Professores</h1>
          <span className="muted">
            {lista
              ? `${total} ${total === 1 ? 'professor' : 'professores'}`
              : 'Carregando…'}
          </span>
        </div>

        <Link className="btn primario m" href="/professores/novo">
          <span className="mi">person_add</span>
          Novo professor
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div className="busca" style={{ flex: 1 }}>
          <span className="mi">search</span>
          <input
            type="search"
            placeholder="Buscar por nome ou SIAPE"
            aria-label="Buscar professores"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <select
          aria-label="Filtrar por titulação"
          value={titulacao}
          onChange={(e) => setTitulacao(e.target.value)}
          style={selectEstilo}
        >
          <option value="">Titulação: Todas</option>
          {titulacoes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {erro && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível carregar os professores: {erro}
          <button className="link-btn" onClick={carregar}>Tentar de novo</button>
        </div>
      )}

      {lista && (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>SIAPE</th>
                <th>E-mail institucional</th>
                <th>Titulação</th>
                <th>PGD</th>
                <th aria-label="Abrir" />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => {
                const abrir = () => router.push(`/professores/${p.id}`)
                return (
                  <tr
                    key={p.id}
                    tabIndex={0}
                    onClick={abrir}
                    onKeyDown={(e) => e.key === 'Enter' && abrir()}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                        <span className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                          {iniciais(p.usuario?.nome)}
                        </span>
                        <span className="forte">{p.usuario?.nome ?? '—'}</span>
                      </span>
                    </td>
                    <td className="mono">{p.siape}</td>
                    <td className="muted">{p.usuario?.emailInstitucional ?? '—'}</td>
                    <td>{p.titulacao ?? '—'}</td>
                    <td>
                      {p.emPGD ? (
                        <span style={{ color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span className="mi" style={{ fontSize: 16 }}>check_circle</span>
                          Sim
                        </span>
                      ) : (
                        <span className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span className="mi" style={{ fontSize: 16 }}>remove</span>
                          Não
                        </span>
                      )}
                    </td>
                    <td className="acoes">
                      <span className="mi muted">chevron_right</span>
                    </td>
                  </tr>
                )
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="tabela-vazia">
                    {busca || titulacao
                      ? 'Nenhum professor encontrado para esse filtro.'
                      : 'Nenhum professor cadastrado ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
