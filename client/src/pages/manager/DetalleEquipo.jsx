import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'

export default function DetalleEquipoManager() {
  const { equipoId } = useParams()
  const [equipo, setEquipo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const navigate = useNavigate()

  const fetchEquipo = async () => {
    try {
      const res = await api.get(`/manager/equipos/${equipoId}`)
      setEquipo(res.data)
      setNombre(res.data.nombre)
      setDescripcion(res.data.descripcion || '')
    } catch (err) {
      setToast({ mensaje: 'Error al cargar equipo', tipo: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEquipo() }, [equipoId])

  const handleGuardar = async () => {
    if (!nombre.trim()) { setToast({ mensaje: 'El nombre es obligatorio', tipo: 'error' }); return }
    setGuardando(true)
    try {
      const res = await api.put(`/manager/equipos/${equipoId}`, { nombre, descripcion })
      setEquipo({ ...equipo, ...res.data })
      setEditando(false)
      setToast({ mensaje: 'Equipo actualizado correctamente', tipo: 'exito' })
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al actualizar', tipo: 'error' })
    } finally {
      setGuardando(false)
    }
  }

  const handleQuitarMiembro = (empleadoId, numeroEmpleado) => {
    setConfirmacion({
      titulo: 'Quitar miembro',
      mensaje: `¿Seguro que quieres quitar al empleado #${numeroEmpleado} del equipo?`,
      accion: async () => {
        try {
          await api.delete(`/manager/equipos/${equipoId}/miembro/${empleadoId}`)
          setToast({ mensaje: 'Miembro removido correctamente', tipo: 'exito' })
          fetchEquipo()
        } catch (err) {
          setToast({ mensaje: 'Error al remover miembro', tipo: 'error' })
        } finally {
          setConfirmacion(null)
        }
      }
    })
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', color: 'var(--color-text)',
    background: 'var(--color-bg)', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {confirmacion && <ConfirmModal titulo={confirmacion.titulo} mensaje={confirmacion.mensaje} onConfirmar={confirmacion.accion} onCancelar={() => setConfirmacion(null)} />}

      <div style={{ height: '92px', background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)', flex: 1 }}>Detalle del equipo</span>
        {equipo && (
          <button onClick={() => setEditando(!editando)}
            style={{ background: editando ? 'rgba(255,255,255,0.12)' : 'var(--color-accent)', color: editando ? 'var(--color-topbar-text)' : 'var(--color-topbar-bg)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{editando ? 'close' : 'edit'}</span>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        )}
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
        ) : !equipo ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Equipo no encontrado</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Tarjeta principal */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              {editando ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Nombre *</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Descripción</label>
                    <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder='Descripción opcional' style={inputStyle} />
                  </div>
                  <button onClick={handleGuardar} disabled={guardando}
                    style={{ padding: '10px', background: guardando ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--color-primary-dark)' }}>group</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>{equipo.nombre}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{equipo.descripcion || 'Sin descripción'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Creado el {new Date(equipo.creadoEn).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Miembros */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>
                Miembros ({equipo.miembros.length})
              </h2>
              {equipo.miembros.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No hay miembros en este equipo</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {equipo.miembros.map(emp => (
                    <div key={emp._id} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`} loading="lazy" alt=''
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-surface)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>#{emp.numeroEmpleado}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{emp.rol}</div>
                      </div>
                      <button onClick={() => handleQuitarMiembro(emp._id, emp.numeroEmpleado)}
                        style={{ padding: '6px 10px', background: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Quitar
                      </button>
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