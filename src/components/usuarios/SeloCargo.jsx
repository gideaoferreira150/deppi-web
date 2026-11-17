const ALTO = ['ADMIN', 'DEPPI']

export default function SeloCargo({ cargo }) {
  return <span className={'cargo-selo' + (ALTO.includes(cargo) ? ' alto' : '')}>{cargo}</span>
}