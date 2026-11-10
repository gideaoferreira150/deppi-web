'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import FormCurso from '../../../components/cursos/FormCurso'
import { semAcento } from '../../../utils/instituicao'
import { STATUS, formatarData, formatarHora } from '../../../utils/curso'
import {
  listarCursos,
  criarCurso,
  atualizarCurso,
  listarInstituicoes,
} from '../../../services/api'

function Selo({ status }) {
  const s = STATUS[status] ?? { rotulo: status, cor: '#5C5C5C' }
  return (
    <span className="selo" style={{ color: s.cor, background: `${s.cor}1A` }}>
      {s.rotulo}
    </span>
  )
}

export default function CursosPage() {
  const { usuario } = useAuth()
  const podeCriar = usuario?.cargo === 'PROFESSOR'
  const podeAprovar = usuario?.cargo === 'DEPPI'

  const [lista, setLista] = useState(null)
  const [instituicoes, setInstituicoes] = useState([])
  const [erroInst, setErroInst] = useState('')
  const [erro, setErro] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [busca, setBusca] = useState('')
  const [dialogo, setDialogo] = useState(null)
  const [aviso, setAviso] = useState('')
  const [atualizando, setAtualizando] = useState(null)

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setLista(await listarCursos())
    } catch (e) {
      setErro(e.message)
      setLista((l) => l ?? [])
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  // as instituições só servem para o formulário de criação (professor)
  useEffect(() => {
    if (!podeCriar) return
    listarInstituicoes()
      .then((r) => setInstituicoes(Array.isArray(r) ? r : r?.data ?? []))
      .catch((e) => setErroInst(e.message))
  }, [podeCriar])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 4000)
    return () => clearTimeout(t)
  }, [aviso])

  const filtrados = useMemo(() => {
    if (!lista) return []
    const q = semAcento(busca.trim())
    if (!q) return lista
    return lista.filter((c) =>
      [c.nome, c.Instituicao?.nome, c.Instituicao?.campus].some((v) =>
        semAcento(v ?? '').includes(q)
      )
    )
  }, [lista, busca])

  const fechar = useCallback(() => setDialogo(null), [])

  async function salvar(dados) {
    await criarCurso(dados)
    setAviso('Curso enviado para análise.')
    setDialogo(null)
    await carregar()
  }

  async function mudarStatus(curso, status) {
    if (status === curso.status) return
    setErroAcao('')
    setAtualizando(curso.id)
    try {
      await atualizarCurso(curso.id, { status })
      setAviso('Status atualizado.')
      await carregar()
    } catch (e) {
      setErroAcao(e.message)
    } finally {
      setAtualizando(null)
    }
  }

  const total = lista?.length ?? 0

  return (
    <>
      <div className="pagina-topo">
        <div>
          <h1>Cursos</h1>
          <span className="muted">
            {lista
              ? `${total} ${total === 1 ? 'curso cadastrado' : 'cursos cadastrados'}`
              : 'Carregando…'}
          </span>
        </div>

        {podeCriar && (
          <button className="btn primario m" onClick={() => setDialogo({ tipo: 'form' })}>
            <span className="mi">add</span>
            Novo curso
          </button>
        )}
      </div>

      <div className="busca">
        <span className="mi">search</span>
        <input
          type="search"
          placeholder="Buscar por nome ou campus"
          aria-label="Buscar cursos"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {aviso && (
        <div className="sucesso" role="status">
          <span className="mi">check_circle</span>
          {aviso}
        </div>
      )}

      {erroAcao && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível alterar o status: {erroAcao}
        </div>
      )}

      {erroInst && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível carregar as instituições (necessárias para criar cursos): {erroInst}
        </div>
      )}

      {erro && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível carregar os cursos: {erro}
          <button className="link-btn" onClick={carregar}>Tentar de novo</button>
        </div>
      )}

      {lista && (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Campus</th>
                <th>Período</th>
                <th>Horário</th>
                <th>Carga</th>
                <th>Vagas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr key={c.id}>
                  <td className="forte">{c.nome}</td>
                  <td>{c.Instituicao?.campus ?? '—'}</td>
                  <td className="muted">
                    {formatarData(c.dataInicio)} – {formatarData(c.dataFim)}
                  </td>
                  <td className="mono">
                    {formatarHora(c.horarioInicio)}–{formatarHora(c.horarioFim)}
                  </td>
                  <td>{c.carga_horaria} h</td>
                  <td className="mono">{c.vagasOcupadas}/{c.vagas}</td>
                  <td>
                    {podeAprovar ? (
                      <select
                        aria-label={`Status de ${c.nome}`}
                        value={c.status}
                        disabled={atualizando === c.id}
                        onChange={(e) => mudarStatus(c, e.target.value)}
                        style={{ height: 32, width: 'auto', padding: '0 8px', fontSize: 13 }}
                      >
                        {Object.entries(STATUS).map(([valor, s]) => (
                          <option key={valor} value={valor}>{s.rotulo}</option>
                        ))}
                      </select>
                    ) : (
                      <Selo status={c.status} />
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="tabela-vazia">
                    {busca
                      ? 'Nenhum curso encontrado para essa busca.'
                      : 'Nenhum curso cadastrado ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {dialogo?.tipo === 'form' && (
        <FormCurso instituicoes={instituicoes} onSalvar={salvar} onFechar={fechar} />
      )}
    </>
  )
}