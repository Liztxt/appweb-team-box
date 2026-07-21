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
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}

      <div style={{
        height: '64px', background: 'var(--color-topbar-bg)',
        borderBottom: '1px solid var(--color-topbar-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)'
      }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)' }}>Detalle del equipo</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
        ) : !equipo ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Equipo no encontrado</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Tarjeta principal */}
            <div style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', padding: '24px',
              display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '56px', height: '56px', background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary-dark)' }}>group</span>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
                  {equipo.nombre}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {equipo.descripcion || 'Sin descripción'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Creado el {new Date(equipo.creadoEn).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Miembros */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>
                Miembros ({equipo.miembros.length})
              </h2>
              {equipo.miembros.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Este equipo no tiene miembros asignados</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {equipo.miembros.map(emp => (
                    <div key={emp._id}
                      onClick={() => navigate(`/admin/ver/empleados/${emp._id}`)}
                      style={{
                        background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                        border: '1px solid var(--color-border)', transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}
                    >
                      <img
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`}
                        alt={`Avatar ${emp.numeroEmpleado}`}
                        loading="lazy"
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-surface)', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>#{emp.numeroEmpleado}</div>
                      </div>
                      <span style={{
                        background: emp.rol === 'admin' ? 'var(--color-primary-light)' : 'var(--color-surface)',
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
        )}
      </div>
    </div>
  )
}