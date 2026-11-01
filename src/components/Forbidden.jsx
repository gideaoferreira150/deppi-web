'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Forbidden() {
  const { usuario } = useAuth()

  return (
    <div className="vazio">
      <span className="mi grande">lock</span>
      <h1>403 · Acesso negado</h1>
      <p>Seu cargo ({usuario?.cargo}) não tem permissão para acessar esta página.</p>
      <Link className="btn primario" href="/inicio">Voltar ao início</Link>
    </div>
  )
}