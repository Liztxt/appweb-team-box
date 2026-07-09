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
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>

      {/* Topbar */}
      <div style={{ height: '56px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px' }}>
        <div style={{ width: '28px', height: '28px', background: '#6366F1', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px' }}>📦</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Team Box — Manager</span>
        <ClimaWidget />
        <span onClick={() => navigate('/perfil')} style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer', textDecoration: 'underline' }}>
          #{usuario?.numeroEmpleado}
        </span>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '0.5px solid #E2E8F0', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', color: '#64748B', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: '0 0 4px' }}>Panel de Manager</h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Gestiona tus equipos y miembros</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                <Skeleton width='40px' height='40px' borderRadius='8px' style={{ marginBottom: '12px' }} />
                <Skeleton width='40%' height='24px' style={{ marginBottom: '6px' }} />
                <Skeleton width='60%' height='12px' />
              </div>
            ))}
          </div>
        ) : stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { valor: stats.totalEquipos, label: 'Mis equipos', icono: '👥' },
              { valor: stats.totalMiembros, label: 'Miembros', icono: '👤' },
              { valor: stats.totalDocs, label: 'Documentos', icono: '📄' }
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icono}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>{s.valor}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Acciones rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <div onClick={() => navigate('/manager/equipos')}
            style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '20px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>Gestionar equipos</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Crear equipos y asignar miembros</div>
          </div>
          <div onClick={() => navigate('/equipos')}
            style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '20px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>Ver documentos</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Accede a los documentos de tus equipos</div>
          </div>
        </div>

        {/* Mis equipos */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>Mis equipos</h2>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
          ) : equipos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>No tienes equipos asignados aún</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {equipos.map(eq => (
                <div key={eq._id} onClick={() => navigate(`/equipos/${eq._id}/docs`)}
                  style={{ background: '#F0F4F8', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E8EDFB'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F0F4F8'}>
                  <div style={{ width: '32px', height: '32px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👥</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B' }}>{eq.nombre}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{eq.descripcion || 'Sin descripción'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}