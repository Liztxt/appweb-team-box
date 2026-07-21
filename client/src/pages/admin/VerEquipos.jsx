import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function VerEquipos() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/equipos').then(res => {
      setEquipos(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <div style={{
        height: '64px', background: 'var(--color-topbar-bg)',
        borderBottom: '1px solid var(--color-topbar-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)'
      }}>
        <button onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)' }}>Todos los equipos</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {equipos.map(eq => (
              <div key={eq._id} style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', transition: 'border-color 0.15s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                onClick={() => navigate(`/admin/ver/equipos/${eq._id}`)}
              >
                <div style={{
                  width: '36px', height: '36px', background: 'var(--color-primary-light)',
                  borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-dark)' }}>group</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>{eq.nombre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{eq.descripcion || 'Sin descripción'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '600' }}>
                    {eq.totalDocs} doc{eq.totalDocs !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {new Date(eq.creadoEn).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}