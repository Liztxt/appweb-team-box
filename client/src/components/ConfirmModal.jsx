export default function ConfirmModal({ titulo, mensaje, onConfirmar, onCancelar, tipo = 'danger' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '380px',
        padding: '24px', border: '1px solid var(--color-border)',
        fontFamily: 'var(--font-body)'
      }}>
        <div style={{
          width: '40px', height: '40px',
          background: tipo === 'danger' ? 'var(--color-error-bg)' : 'var(--color-primary-light)',
          borderRadius: 'var(--radius-sm)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: '14px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: tipo === 'danger' ? 'var(--color-error)' : 'var(--color-primary-dark)' }}>
            {tipo === 'danger' ? 'warning' : 'info'}
          </span>
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 6px' }}>
          {titulo}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '0 0 20px', lineHeight: '1.5' }}>
          {mensaje}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCancelar}
            style={{
              flex: 1, padding: '10px',
              background: 'var(--color-bg)', color: 'var(--color-text-secondary)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'var(--font-body)'
            }}
          >Cancelar</button>
          <button
            onClick={onConfirmar}
            style={{
              flex: 1, padding: '10px',
              background: tipo === 'danger' ? 'var(--color-error)' : 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'var(--font-body)'
            }}
          >Confirmar</button>
        </div>
      </div>
    </div>
  )
}