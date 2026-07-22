import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-body)'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>

        {/* Número 404 */}
        <div style={{
          fontSize: '96px', fontWeight: '700',
          color: 'var(--color-border)', lineHeight: '1',
          marginBottom: '8px', letterSpacing: '-4px'
        }}>
          404
        </div>

        {/* Ícono */}
        <div style={{
          width: '64px', height: '64px', background: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-lg)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary-dark)' }}>mail</span>
        </div>

        <h1 style={{
          fontSize: '20px', fontWeight: '700',
          color: 'var(--color-text)', margin: '0 0 8px'
        }}>
          Página no encontrada
        </h1>

        <p style={{
          fontSize: '13px', color: 'var(--color-text-muted)',
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
              background: 'var(--color-surface)', color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Volver
          </button>
          <button
            onClick={() => navigate('/equipos')}
            style={{
              padding: '10px 20px',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'var(--font-body)'
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
            width: '24px', height: '24px', background: 'var(--color-topbar-bg)',
            borderRadius: '6px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '3px'
          }}>
            <img src="/logo_pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '2px' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-logo)', fontStyle: 'italic', fontWeight: 700, fontSize: '13px', color: 'var(--color-text-muted)' }}>Team Box</span>
        </div>
      </div>
    </div>
  )
}