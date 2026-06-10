import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function MisEquipos() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await api.get('/teams/mine')
        setEquipos(res.data)
      } catch (err) {
        console.log('Error al cargar equipos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEquipos()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>

      {/* Topbar */}
      <div style={{
        height: '56px',
        background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '12px'
      }}>
        <div style={{
          width: '28px', height: '28px',
          background: '#6366F1', borderRadius: '7px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '14px' }}>📦</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>
          Team Box
        </span>
        <span
  onClick={() => navigate('/perfil')}
  style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer', textDecoration: 'underline' }}
>
  #{usuario?.numeroEmpleado}
</span>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '0.5px solid #E2E8F0',
            borderRadius: '7px',
            padding: '6px 12px',
            fontSize: '12px',
            color: '#64748B',
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
          Mis equipos
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
          Selecciona un equipo para ver sus documentos
        </p>

        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando equipos...</p>
        ) : equipos.length === 0 ? (
          <div style={{
            background: '#fff',
            border: '0.5px solid #E2E8F0',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              No tienes equipos asignados aún
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px'
          }}>
            {equipos.map((equipo) => (
              <div
                key={equipo._id}
                onClick={() => navigate(`/equipos/${equipo._id}/docs`)}
                style={{
                  background: '#fff',
                  border: '0.5px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                <div style={{
                  width: '36px', height: '36px',
                  background: '#EEF2FF',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '18px' }}>👥</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>
                  {equipo.nombre}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {equipo.descripcion || 'Sin descripción'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}