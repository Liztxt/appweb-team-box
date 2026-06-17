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
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      <div style={{
        height: '56px', background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '12px'
      }}>
        <button onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Todos los equipos</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {equipos.map(eq => (
              <div key={eq._id} style={{
                background: '#fff', border: '0.5px solid #E2E8F0',
                borderRadius: '10px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                onClick={() => navigate(`/equipos/${eq._id}/docs`)}
              >
                <div style={{
                  width: '36px', height: '36px', background: '#EEF2FF',
                  borderRadius: '8px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px', flexShrink: 0
                }}>👥</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B' }}>{eq.nombre}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{eq.descripcion || 'Sin descripción'}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  {new Date(eq.creadoEn).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}