export const CARGOS = ['ALUNO', 'PROFESSOR', 'DEPPI', 'ADMIN']

export const TELAS = [
  { path: '/inicio',           label: 'Início',            icon: 'home',       cargos: ['ALUNO', 'PROFESSOR', 'DEPPI', 'ADMIN'] },
  { path: '/cursos',           label: 'Cursos',            icon: 'school',     cargos: ['ALUNO', 'PROFESSOR', 'DEPPI', 'ADMIN'] },
  { path: '/inscricoes',       label: 'Inscrições',        icon: 'assignment', cargos: ['DEPPI'] },
  { path: '/professores',      label: 'Professores',       icon: 'badge',      cargos: ['DEPPI'] },
  { path: '/minhas-inscricoes',label: 'Minhas inscrições', icon: 'assignment', cargos: ['ALUNO'] },
  { path: '/instituicoes',     label: 'Instituições',      icon: 'apartment',  cargos: ['ADMIN'] },
  { path: '/usuarios',         label: 'Usuários',          icon: 'group',      cargos: ['ADMIN'] },
  { path: '/relatorios',       label: 'Relatórios',        icon: 'bar_chart',  cargos: ['ADMIN'] },
  { path: '/perfil',           label: 'Perfil',            icon: 'person',     cargos: ['ALUNO', 'PROFESSOR', 'DEPPI', 'ADMIN'] }
]
export const menuDoCargo = (cargo) => TELAS.filter((t) => t.cargos.includes(cargo))
