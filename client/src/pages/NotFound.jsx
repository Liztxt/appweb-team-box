import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: '#F0F4F8',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>

        {/* Número 404 */}
        <div style={{
          fontSize: '96px', fontWeight: '700',
          color: '#E2E8F0', lineHeight: '1',
          marginBottom: '8px', letterSpacing: '-4px'
        }}>
          404
        </div>

        {/* Ícono */}
        <div style={{
          width: '64px', height: '64px', background: '#EEF2FF',
          borderRadius: '16px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 20px'
        }}>
          📭
        </div>

        <h1 style={{
          fontSize: '20px', fontWeight: '600',
          color: '#1E293B', margin: '0 0 8px'
        }}>
          Página no encontrada
        </h1>

        <p style={{
          fontSize: '13px', color: '#64748B',
          lineHeight: '1.6', margin: '0 0 28px'
        }}>
          La ruta que buscas no existe o no tienes acceso a ella.
          Verifica la URL o regresa al inicio.
        </p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 20px',
              background: '#fff', color: '#475569',
              border: '0.5px solid #E2E8F0', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
          <button
            onClick={() => navigate('/equipos')}
            style={{
              padding: '10px 20px',
              background: '#6366F1', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer'
            }}
          >
            Ir al inicio
          </button>
        </div>

        {/* Branding */}
        <div style={{
          marginTop: '40px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <div style={{
            width: '24px', height: '24px', background: '#6366F1',
            borderRadius: '6px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '12px'
          }}>📦</div>
          <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>Team Box</span>
        </div>
      </div>
    </div>
  )
}