'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import ConcederCargo from '../../../components/usuarios/ConcederCargo'
import SeloCargo from '../../../components/usuarios/SeloCargo'
import { semAcento } from '../../../utils/instituicao'
import { formatarData } from '../../../utils/curso'
import {
  FILTROS_CARGO,
  POR_PAGINA,
  cargosDisponiveis,
  formatarNumero,
  iniciais,
  nomesDosCargos,
} from '../../../utils/usuario'
import { listarUsuarios, concederCargo } from '../../../services/api'

export default function UsuariosPage() {
  const [lista, setLista] = useState(null)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('')
  const [pagina, setPagina] = useState(1)
  const [dialogo, setDialogo] = useState(null)
  const [aviso, setAviso] = useState('')

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setLista(await listarUsuarios())
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

  const filtrados = useMemo(() => {
    if (!lista) return []
    const q = semAcento(busca.trim())
    return lista.filter((u) => {
      if (filtro && !nomesDosCargos(u).includes(filtro)) return false
      if (!q) return true
      return [u.nome, u.emailInstitucional].some((v) => semAcento(v ?? '').includes(q))
    })
  }, [lista, busca, filtro])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  const fechar = useCallback(() => setDialogo(null), [])

  async function conceder(cargo) {
    const { usuario } = dialogo
    await concederCargo(usuario.id, cargo)
    setDialogo(null)
    setAviso(`Cargo ${cargo} concedido a ${usuario.nome}.`)
    await carregar()
  }

  const total = lista?.length ?? 0

  return (
    <>
      <div className="pagina-topo">
        <div>
          <h1>Usuários</h1>
          <span className="muted">
            {lista
              ? `${formatarNumero(total)} ${total === 1 ? 'usuário' : 'usuários'}`
              : 'Carregando…'}
          </span>
        </div>
      </div>

      <div className="filtros">
        <div className="busca">
          <span className="mi">search</span>
          <input
            type="search"
            placeholder="Buscar por nome ou e-mail"
            aria-label="Buscar usuários"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
          />
        </div>

        <div className="filtro-select">
          <select
            aria-label="Filtrar por cargo"
            value={filtro}
            onChange={(e) => { setFiltro(e.target.value); setPagina(1) }}
          >
            {FILTROS_CARGO.map((f) => (
              <option key={f.valor} value={f.valor}>Cargo: {f.rotulo}</option>
            ))}
          </select>
          <span className="mi">expand_more</span>
        </div>
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
          Não foi possível carregar os usuários: {erro}
          <button className="link-btn" onClick={carregar}>Tentar de novo</button>
        </div>
      )}

      {lista && (
        <div className="tabela-wrap">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargos</th>
                <th>Criado em</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {visiveis.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="usuario-cel">
                      <span className="avatar p" aria-hidden="true">{iniciais(u.nome)}</span>
                      <span className="forte">{u.nome}</span>
                    </div>
                  </td>
                  <td className="muted">{u.emailInstitucional}</td>
                  <td>
                    <div className="cargos-cel">
                      {nomesDosCargos(u).map((c) => <SeloCargo key={c} cargo={c} />)}
                    </div>
                  </td>
                  <td className="mono">{formatarData(u.criadoEm)}</td>
                  <td className="acoes">
                    {cargosDisponiveis(u).length > 0 && (
                      <button
                        className="btn linha"
                        aria-label={`Conceder cargo a ${u.nome}`}
                        onClick={() => setDialogo({ usuario: u })}
                      >
                        <span className="mi">shield_person</span>
                        Conceder cargo
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {visiveis.length === 0 && (
                <tr>
                  <td colSpan={5} className="tabela-vazia">
                    {busca || filtro
                      ? 'Nenhum usuário encontrado para essa busca.'
                      : 'Nenhum usuário cadastrado ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="tabela-rodape">
            <span>
              Mostrando {formatarNumero(visiveis.length)} de {formatarNumero(filtrados.length)}
            </span>
            <div className="paginacao">
              <button
                className="icone-btn"
                aria-label="Página anterior"
                disabled={paginaAtual <= 1}
                onClick={() => setPagina(paginaAtual - 1)}
              >
                <span className="mi">chevron_left</span>
              </button>
              <span className="mono" aria-live="polite">
                {paginaAtual} / {formatarNumero(totalPaginas)}
              </span>
              <button
                className="icone-btn"
                aria-label="Próxima página"
                disabled={paginaAtual >= totalPaginas}
                onClick={() => setPagina(paginaAtual + 1)}
              >
                <span className="mi">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {dialogo && (
        <ConcederCargo usuario={dialogo.usuario} onConfirmar={conceder} onFechar={fechar} />
      )}
    </>
  )
}