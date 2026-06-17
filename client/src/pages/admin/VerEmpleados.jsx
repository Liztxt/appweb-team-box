import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function VerEmpleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/empleados').then(res => {
      setEmpleados(res.data)
      setLoading(false)
    })
  }, [])

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
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Todos los empleados</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {empleados.map(emp => (
              <div key={emp._id} style={{
                background: '#fff', border: '0.5px solid #E2E8F0',
                borderRadius: '10px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: emp.rol === 'admin' ? '#6366F1' : '#CBD5E1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '600', color: '#fff', flexShrink: 0
                }}>
                  {emp.numeroEmpleado.slice(-2)}
                </div>
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