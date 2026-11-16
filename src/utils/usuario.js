export const CARGOS_CONCEDIVEIS = [
  { valor: 'DEPPI', descricao: 'Analisa inscrições e gerencia cursos e professores.' },
  { valor: 'ADMIN', descricao: 'Gerencia instituições, usuários e relatórios.' },
]

export const FILTROS_CARGO = [
  { valor: '', rotulo: 'Todos' },
  { valor: 'ALUNO', rotulo: 'Aluno' },
  { valor: 'PROFESSOR', rotulo: 'Professor' },
  { valor: 'DEPPI', rotulo: 'DEPPI' },
  { valor: 'ADMIN', rotulo: 'Admin' },
]

export const POR_PAGINA = 8

export const nomesDosCargos = (u) => (u.cargos ?? []).map((c) => c.cargo)

export const cargosDisponiveis = (u) => {
  const atuais = nomesDosCargos(u)
  return CARGOS_CONCEDIVEIS.filter((c) => !atuais.includes(c.valor))
}

export const iniciais = (nome = '') =>
  nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

export const formatarNumero = (n) => Number(n).toLocaleString('pt-BR')