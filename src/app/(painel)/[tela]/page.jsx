'use client'

import { usePathname, notFound } from 'next/navigation'
import { TELAS } from '../../../permissoes'
import EmConstrucao from '../../../components/EmConstrucao'

export default function TelaPendente() {
  const pathname = usePathname()
  const tela = TELAS.find((t) => t.path === pathname)

  if (!tela) notFound()

  return <EmConstrucao titulo={tela.label} />
}