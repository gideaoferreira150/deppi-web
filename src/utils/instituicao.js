const UF_PADRAO = 'CE'

export const cidadeComUf = (c = '') => (c.includes('/') ? c : `${c}/${UF_PADRAO}`)

export const semAcento = (t = '') =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function mascaraCnpj(valor = '') {
  const d = valor.replace(/\D/g, '').slice(0, 14)
  let r = d.slice(0, 2)
  if (d.length > 2) r += '.' + d.slice(2, 5)
  if (d.length > 5) r += '.' + d.slice(5, 8)
  if (d.length > 8) r += '/' + d.slice(8, 12)
  if (d.length > 12) r += '-' + d.slice(12, 14)
  return r
}

export function validarInstituicao(f) {
  const e = {}
  if (!f.nome.trim()) e.nome = 'Informe o nome da instituição.'
  if (!f.campus.trim()) e.campus = 'Informe o campus.'
  if (!f.cidade.trim()) e.cidade = 'Informe a cidade.'
  const digitos = f.cnpj.replace(/\D/g, '').length
  if (digitos === 0) e.cnpj = 'Informe o CNPJ.'
  else if (digitos < 14) e.cnpj = 'CNPJ incompleto — informe os 14 dígitos.'
  return e
}