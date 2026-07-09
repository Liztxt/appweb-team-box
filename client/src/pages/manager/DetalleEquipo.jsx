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
    border: '0.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '13px', color: '#1E293B',
    background: '#F0F4F8', outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {confirmacion && <ConfirmModal titulo={confirmacion.titulo} mensaje={confirmacion.mensaje} onConfirmar={confirmacion.accion} onCancelar={() => setConfirmacion(null)} />}

      <div style={{ height: '56px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Detalle del equipo</span>
        {equipo && (
          <button onClick={() => setEditando(!editando)}
            style={{ background: editando ? '#F0F4F8' : '#EEF2FF', color: editando ? '#64748B' : '#4F46E5', border: 'none', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
            {editando ? 'Cancelar' : '✏️ Editar'}
          </button>
        )}
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : !equipo ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Equipo no encontrado</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Tarjeta principal */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
              {editando ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Nombre *</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Descripción</label>
                    <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder='Descripción opcional' style={inputStyle} />
                  </div>
                  <button onClick={handleGuardar} disabled={guardando}
                    style={{ padding: '10px', background: guardando ? '#A5B4FC' : '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: guardando ? 'not-allowed' : 'pointer' }}>
                    {guardando ? 'Guardando...' : '💾 Guardar cambios'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>👥</div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B' }}>{equipo.nombre}</div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{equipo.descripcion || 'Sin descripción'}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                      Creado el {new Date(equipo.creadoEn).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Miembros */}
            <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>
                Miembros ({equipo.miembros.length})
              </h2>
              {equipo.miembros.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748B' }}>No hay miembros en este equipo</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {equipo.miembros.map(emp => (
                    <div key={emp._id} style={{ background: '#F0F4F8', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`} loading="lazy" alt=''
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B' }}>#{emp.numeroEmpleado}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{emp.rol}</div>
                      </div>
                      <button onClick={() => handleQuitarMiembro(emp._id, emp.numeroEmpleado)}
                        style={{ padding: '6px 10px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
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