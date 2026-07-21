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
    { label: 'Equipos', value: stats.equipos, icon: 'group', ruta: '/admin/ver/equipos' },
    { label: 'Empleados', value: stats.empleados, icon: 'person', ruta: '/admin/ver/empleados' },
    { label: 'Documentos', value: stats.documentos, icon: 'description', ruta: '/admin/ver/documentos' }
  ]

  const acciones = [
    { label: 'Gestionar empleados', desc: 'Registrar nuevos empleados y ver los existentes', icon: 'manage_accounts', ruta: '/admin/empleados' },
    { label: 'Gestionar equipos', desc: 'Crear equipos y asignar miembros', icon: 'group_add', ruta: '/admin/equipos' }
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
        .dash-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
        .dash-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 28px; }
        .dash-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; cursor: pointer; transition: box-shadow 0.15s ease, border-color 0.15s ease; }
        .dash-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
        @media (max-width: 640px) {
          .dash-grid-3 { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .dash-grid-2 { grid-template-columns: 1fr; }
          .clima-hide { display: none; }
        }
      `}</style>

      <div style={{ background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
  <div onClick={() => navigate('/admin')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}>
    <div style={{ width: '36px', height: '36px', background: 'var(--color-accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/logo-pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
</div>
    <span style={{
  fontFamily: 'var(--font-logo)',
  fontStyle: 'italic',
  fontWeight: 800,
  fontSize: '17px',
  letterSpacing: '-0.02em',
  color: 'var(--color-topbar-text)'
}}>Team Box</span>
    <span style={{ fontSize: '12px', color: 'var(--color-topbar-text)', background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: '20px' }}>Admin</span>
  </div>
  <span className='clima-hide'><ClimaWidget /></span>
  <span onClick={() => navigate('/perfil')} style={{ fontSize: '12px', color: 'var(--color-topbar-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
    #{usuario?.numeroEmpleado}
  </span>
  <button onClick={() => navigate('/equipos')}
    style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
    Mis equipos
  </button>
  <button onClick={handleLogout}
    style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
    Salir
  </button>
</div>

      <div style={{ padding: '28px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>Panel de administración</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Gestiona empleados, equipos y documentos</p>

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
          <>
            {/* Stats */}
            <div className='dash-grid-3'>
              {cards.map(card => (
                <div key={card.label} className='dash-card' onClick={() => navigate(card.ruta)}>
                  <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-dark)', fontSize: '20px' }}>{card.icon}</span>
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
                <div key={a.label} className='dash-card' onClick={() => navigate(a.ruta)}>
                  <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-dark)', fontSize: '20px' }}>{a.icon}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>{a.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{a.desc}</div>
                </div>
              ))}
            </div>

            {/* Actividad reciente */}
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>Actividad reciente</h2>
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
                  <div key={log._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: i < 7 ? '1px solid var(--color-bg)' : 'none' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', flexShrink: 0, background: log.exitoso ? '#E8F5E9' : '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          </>
        )}
      </div>
    </div>
  )
}