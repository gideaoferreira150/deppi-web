const BASE = '/api-proxy'

export const ROTAS = {
  login: '/auth/login',
  resumo: '/admin/relatorios/resumo',
  instituicoes: '/instituicao',
}
const TOKEN_KEY = 'deppi.token'

export const getToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem(TOKEN_KEY)
    : null

export const setToken = (token) =>
  localStorage.setItem(TOKEN_KEY, token)

export const clearToken = () =>
  localStorage.removeItem(TOKEN_KEY)

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(
      data.mensagem ||
      data.message ||
      data.erro ||
      data.error ||
      `Erro ${res.status}`
    )

    err.status = res.status
    throw err
  }

  return data
}

function lerJwt(token) {
  try {
    return JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    )
  } catch {
    return {}
  }
}

export async function login(email, senha) {
  const d = await request(ROTAS.login, {
    method: 'POST',
    body: { email, senha },
  })

  const token = d.token || d.accessToken || d.access_token
  const u = d.usuario || d.user || {}
  const jwt = lerJwt(token || '')

  const ORDEM = ['ADMIN', 'DEPPI', 'PROFESSOR', 'ALUNO']
  const texto = JSON.stringify({ d, jwt }).toUpperCase()
  const cargo = ORDEM.find((c) => texto.includes(`"${c}"`)) || ''

  return {
    token,
    usuario: {
      nome: u.nome || u.name || jwt.nome || email,
      email,
      cargo,
    },
  }
}
export async function buscarResumo() {
  const resposta = await request(ROTAS.resumo)
  const resumo = resposta.resumo

  const totais = resumo.totais

  return {
    totais: {
      'Usuários': totais.usuarios,
      'Alunos': totais.alunos,
      'Professores': totais.professores,
      'Cursos': totais.cursos,
      'Inscrições': totais.inscricoes,
      'Instituições': totais.instituicoes,
      'Vagas restantes': totais.vagasRestantes,
    },

    inscricoes: Object.fromEntries(
      resumo.inscricoesPorSituacao.map(item => [
        item.status,
        item.quantidade
      ])
    ),

    cursos: Object.fromEntries(
      resumo.cursosPorSituacao.map(item => [
        item.status,
        item.quantidade
      ])
    ),
  }
}

export const listarInstituicoes = () =>
  request(ROTAS.instituicoes)

export const criarInstituicao = (dados) =>
  request(`${ROTAS.instituicoes}/cadastrar`, { method: 'POST', body: dados })

export const atualizarInstituicao = (id, dados) =>
  request(`${ROTAS.instituicoes}/atualizar`, { method: 'PUT', body: { id, ...dados } })

export const excluirInstituicao = (id) =>
  request(`${ROTAS.instituicoes}/excluir`, { method: 'DELETE', body: { id } })