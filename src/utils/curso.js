export const STATUS = {
  ANALISE: { rotulo: 'Em análise', cor: '#B45309' },
  ANDAMENTO: { rotulo: 'Em andamento', cor: '#15803D' },
  CONCLUIDO: { rotulo: 'Concluído', cor: '#1D4ED8' },
  FECHADO: { rotulo: 'Fechado', cor: '#5C5C5C' },
}

// A API devolve ISO ("2026-11-10T00:00:00.000Z"). Cortamos o texto em vez de
// usar new Date(), para o fuso do navegador não mostrar o dia anterior.
export const dataParaInput = (v) => (v ? String(v).slice(0, 10) : '')
export const horaParaInput = (v) => (v ? String(v).slice(11, 16) : '')

export const dataParaApi = (d) => `${d}T00:00:00.000Z`
export const horaParaApi = (h) => `1970-01-01T${h}:00.000Z`

export function formatarData(v) {
  if (!v) return '—'
  const [a, m, d] = String(v).slice(0, 10).split('-')
  return `${d}/${m}/${a}`
}

export const formatarHora = (v) => horaParaInput(v) || '—'

export function validarCurso(f) {
  const e = {}
  const ch = Number(f.carga_horaria)
  const vg = Number(f.vagas)

  if (!f.nome.trim()) e.nome = 'Informe o nome do curso.'
  if (!f.fkInstituicao) e.fkInstituicao = 'Selecione a instituição.'
  if (!Number.isInteger(ch) || ch <= 0) e.carga_horaria = 'Informe uma carga horária inteira maior que zero.'
  if (!Number.isInteger(vg) || vg < 1) e.vagas = 'O curso precisa de pelo menos 1 vaga.'
  if (!f.dataInicio) e.dataInicio = 'Informe a data de início.'
  if (!f.dataFim) e.dataFim = 'Informe a data de término.'
  else if (f.dataInicio && f.dataFim < f.dataInicio) e.dataFim = 'O término não pode ser antes do início.'
  if (!f.horarioInicio) e.horarioInicio = 'Informe o horário de início.'
  if (!f.horarioFim) e.horarioFim = 'Informe o horário de término.'
  else if (f.horarioInicio && f.horarioFim <= f.horarioInicio) e.horarioFim = 'O horário final deve ser depois do inicial.'
  return e
}