import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'

export default function PerfilEmpleado() {
  const { id } = useParams()
  const [empleado, setEmpleado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/admin/empleados/${id}`)
      .then(res => setEmpleado(res.data))
      .catch(() => setToast({ mensaje: 'Error al cargar empleado', tipo: 'error' }))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}

      <div style={{
        height: '56px', background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '12px'
      }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Perfil del empleado</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : !empleado ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Empleado no encontrado</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Tarjeta principal */}
            <div style={{
              background: '#fff', border: '0.5px solid #E2E8F0',
              borderRadius: '12px', padding: '24px',
              display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <img
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${empleado.numeroEmpleado}`}
                alt={`Avatar ${empleado.numeroEmpleado}`}
                style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F0F4F8' }}
              />
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B' }}>
                  #{empleado.numeroEmpleado}
                </div>
                <span style={{
                  background: empleado.rol === 'admin' ? '#EEF2FF' : '#F0F4F8',
                  color: empleado.rol === 'admin' ? '#3730A3' : '#475569',
                  borderRadius: '20px', padding: '3px 12px',
                  fontSize: '12px', fontWeight: '500'
                }}>
                  {empleado.rol}
                </span>
              </div>
            </div>

            {/* Equipos */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>
                Equipos ({empleado.equipos.length})
              </h2>
              {empleado.equipos.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748B' }}>No pertenece a ningún equipo</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {empleado.equipos.map(eq => (
                    <div key={eq._id} style={{
                      background: '#F0F4F8', borderRadius: '8px', padding: '12px 16px'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B' }}>{eq.nombre}</div>
                      {eq.descripcion && (
                        <div style={{ fontSize: '12px', color: '#64748B' }}>{eq.descripcion}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}