import { useEffect, useState } from 'react'

export default function Toast({ mensaje, tipo = 'exito', onClose }) {
  const [visible, setVisible] = useState(true)
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaliendo(true)
      setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  const esError = tipo === 'error'

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(120%); opacity: 0; }
        }
        @keyframes vibrar {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .toast-enter { animation: slideIn 0.3s ease forwards; }
        .toast-exit { animation: slideOut 0.3s ease forwards; }
        .toast-vibrar { animation: slideIn 0.3s ease forwards, vibrar 0.4s ease 0.3s; }
      `}</style>
      <div
        className={saliendo ? 'toast-exit' : esError ? 'toast-vibrar' : 'toast-enter'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: esError ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
          border: `1px solid ${esError ? 'var(--color-error-bg)' : 'var(--color-success-bg)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: 'var(--shadow-md)',
          maxWidth: '320px',
          minWidth: '220px',
          fontFamily: 'var(--font-body)'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: esError ? 'var(--color-error)' : 'var(--color-success)' }}>
          {esError ? 'error' : 'check_circle'}
        </span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: esError ? 'var(--color-error)' : 'var(--color-success)', flex: 1 }}>
          {mensaje}
        </span>
        <button
          onClick={() => { setSaliendo(true); setTimeout(() => { setVisible(false); onClose?.() }, 300) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0', display: 'flex' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
        </button>
      </div>
    </>
  )
}