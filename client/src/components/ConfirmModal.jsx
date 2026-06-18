export default function ConfirmModal({ titulo, mensaje, onConfirmar, onCancelar, tipo = 'danger' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '14px',
        width: '100%', maxWidth: '380px',
        padding: '24px', border: '0.5px solid #E2E8F0'
      }}>
        <div style={{
          width: '40px', height: '40px',
          background: tipo === 'danger' ? '#FEF2F2' : '#EEF2FF',
          borderRadius: '10px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', marginBottom: '14px'
        }}>
          {tipo === 'danger' ? '⚠️' : 'ℹ️'}
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B', margin: '0 0 6px' }}>
          {titulo}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px', lineHeight: '1.5' }}>
          {mensaje}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onCancelar}
            style={{
              flex: 1, padding: '10px',
              background: '#F0F4F8', color: '#475569',
              border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer'
            }}
          >Cancelar</button>
          <button
            onClick={onConfirmar}
            style={{
              flex: 1, padding: '10px',
              background: tipo === 'danger' ? '#EF4444' : '#6366F1',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer'
            }}
          >Confirmar</button>
        </div>
      </div>
    </div>
  )
}