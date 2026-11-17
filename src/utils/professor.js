export const TITULACOES = ['Graduação', 'Especialização', 'Mestrado', 'Doutorado']
export const ESCOLARIDADES = ['Graduação', 'Pós-graduação']

export const iniciais = (nome = '') =>
  nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

export function mascaraTelefone(valor = '') {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function validarNovoProfessor(f) {
  const e = {}
  if (!UUID.test(f.fkUsuario.trim())) e.fkUsuario = 'Informe o ID (UUID) de um usuário já cadastrado.'
  if (!f.siape.trim()) e.siape = 'Informe o SIAPE.'
  if (f.emailSiape.trim() && !EMAIL.test(f.emailSiape.trim())) e.emailSiape = 'E-mail SIAPE inválido.'
  return e
}

export function validarDadosFuncionais(f) {
  const e = {}
  if (!f.siape.trim()) e.siape = 'Informe o SIAPE.'
  if (f.emailSiape.trim() && !EMAIL.test(f.emailSiape.trim())) e.emailSiape = 'E-mail SIAPE inválido.'
  return e
}

export function validarDadosConta(f) {
  const e = {}
  if (f.nomeUsual.trim().length < 3) e.nomeUsual = 'O nome usual deve ter no mínimo 3 caracteres.'
  if (!EMAIL.test(f.emailInstitucional.trim())) e.emailInstitucional = 'E-mail institucional inválido.'
  if (!EMAIL.test(f.emailSecundario.trim())) e.emailSecundario = 'Informe um e-mail secundário válido.'
  for (const k of ['emailSiape', 'emailNotificacoes', 'emailClassroom']) {
    if (f[k].trim() && !EMAIL.test(f[k].trim())) e[k] = 'E-mail inválido.'
  }
  return e
}