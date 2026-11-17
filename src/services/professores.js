import { request } from './api'

const BASE = '/professores'

export const listarProfessores = async () => {
  const r = await request(BASE)
  return Array.isArray(r) ? r : r?.data ?? []
}

export const buscarProfessor = (id) => request(`${BASE}/${id}`)

export const criarProfessor = (dados) =>
  request(BASE, { method: 'POST', body: dados })

export const atualizarProfessor = (id, dados) =>
  request(`${BASE}/${id}`, { method: 'PUT', body: dados })

export const atualizarContaProfessor = (id, dados) =>
  request(`${BASE}/${id}/conta`, { method: 'PUT', body: dados })

export const excluirProfessor = (id) =>
  request(`${BASE}/${id}`, { method: 'DELETE' })
