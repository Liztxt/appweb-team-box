import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ClimaWidget from '../components/ClimaWidget'
import Skeleton from '../components/Skeleton'
import api from '../api/axios'

export default function MisEquipos() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const fetchEquipos = async () => {
    setError(false)
    setLoading(true)
    try {
      const res = await api.get('/teams/mine')
      setEquipos(res.data)
    } catch (err) {
      console.log('Error al cargar equipos:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEquipos() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>

      {/* Topbar */}
      <div style={{ height: '56px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px' }}>
        <div style={{ width: '28px', height: '28px', background: '#6366F1', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px' }}>📦</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Team Box</span>
{usuario?.rol === 'admin' && (
  <button onClick={() => navigate('/admin')}
    style={{ background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
    ⚙️ Dashboard
  </button>
)}
        <ClimaWidget />
        <span onClick={() => navigate('/perfil')} style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer', textDecoration: 'underline' }}>
          #{usuario?.numeroEmpleado}
        </span>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '0.5px solid #E2E8F0', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', color: '#64748B', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>Mis equipos</h1>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>Selecciona un equipo para ver sus documentos</p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
                <Skeleton width='36px' height='36px' borderRadius='8px' style={{ marginBottom: '12px' }} />
                <Skeleton width='60%' height='16px' style={{ marginBottom: '8px' }} />
                <Skeleton width='80%' height='12px' />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>No se pudo cargar el contenido</div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Verifica tu conexión e intenta de nuevo.</p>
            <button onClick={fetchEquipos} style={{ padding: '10px 20px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              🔄 Reintentar
            </button>
          </div>
        ) : equipos.length === 0 ? (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#64748B' }}>No tienes equipos asignados aún</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {equipos.map(equipo => (
              <div key={equipo._id} onClick={() => navigate(`/equipos/${equipo._id}/docs`)}
                style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '20px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                <div style={{ width: '36px', height: '36px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '18px' }}>👥</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>{equipo.nombre}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{equipo.descripcion || 'Sin descripción'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}