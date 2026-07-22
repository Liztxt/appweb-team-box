import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'

export default function PerfilEmpleado() {
  const { id } = useParams()
  const [empleado, setEmpleado] = useState(null)
  const [ultimoAcceso, setUltimoAcceso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get(`/admin/empleados/${id}`),
      api.get(`/admin/empleados/${id}/ultimo-acceso`)
    ])
      .then(([empRes, accesoRes]) => {
        setEmpleado(empRes.data)
        setUltimoAcceso(accesoRes.data.ultimoAcceso)
      })
      .catch(() => setToast({ mensaje: 'Error al cargar empleado', tipo: 'error' }))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}

      <div style={{
        height: '128px', background: 'var(--color-topbar-bg)',
        borderBottom: '1px solid var(--color-topbar-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)'
      }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)' }}>Perfil del empleado</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
        ) : !empleado ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Empleado no encontrado</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Tarjeta principal */}
            <div style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)', padding: '24px',
              display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)'
            }}>
              <img
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${empleado.numeroEmpleado}`}
                alt={`Avatar ${empleado.numeroEmpleado}`}
                loading="lazy"
                style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-bg)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
                  #{empleado.numeroEmpleado}
                </div>
                <span style={{
                  background: empleado.rol === 'admin' ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  color: empleado.rol === 'admin' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                  borderRadius: '20px', padding: '3px 12px',
                  fontSize: '12px', fontWeight: '600'
                }}>
                  {empleado.rol}
                </span>
              </div>
            </div>

            {/* Último acceso */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '8px' }}>
                Último acceso
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
                {ultimoAcceso ? (
                  <>
                    {new Date(ultimoAcceso).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })} · {new Date(ultimoAcceso).toLocaleTimeString('es-MX', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </>
                ) : 'Sin accesos registrados'}
              </p>
            </div>

            {/* Equipos */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>
                Equipos ({empleado.equipos.length})
              </h2>
              {empleado.equipos.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No pertenece a ningún equipo</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {empleado.equipos.map(eq => (
                    <div key={eq._id} style={{
                      background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                      border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>{eq.nombre}</div>
                      {eq.descripcion && (
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{eq.descripcion}</div>
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