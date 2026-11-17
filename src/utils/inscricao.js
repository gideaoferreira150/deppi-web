export const STATUS_INSCRICAO = {
  PENDENTE: { rotulo: 'Pendente', plural: 'pendentes', icone: 'schedule', cor: '#B45309' },
  DEFERIDO: { rotulo: 'Deferida', plural: 'deferidas', icone: 'check_circle', cor: '#15803D' },
  INDEFERIDO: { rotulo: 'Indeferida', plural: 'indeferidas', icone: 'cancel', cor: '#B91C1C' },
  CANCELADO: { rotulo: 'Cancelada', plural: 'canceladas', icone: 'block', cor: '#5C5C5C' },
}

export const ABAS = [
  ['PENDENTE', 'Pendentes'],
  ['DEFERIDO', 'Deferidas'],
  ['INDEFERIDO', 'Indeferidas'],
  ['CANCELADO', 'Canceladas'],
  ['TODAS', 'Todas'],
]

export const CATEGORIAS = {
  RG: 'RG',
  CPF: 'CPF',
  COMPROVANTE_RESIDENCIA: 'Comprovante de residência',
  COMPROVANTE_RENDA: 'Comprovante de renda',
  HISTORICO_ESCOLAR: 'Histórico escolar',
  OUTRO: 'Outro',
}

export const ACAO_PARA_ROTULO = {
  APROVAR: 'Deferida',
  REJEITAR: 'Indeferida',
  CANCELAR: 'Cancelada',
}

export function formatarData(v) {
  if (!v) return '—'
  return new Date(v).toLocaleDateString('pt-BR')
}

export function formatarDataHora(v) {
  if (!v) return '—'
  const d = new Date(v)
  return `${d.toLocaleDateString('pt-BR')} · ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

export function formatarBytes(n) {
  if (n === null || n === undefined) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

export const moeda = (n) =>
  Number(n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })