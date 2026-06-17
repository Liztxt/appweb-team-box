import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState({ equipos: 0, empleados: 0, documentos: 0 })
  const [loading, setLoading] = useState(true)
  const { usuario, logout } = useAuth()
  const [logs, setLogs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (usuario?.rol !== 'admin') {
      navigate('/equipos')
      return
    }
    const fetchStats = async () => {
      try {
        const [equiposRes, empleadosRes, logsRes] = await Promise.all([
          api.get('/admin/stats/equipos'),
          api.get('/admin/stats/empleados'),
          api.get('/admin/logs')
        ])
        setStats({
          equipos: equiposRes.data.total,
          empleados: empleadosRes.data.total,
          documentos: equiposRes.data.totalDocs
        })
        setLogs(logsRes.data)
      } catch (err) {
        console.log('Error al cargar stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const cards = [
    { label: 'Equipos', value: stats.equipos, emoji: '👥', color: '#EEF2FF', text: '#3730A3' },
    { label: 'Empleados', value: stats.empleados, emoji: '👤', color: '#E1F5EE', text: '#085041' },
    { label: 'Documentos', value: stats.documentos, emoji: '📄', color: '#FEF9EC', text: '#713F12' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>

      {/* Topbar */}
      <div style={{
        height: '56px', background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '12px'
      }}>
        <div style={{
          width: '28px', height: '28px', background: '#6366F1',
          borderRadius: '7px', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '14px' }}>📦</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>
          Team Box — Admin
        </span>
        <span
          onClick={() => navigate('/perfil')}
          style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer', textDecoration: 'underline' }}
        >
          #{usuario?.numeroEmpleado}
        </span>
        <button
          onClick={() => navigate('/equipos')}
          style={{
            background: 'transparent', border: '0.5px solid #E2E8F0',
            borderRadius: '7px', padding: '6px 12px',
            fontSize: '12px', color: '#64748B', cursor: 'pointer',
            marginRight: '8px'
          }}
        >Ver mis equipos</button>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', border: '0.5px solid #E2E8F0',
            borderRadius: '7px', padding: '6px 12px',
            fontSize: '12px', color: '#64748B', cursor: 'pointer'
          }}
        >Cerrar sesión</button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
          Panel de administración
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '28px' }}>
          Gestiona empleados, equipos y documentos del sistema
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {cards.map(card => (
  <div
    key={card.label}
    onClick={() => navigate(`/admin/ver/${card.label.toLowerCase()}`)}
    style={{
      background: '#fff', border: '0.5px solid #E2E8F0',
      borderRadius: '10px', padding: '20px', cursor: 'pointer'
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
  >
              <div style={{
                width: '36px', height: '36px', background: card.color,
                borderRadius: '8px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px', fontSize: '18px'
              }}>
                {card.emoji}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: card.text, marginBottom: '2px' }}>
                {loading ? '—' : card.value}
              </div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>
          Acciones rápidas
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '0' }}>
          <div
            onClick={() => navigate('/admin/empleados')}
            style={{
              background: '#fff', border: '0.5px solid #E2E8F0',
              borderRadius: '10px', padding: '20px', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>
              Gestionar empleados
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Registrar nuevos empleados y ver los existentes
            </div>
          </div>
          <div
            onClick={() => navigate('/admin/equipos')}
            style={{
              background: '#fff', border: '0.5px solid #E2E8F0',
              borderRadius: '10px', padding: '20px', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>
              Gestionar equipos
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Crear equipos y asignar miembros
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', margin: '28px 0 12px' }}>
          Actividad reciente
        </h2>
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
          {logs.length === 0 ? (
            <p style={{ padding: '20px', fontSize: '13px', color: '#64748B' }}>Sin actividad registrada</p>
          ) : (
            logs.slice(0, 8).map((log, i) => (
              <div key={log._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px',
                borderBottom: i < 7 ? '0.5px solid #F0F4F8' : 'none'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: log.exitoso ? '#F0FDF4' : '#FEF2F2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                }}>
                  {log.accion === 'LOGIN' ? '🔑' : log.accion === 'REGISTRO' ? '👤' : log.accion === 'SUBIR_DOCUMENTO' ? '📄' : '🗑'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '1px' }}>
                    #{log.numeroEmpleado} — {log.detalle}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {new Date(log.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: '500', borderRadius: '20px', padding: '2px 8px',
                  background: log.exitoso ? '#F0FDF4' : '#FEF2F2',
                  color: log.exitoso ? '#15803D' : '#EF4444'
                }}>
                  {log.exitoso ? 'exitoso' : 'fallido'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}