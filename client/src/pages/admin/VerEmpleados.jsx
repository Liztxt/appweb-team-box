import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function VerEmpleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/empleados').then(res => {
      setEmpleados(res.data)
      setLoading(false)
    })
  }, [])

  const empleadosFiltrados = empleados.filter(emp =>
    emp.numeroEmpleado.toLowerCase().includes(busqueda.toLowerCase()) ||
    emp.rol.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <div style={{
        height: '92px', background: 'var(--color-topbar-bg)',
        borderBottom: '1px solid var(--color-topbar-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)'
      }}>
        <button onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)', flex: 1 }}>Todos los empleados</span>
        <input
          placeholder='Buscar por número o rol...'
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            padding: '7px 12px', border: 'none',
            borderRadius: '20px', fontSize: '12px', background: 'rgba(255,255,255,0.12)',
            color: 'var(--color-topbar-text)', outline: 'none', width: '180px',
            fontFamily: 'var(--font-body)'
          }}
        />
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
        ) : empleadosFiltrados.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No se encontraron empleados</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {empleadosFiltrados.map(emp => (
              <div key={emp._id} onClick={() => navigate(`/admin/ver/empleados/${emp._id}`)} style={{
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer', transition: 'border-color 0.15s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`}
                  alt={`Avatar ${emp.numeroEmpleado}`}
                  loading="lazy"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'var(--color-bg)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>
                    #{emp.numeroEmpleado}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {emp.equipos.length} equipo{emp.equipos.length !== 1 ? 's' : ''} asignado{emp.equipos.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <span style={{
                  background: emp.rol === 'admin' ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  color: emp.rol === 'admin' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                  borderRadius: '20px', padding: '2px 10px',
                  fontSize: '11px', fontWeight: '600'
                }}>
                  {emp.rol}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}