import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ClimaWidget from '../../components/ClimaWidget'
import Skeleton from '../../components/Skeleton'
import api from '../../api/axios'

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null)
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const fetchData = async () => {
    setError(false)
    setLoading(true)
    try {
      const [statsRes, equiposRes] = await Promise.all([
        api.get('/manager/stats'),
        api.get('/manager/mis-equipos')
      ])
      setStats(statsRes.data)
      setEquipos(equiposRes.data)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .manager-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 28px; align-items: start; }
        @media (max-width: 720px) { .manager-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Topbar */}
      <div style={{ height: '92px', background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ width: '48px', height: '48px', background: '#fff', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0 }}>
          <img src="/logo-pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-logo)', fontStyle: 'italic', fontWeight: 800, fontSize: '20px', color: 'var(--color-topbar-text)', flex: 1 }}>Team Box — Manager</span>
        <ClimaWidget />
        <span onClick={() => navigate('/perfil')} style={{
          fontSize: '12px', fontWeight: 600, color: 'var(--color-topbar-bg)',
          cursor: 'pointer', background: '#fff', padding: '6px 14px', borderRadius: '20px'
        }}>
          #{usuario?.numeroEmpleado}
        </span>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 4px' }}>Panel de Manager</h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>Gestiona tus equipos y miembros</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <Skeleton width='40px' height='40px' borderRadius='8px' style={{ marginBottom: '12px' }} />
                <Skeleton width='40%' height='24px' style={{ marginBottom: '6px' }} />
                <Skeleton width='60%' height='12px' />
              </div>
            ))}
          </div>
        ) : stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {[
              { valor: stats.totalEquipos, label: 'Mis equipos', icono: 'group' },
              { valor: stats.totalMiembros, label: 'Miembros', icono: 'person' },
              { valor: stats.totalDocs, label: 'Documentos', icono: 'description' }
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary-dark)' }}>{s.icono}</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>{s.valor}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Panel: Acciones (izq) + Mis equipos (der) */}
        <div className='manager-grid'>

          {/* Acciones rápidas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>Acciones rápidas</h2>
            <div onClick={() => navigate('/manager/equipos')}
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}>
              <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary-dark)' }}>group_add</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Gestionar equipos</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Crear equipos y asignar miembros</div>
            </div>
            <div onClick={() => navigate('/equipos')}
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}>
              <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary-dark)' }}>description</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Ver documentos</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Accede a los documentos de tus equipos</div>
            </div>
          </div>

          {/* Mis equipos */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '16px' }}>Mis equipos</h2>
            {loading ? (
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
            ) : equipos.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No tienes equipos asignados aún</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {equipos.map(eq => (
                  <div key={eq._id} onClick={() => navigate(`/manager/equipos/${eq._id}`)}
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-dark)' }}>group</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>{eq.nombre}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{eq.descripcion || 'Sin descripción'}</div>
                      <button onClick={e => { e.stopPropagation(); navigate(`/equipos/${eq._id}/docs`) }}
                        style={{ padding: '4px 10px', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        Ir al equipo
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}