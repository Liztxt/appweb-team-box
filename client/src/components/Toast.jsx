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
          background: esError ? '#FEF2F2' : '#F0FDF4',
          border: `0.5px solid ${esError ? '#FECACA' : '#BBF7D0'}`,
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '320px',
          minWidth: '220px'
        }}
      >
        <span style={{ fontSize: '16px' }}>{esError ? '❌' : '✅'}</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: esError ? '#EF4444' : '#15803D', flex: 1 }}>
          {mensaje}
        </span>
        <button
          onClick={() => { setSaliendo(true); setTimeout(() => { setVisible(false); onClose?.() }, 300) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#94A3B8', padding: '0' }}
        >✕</button>
      </div>
    </>
  )
}