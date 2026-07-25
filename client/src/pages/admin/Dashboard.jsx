import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ClimaWidget from '../../components/ClimaWidget'
import Skeleton from '../../components/Skeleton'
import api from '../../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ equipos: 0, empleados: 0, documentos: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { usuario, logout } = useAuth()
  const [logs, setLogs] = useState([])
  const navigate = useNavigate()

  const fetchStats = async () => {
    setError(false)
    setLoading(true)
    try {
      const [equiposRes, empleadosRes, logsRes] = await Promise.all([
        api.get('/admin/stats/equipos'),
        api.get('/admin/stats/empleados'),
        api.get('/admin/logs')
      ])
      setStats({ equipos: equiposRes.data.total, empleados: empleadosRes.data.total, documentos: equiposRes.data.totalDocs })
      setLogs(logsRes.data)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (usuario?.rol !== 'admin') { navigate('/equipos'); return }
    fetchStats()
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const cards = [
    { label: 'Equipos', value: stats.equipos, icon: 'group', ruta: '/admin/ver/equipos', bg: 'rgba(75, 67, 176, 0.08)', border: 'rgba(75, 67, 176, 0.18)', color: '#4B43B0' },
    { label: 'Empleados', value: stats.empleados, icon: 'person', ruta: '/admin/ver/empleados', bg: 'rgba(46, 125, 50, 0.08)', border: 'rgba(46, 125, 50, 0.18)', color: 'var(--color-success)' },
    { label: 'Documentos', value: stats.documentos, icon: 'description', ruta: '/admin/ver/documentos', bg: 'rgba(176, 101, 12, 0.08)', border: 'rgba(176, 101, 12, 0.18)', color: '#B0650C' }
  ]

  const acciones = [
    { label: 'Gestionar empleados', desc: 'Registrar nuevos empleados y ver los existentes', icon: 'manage_accounts', ruta: '/admin/empleados', bg: 'rgba(46, 125, 50, 0.08)', border: 'rgba(46, 125, 50, 0.18)', color: 'var(--color-success)' },
    { label: 'Gestionar equipos', desc: 'Crear equipos y asignar miembros', icon: 'group_add', ruta: '/admin/equipos', bg: 'rgba(75, 67, 176, 0.08)', border: 'rgba(75, 67, 176, 0.18)', color: '#4B43B0' }
  ]

  const logIcon = (accion) => {
    if (accion === 'LOGIN') return 'key'
    if (accion === 'REGISTRO') return 'person_add'
    if (accion === 'SUBIR_DOCUMENTO') return 'upload_file'
    if (accion === 'ELIMINAR_DOCUMENTO') return 'delete'
    if (accion === 'ELIMINAR_EMPLEADO') return 'person_remove'
    return 'history'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .dash-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .dash-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 4px; }
        .dash-main-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; align-items: start; }
        .dash-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; cursor: pointer; transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease; position: relative; overflow: hidden; animation: dash-fade-in 0.35s ease backwards; }
        .dash-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; background: var(--accent-color, transparent); }
        .dash-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .dash-grid-3 .dash-card:nth-child(1) { animation-delay: 0.03s; }
        .dash-grid-3 .dash-card:nth-child(2) { animation-delay: 0.08s; }
        .dash-grid-3 .dash-card:nth-child(3) { animation-delay: 0.13s; }
        @keyframes dash-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .log-row { transition: background 0.15s ease; }
        .log-row:hover { background: var(--color-bg); }
        .dash-topbar-btn-label { display: inline; }
        @media (max-width: 900px) {
          .dash-main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .dash-grid-3 { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .dash-grid-2 { grid-template-columns: 1fr; }
          .clima-hide { display: none; }
          .dash-topbar-btn-label { display: none; }
        }
      `}</style>

      {/* Topbar */}
      <div
        className="h-[72px] md:h-[92px] flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8"
        style={{ background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div onClick={() => navigate('/admin')} className="flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-1 min-w-0">
          <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0" style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
            <img src="/logo_pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <span className="text-[17px] sm:text-[22px] truncate" style={{
            fontFamily: 'var(--font-logo)',
            fontStyle: 'italic',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--color-topbar-text)'
          }}>Team Box</span>
          <span className="hidden sm:inline shrink-0" style={{ fontSize: '12px', color: 'var(--color-topbar-text)', background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: '20px' }}>Admin</span>
        </div>
        <span className='clima-hide'><ClimaWidget /></span>
        <span onClick={() => navigate('/perfil')}
          className="shrink-0"
          style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
          #{usuario?.numeroEmpleado}
        </span>
        <button onClick={() => navigate('/equipos')}
          className="shrink-0 flex items-center gap-1"
          style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>groups</span>
          <span className='dash-topbar-btn-label'>Mis equipos</span>
        </button>
        <button onClick={handleLogout}
          className="shrink-0 flex items-center gap-1"
          style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
          <span className='dash-topbar-btn-label'>Salir</span>
        </button>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-7" style={{ maxWidth: '1180px', margin: '0 auto', paddingTop: '48px' }}>
        {error ? (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-gray)', marginBottom: '12px', display: 'block' }}>wifi_off</span>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>No se pudo cargar el panel</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Verifica tu conexión e intenta de nuevo.</p>
            <button onClick={fetchStats} style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className='dash-main-grid'>

            {/* Columna izquierda: Panel de administración */}
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>Panel de administración</h1>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Gestiona empleados, equipos y documentos</p>

              {/* Stats */}
              <div className='dash-grid-3'>
                {cards.map(card => (
                  <div key={card.label} className='dash-card' style={{ '--accent-color': card.color }} onClick={() => navigate(card.ruta)}>
                    <div style={{ width: '36px', height: '36px', background: card.bg, border: `1px solid ${card.border}`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <span className="material-symbols-outlined" style={{ color: card.color, fontSize: '20px' }}>{card.icon}</span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '2px' }}>
                      {loading ? <Skeleton width='40px' height='28px' borderRadius='6px' /> : card.value}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Acciones rápidas */}
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>Acciones rápidas</h2>
              <div className='dash-grid-2'>
                {acciones.map(a => (
                  <div key={a.label} className='dash-card' style={{ '--accent-color': a.color }} onClick={() => navigate(a.ruta)}>
                    <div style={{ width: '36px', height: '36px', background: a.bg, border: `1px solid ${a.border}`, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                      <span className="material-symbols-outlined" style={{ color: a.color, fontSize: '20px' }}>{a.icon}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>{a.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{a.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: Actividad reciente */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>Actividad reciente</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Historial de acciones en el sistema</p>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {loading ? (
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Skeleton width='32px' height='32px' borderRadius='8px' />
                        <div style={{ flex: 1 }}>
                          <Skeleton width='70%' height='13px' style={{ marginBottom: '6px' }} />
                          <Skeleton width='40%' height='11px' />
                        </div>
                        <Skeleton width='40px' height='20px' borderRadius='20px' />
                      </div>
                    ))}
                  </div>
                ) : logs.length === 0 ? (
                  <p style={{ padding: '20px', fontSize: '13px', color: 'var(--color-text-muted)' }}>Sin actividad registrada</p>
                ) : (
                  logs.slice(0, 8).map((log, i) => (
                    <div key={log._id} className="log-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: i < 7 ? '1px solid var(--color-bg)' : 'none' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: log.exitoso ? '#E8F5E9' : '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: log.exitoso ? 'var(--color-success)' : 'var(--color-error)' }}>{logIcon(log.accion)}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          #{log.numeroEmpleado} — {log.detalle}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {new Date(log.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '600', borderRadius: '20px', padding: '2px 8px', background: log.exitoso ? '#E8F5E9' : '#FFEBEE', color: log.exitoso ? 'var(--color-success)' : 'var(--color-error)', flexShrink: 0 }}>
                        {log.exitoso ? 'OK' : 'ERR'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}