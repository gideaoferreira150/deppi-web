'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import AbaFuncionais from '../../../../components/professores/AbaFuncionais'
import AbaConta from '../../../../components/professores/AbaConta'
import ConfirmarExclusaoProfessor from '../../../../components/professores/ConfirmarExclusaoProfessor'
import { buscarProfessor, excluirProfessor } from '../../../../services/professores'

const ABAS = [
  ['funcionais', 'Dados funcionais'],
  ['conta', 'Dados de conta'],
]

export default function ProfessorDetalhePage() {
  const { id } = useParams()
  const router = useRouter()

  const [prof, setProf] = useState(null)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('funcionais')
  const [aviso, setAviso] = useState('')
  const [excluindo, setExcluindo] = useState(false)

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setProf(await buscarProfessor(id))
    } catch (e) {
      setErro(e.message)
    }
  }, [id])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 4000)
    return () => clearTimeout(t)
  }, [aviso])

  async function salvo(mensagem) {
    setAviso(mensagem)
    await carregar()
  }

  async function excluir() {
    await excluirProfessor(id)
    router.push('/professores')
  }

  if (erro && !prof) {
    return (
      <>
        <div className="erro" role="alert">
          <span className="mi">error</span>
          Não foi possível carregar o professor: {erro}
          <button className="link-btn" onClick={carregar}>Tentar de novo</button>
        </div>
        <Link className="btn" href="/professores" style={{ alignSelf: 'flex-start' }}>
          Voltar para a lista
        </Link>
      </>
    )
  }

  if (!prof) return <p className="muted">Carregando…</p>

  return (
    <>
      <div className="pagina-topo">
        <div>
          <span className="mono muted peq">SIAPE {prof.siape}</span>
          <h1 style={{ marginTop: 6 }}>{prof.usuario?.nome ?? 'Professor'}</h1>
        </div>
        <button
          className="btn"
          onClick={() => setExcluindo(true)}
          style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
        >
          <span className="mi">delete</span>
          Excluir
        </button>
      </div>

      <div
        role="tablist"
        style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--bd)' }}
      >
        {ABAS.map(([chave, rotulo]) => (
          <button
            key={chave}
            type="button"
            role="tab"
            aria-selected={aba === chave}
            onClick={() => setAba(chave)}
            style={{
              background: 'none',
              border: 0,
              padding: '10px 12px',
              font: 'inherit',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: -1,
              color: aba === chave ? 'var(--tx)' : 'var(--tx2)',
              borderBottom: aba === chave ? '2px solid var(--tx)' : '2px solid transparent',
            }}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {aviso && (
        <div className="sucesso" role="status">
          <span className="mi">check_circle</span>
          {aviso}
        </div>
      )}

      <div hidden={aba !== 'funcionais'}>
        <AbaFuncionais prof={prof} onSalvo={salvo} />
      </div>
      <div hidden={aba !== 'conta'}>
        <AbaConta prof={prof} onSalvo={salvo} />
      </div>

      {excluindo && (
        <ConfirmarExclusaoProfessor
          nome={prof.usuario?.nome ?? 'este professor'}
          onConfirmar={excluir}
          onFechar={() => setExcluindo(false)}
        />
      )}
    </>
  )
}