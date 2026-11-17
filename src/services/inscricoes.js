import { request } from './api'

const BASE = '/inscricoes'

export const listarInscricoes = async () => {
  const r = await request(BASE)
  return r?.inscricoes ?? []
}

export const buscarInscricao = async (id) => {
  const r = await request(`${BASE}/${id}`)
  return r.inscricao
}

export const listarDocumentosInscricao = async (id) => {
  const r = await request(`${BASE}/${id}/documentos`)
  return r?.documentos ?? []
}

export const deferirInscricao = (id) =>
  request(`${BASE}/${id}/aprovar`, { method: 'PATCH' })

// o back lê o corpo com Zod: sem objeto, devolve 400. Por isso sempre vai {}
export const indeferirInscricao = (id, motivo) =>
  request(`${BASE}/${id}/rejeitar`, { method: 'PATCH', body: motivo ? { motivo } : {} })

export const cancelarInscricao = (id, motivo) =>
  request(`${BASE}/${id}/cancelar`, { method: 'PATCH', body: motivo ? { motivo } : {} })