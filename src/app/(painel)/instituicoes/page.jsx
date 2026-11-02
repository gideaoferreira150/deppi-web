'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import FormInstituicao from '../../../components/instituicoes/FormInstituicao'
import ConfirmarExclusao from '../../../components/instituicoes/ConfirmarExclusao'
import { cidadeComUf, semAcento } from '../../../utils/instituicao'
import {
  listarInstituicoes,
  criarInstituicao,
  atualizarInstituicao,
  excluirInstituicao,
} from '../../../services/api'

export default function InstituicoesPage() {
  const [lista, setLista] = useState(null)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [dialogo, setDialogo] = useState(null)
  const [aviso, setAviso] = useState('')

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setLista(await listarInstituicoes())
    } catch (e) {
      setErro(e.message)
      setLista((l) => l ?? [])
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 4000)
    return () => clearTimeout(t)
  }, [aviso])

  const filtradas = useMemo(() => {
    if (!lista) return []
    const q = semAcento(busca.trim())
    if (!q) return lista
    return lista.filter((i) =>
      [i.nome, i.campus, i.cidade].some((v) => semAcento(v).includes(q))
    )
  }, [lista, busca])

  const fechar = useCallback(() => setDialogo(null), [])

  async function salvar(dados) {
    if (dialogo.inst) {
      await atualizarInstituicao(dialogo.inst.id, dados)
      setAviso('Instituição atualizada.')
    } else {
      await criarInstituicao(dados)
      setAviso('Instituição cadastrada.')
    }
    setDialogo(null)
    await carregar()
  }

  async function excluir() {
    await excluirInstituicao(dialogo.inst.id)
    setDialogo(null)
    setAviso('Instituição excluída.')
    await carregar()
  }

  const total = lista?.length ?? 0

  return (
    <>
      <div className="pagina-topo">
        <div>
          <h1>Instituições</h1>
          <span className="muted">
            {lista
              ? `${total} ${total === 1 ? 'instituição cadastrada' : 'instituições cadastradas'}`
              : 'Carregando…'}
          </span>
        </div>

        <button className="btn primario m" onClick={() => setDialogo({ tipo: 'form' })}>
          <span className="mi">add</span>
          Nova instituição
        </button>
      </div>

      <div className="busca">
        <span className="mi">search</span>
        <input
          type="search"
          placeholder="Buscar por nome, campus ou cidade"
          aria-label="Buscar instituições"
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

      {erro && (
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível carregar as instituições: {erro}
          <button className="link-btn" onClick={carregar}>Tentar de novo</button>
        </div>
      )}

      {lista && (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Campus</th>
                <th>Cidade</th>
                <th>CNPJ</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {filtradas.map((i) => (
                <tr key={i.id}>
                  <td className="forte">{i.nome}</td>
                  <td>{i.campus}</td>
                  <td className="muted">{cidadeComUf(i.cidade)}</td>
                  <td className="mono">{i.cnpj}</td>
                  <td className="acoes">
                    <button
                      className="icone-btn"
                      aria-label={`Editar ${i.nome} · ${i.campus}`}
                      onClick={() => setDialogo({ tipo: 'form', inst: i })}
                    >
                      <span className="mi">edit</span>
                    </button>
                    <button
                      className="icone-btn perigo"
                      aria-label={`Excluir ${i.nome} · ${i.campus}`}
                      onClick={() => setDialogo({ tipo: 'excluir', inst: i })}
                    >
                      <span className="mi">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={5} className="tabela-vazia">
                    {busca
                      ? 'Nenhuma instituição encontrada para essa busca.'
                      : 'Nenhuma instituição cadastrada ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {dialogo?.tipo === 'form' && (
        <FormInstituicao inicial={dialogo.inst} onSalvar={salvar} onFechar={fechar} />
      )}
      {dialogo?.tipo === 'excluir' && (
        <ConfirmarExclusao inst={dialogo.inst} onConfirmar={excluir} onFechar={fechar} />
      )}
    </>
  )
}