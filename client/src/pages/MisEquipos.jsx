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
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() =>   { fetchEquipos() }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const dashboardRuta = usuario?.rol === 'admin' ? '/admin' : usuario?.rol === 'manager' ? '/manager' : '/equipos'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>

      {/* Topbar */}
<div style={{ height: '92px', background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
  <div onClick={() => navigate(dashboardRuta)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}>
    <div style={{ width: '48px', height: '48px', background: 'var(--color-accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
  <img src="/logo_pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
</div>
<span style={{
  fontFamily: 'var(--font-logo)',
  fontStyle: 'italic',
  fontWeight: 800,
  fontSize: '22px',
  letterSpacing: '-0.02em',
  color: 'var(--color-topbar-text)'
}}>Team Box</span>
  </div>

 {usuario?.rol === 'admin' && (
  <button onClick={() => navigate('/admin')}
    style={{ background: 'transparent', color: 'var(--color-topbar-text)', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>settings</span>
    Dashboard
  </button>
)}
  {usuario?.rol === 'manager' && (
  <button onClick={() => navigate('/manager')}
    style={{ background: 'transparent', color: 'var(--color-topbar-text)', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>dashboard</span>
    Dashboard
  </button>
)}

  <ClimaWidget />

  <span onClick={() => navigate('/perfil')}
  style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
  #{usuario?.numeroEmpleado}
</span>
  <button onClick={handleLogout}
    style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
    Salir
  </button>
</div>
      {/* Contenido */}
      <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>Mis equipos</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Selecciona un equipo para ver sus documentos</p>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <Skeleton width='36px' height='36px' borderRadius='8px' style={{ marginBottom: '12px' }} />
                <Skeleton width='60%' height='16px' style={{ marginBottom: '8px' }} />
                <Skeleton width='80%' height='12px' />
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-gray)', marginBottom: '12px', display: 'block' }}>wifi_off</span>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>No se pudo cargar el contenido</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Verifica tu conexión e intenta de nuevo.</p>
            <button onClick={fetchEquipos}
              style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        ) : equipos.length === 0 ? (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '40px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-gray)', marginBottom: '12px', display: 'block' }}>group_off</span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No tienes equipos asignados aún</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {equipos.map(equipo => (
              <div key={equipo._id} onClick={() => navigate(`/equipos/${equipo._id}/docs`)}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '20px', cursor: 'pointer', transition: 'box-shadow 0.15s ease, border-color 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-dark)', fontSize: '20px' }}>group</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>{equipo.nombre}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{equipo.descripcion || 'Sin descripción'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}