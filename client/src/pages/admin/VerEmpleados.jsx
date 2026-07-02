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
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      <div style={{
        height: '56px', background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '12px'
      }}>
        <button onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Todos los empleados</span>
        <input
          placeholder='Buscar por número o rol...'
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            padding: '7px 12px', border: '0.5px solid #E2E8F0',
            borderRadius: '8px', fontSize: '12px', background: '#F0F4F8',
            outline: 'none', width: '180px'
          }}
        />
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : empleadosFiltrados.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>No se encontraron empleados</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {empleadosFiltrados.map(emp => (
              <div key={emp._id} onClick={() => navigate(`/admin/ver/empleados/${emp._id}`)} style={{
                background: '#fff', border: '0.5px solid #E2E8F0',
                borderRadius: '10px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px',
                cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`}
                  alt={`Avatar ${emp.numeroEmpleado}`}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: '#F0F4F8' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B' }}>
                    #{emp.numeroEmpleado}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {emp.equipos.length} equipo{emp.equipos.length !== 1 ? 's' : ''} asignado{emp.equipos.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <span style={{
                  background: emp.rol === 'admin' ? '#EEF2FF' : '#F0F4F8',
                  color: emp.rol === 'admin' ? '#3730A3' : '#475569',
                  borderRadius: '20px', padding: '2px 10px',
                  fontSize: '11px', fontWeight: '500'
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