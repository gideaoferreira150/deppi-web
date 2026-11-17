export default function Campo({ rotulo, opcional, erro, ajuda, children }) {
  return (
    <label className={'campo' + (erro ? ' invalido' : '')}>
      <span>
        {rotulo}
        {opcional && <span className="muted"> (opcional)</span>}
      </span>
      <span className="campo-input">
        {children}
        {erro && <span className="mi campo-alerta">error</span>}
      </span>
      {erro ? (
        <small className="campo-erro" role="alert">{erro}</small>
      ) : (
        ajuda && <small className="campo-ajuda">{ajuda}</small>
      )}
    </label>
  )
}