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

  const statCards = stats ? [
    { valor: stats.totalEquipos, label: 'Mis equipos', icono: 'group', bg: 'rgba(75, 67, 176, 0.08)', border: 'rgba(75, 67, 176, 0.18)', color: '#4B43B0' },
    { valor: stats.totalMiembros, label: 'Miembros', icono: 'person', bg: 'rgba(46, 125, 50, 0.08)', border: 'rgba(46, 125, 50, 0.18)', color: 'var(--color-success)' },
    { valor: stats.totalDocs, label: 'Documentos', icono: 'description', bg: 'rgba(176, 101, 12, 0.08)', border: 'rgba(176, 101, 12, 0.18)', color: '#B0650C' }
  ] : []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .manager-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 28px; align-items: start; }
        @media (max-width: 720px) { .manager-grid { grid-template-columns: 1fr; } }
        .manager-card { transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease; animation: manager-fade-in 0.35s ease backwards; position: relative; overflow: hidden; }
        .manager-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: var(--accent-color, transparent); }
        .manager-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        @keyframes manager-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .manager-equipo-row { transition: background 0.15s ease; }
        .manager-equipo-row:hover { background: rgba(75, 67, 176, 0.08); }
        .manager-topbar-label { display: inline; }
        @media (max-width: 640px) { .manager-topbar-label { display: none; } }
      `}</style>

      {/* Topbar */}
      <div
        className="h-[72px] md:h-[92px] flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8"
        style={{ background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0" style={{ background: '#fff', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
          <img src="/logo_pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '3px' }} />
        </div>
        <span className="text-[15px] sm:text-[20px] truncate flex-1" style={{ fontFamily: 'var(--font-logo)', fontStyle: 'italic', fontWeight: 800, color: 'var(--color-topbar-text)' }}>Team Box — Manager</span>
        <span className='hidden sm:block'><ClimaWidget /></span>
        <span onClick={() => navigate('/perfil')}
          className="shrink-0"
          style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
          #{usuario?.numeroEmpleado}
        </span>
        <button onClick={handleLogout}
          className="shrink-0 flex items-center gap-1"
          style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
          <span className='manager-topbar-label'>Cerrar sesión</span>
        </button>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-7" style={{ maxWidth: '1180px', margin: '0 auto', paddingTop: '48px' }}>

        <div className='manager-grid'>

          {/* Columna izquierda: Panel + stats + acciones */}
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 4px' }}>Panel de Manager</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '0 0 24px' }}>Gestiona tus equipos y miembros</p>

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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {statCards.map((s, i) => (
                  <div key={i} className='manager-card' style={{ '--accent-color': s.color, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ width: '36px', height: '36px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: s.color }}>{s.icono}</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>{s.valor}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Acciones rápidas */}
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>Acciones rápidas</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div onClick={() => navigate('/manager/equipos')}
                className='manager-card'
                style={{ '--accent-color': '#4B43B0', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(75, 67, 176, 0.08)', border: '1px solid rgba(75, 67, 176, 0.18)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#4B43B0' }}>group_add</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Gestionar equipos</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Crear equipos y asignar miembros</div>
              </div>
              <div onClick={() => navigate('/equipos')}
                className='manager-card'
                style={{ '--accent-color': '#B0650C', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(176, 101, 12, 0.08)', border: '1px solid rgba(176, 101, 12, 0.18)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#B0650C' }}>description</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>Ver documentos</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Accede a los documentos de tus equipos</div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Mis equipos */}
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
                    className='manager-equipo-row'
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#4B43B0' }}>group</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>{eq.nombre}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{eq.descripcion || 'Sin descripción'}</div>
                      <button onClick={e => { e.stopPropagation(); navigate(`/equipos/${eq._id}/docs`) }}
                        style={{ padding: '4px 10px', background: 'rgba(75, 67, 176, 0.1)', color: '#4B43B0', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
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