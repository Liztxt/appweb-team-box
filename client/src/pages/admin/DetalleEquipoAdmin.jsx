import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'

export default function DetalleEquipoAdmin() {
  const { id } = useParams()
  const [equipo, setEquipo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/admin/equipos/${id}`)
      .then(res => setEquipo(res.data))
      .catch(() => setToast({ mensaje: 'Error al cargar equipo', tipo: 'error' }))
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
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Detalle del equipo</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : !equipo ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Equipo no encontrado</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Tarjeta principal */}
            <div style={{
              background: '#fff', border: '0.5px solid #E2E8F0',
              borderRadius: '12px', padding: '24px',
              display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{
                width: '56px', height: '56px', background: '#EEF2FF',
                borderRadius: '12px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '28px', flexShrink: 0
              }}>👥</div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B' }}>
                  {equipo.nombre}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  {equipo.descripcion || 'Sin descripción'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                  Creado el {new Date(equipo.creadoEn).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Miembros */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>
                Miembros ({equipo.miembros.length})
              </h2>
              {equipo.miembros.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748B' }}>Este equipo no tiene miembros asignados</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {equipo.miembros.map(emp => (
                    <div key={emp._id}
                      onClick={() => navigate(`/admin/ver/empleados/${emp._id}`)}
                      style={{
                        background: '#F0F4F8', borderRadius: '8px', padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E8EDFB'}
                      onMouseLeave={e => e.currentTarget.style.background = '#F0F4F8'}
                    >
                      <img
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`}
                        alt={`Avatar ${emp.numeroEmpleado}`}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B' }}>#{emp.numeroEmpleado}</div>
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
        )}
      </div>
    </div>
  )
}