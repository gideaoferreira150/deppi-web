const BASE = (import.meta.env.VITE_API_URL || 'https://deppi-api-3i98.onrender.com').replace(/\/$/, '')

export const ROTAS = {
  login: '/auth/login',
  resumo: '/admin/dashboard/summary'
}

const TOKEN_KEY = 'deppi.token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.mensagem || data.message || data.erro || data.error || `Erro ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

function lerJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) } catch { return {} }
}

export async function login(email, senha) {
  const d = await request(ROTAS.login, { method: 'POST', body: { email, senha } })
  const token = d.token || d.accessToken || d.access_token
  const u = d.usuario || d.user || {}
  const jwt = lerJwt(token || '')
  const ORDEM = ['ADMIN', 'DEPPI', 'PROFESSOR', 'ALUNO']
  const texto = JSON.stringify({ d, jwt }).toUpperCase()
  const cargo = ORDEM.find((c) => texto.includes(`"${c}"`)) || ''
  return { token, usuario: { nome: u.nome || u.name || jwt.nome || email, email, cargo } }
}

const letras = (s) => String(s).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z]/g, '')

function agrupar(porStatus = {}, regras) {
  const r = Object.fromEntries(Object.keys(regras).map((k) => [k, 0]))
  for (const [status, qtd] of Object.entries(porStatus)) {
    const s = letras(status)
    const chave = Object.keys(regras).find((k) => regras[k].some((p) => s.startsWith(p)))
    if (chave) r[chave] += Number(qtd) || 0
  }
  return r
}

export async function buscarResumo() {
  const [d, al, pr] = await Promise.all([
    request(ROTAS.resumo),
    request(`${ROTAS.resumo}?cargos=ALUNO`).catch(() => null),
    request(`${ROTAS.resumo}?cargos=PROFESSOR`).catch(() => null)
  ])
  const n = (v) => Number(v) || 0
  return {
    totais: {
      Usuários: n(d.usuarios?.total),
      Alunos: n(al?.usuarios?.filtroCargos),
      Professores: n(pr?.usuarios?.filtroCargos),
      Cursos: n(d.cursos?.total),
      Inscrições: n(d.inscricoes?.total),
      Instituições: n(d.instituicoes?.total),
      'Vagas restantes': n(d.cursos?.vagas?.vagasRestantes)
    },
    inscricoes: agrupar(d.inscricoes?.porStatus, {
      PENDENTE: ['PEND'], DEFERIDA: ['DEFER'], INDEFERIDA: ['INDEFER'], CANCELADA: ['CANCEL']
    }),
    cursos: agrupar(d.cursos?.porStatus, {
      EM_ANALISE: ['EMANALISE', 'ANALISE'], EM_ANDAMENTO: ['EMANDAMENTO', 'ANDAMENTO'],
      CONCLUIDO: ['CONCLU'], FECHADO: ['FECH']
    })
  }
}