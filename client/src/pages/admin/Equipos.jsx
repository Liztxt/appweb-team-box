import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'

export default function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  const [toast, setToast] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [editando, setEditando] = useState(null)
  const [nombreEditando, setNombreEditando] = useState('')
  const [descEditando, setDescEditando] = useState('')
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const [equiposRes, empleadosRes] = await Promise.all([
        api.get('/admin/equipos'),
        api.get('/admin/empleados')
      ])
      setEquipos(equiposRes.data)
      setEmpleados(empleadosRes.data)
    } catch (err) {
      console.log('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleCrearEquipo = async () => {
    if (!nombre) { setToast({ mensaje: 'El nombre es obligatorio', tipo: 'error' }); return }
    try {
      await api.post('/teams', { nombre, descripcion })
      setToast({ mensaje: 'Equipo creado correctamente', tipo: 'exito' })
      setNombre(''); setDescripcion(''); fetchData()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al crear equipo', tipo: 'error' })
    }
  }

  const handleAsignar = async () => {
    if (!equipoSeleccionado || !empleadoSeleccionado) {
      setToast({ mensaje: 'Selecciona un equipo y un empleado', tipo: 'error' }); return
    }
    try {
      await api.post('/teams/asignar', { equipoId: equipoSeleccionado, numeroEmpleado: empleadoSeleccionado })
      setToast({ mensaje: 'Empleado asignado correctamente', tipo: 'exito' })
      setEquipoSeleccionado(''); setEmpleadoSeleccionado(''); fetchData()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al asignar', tipo: 'error' })
    }
  }

  const pedirConfirmacionEliminar = (id, nombre) => {
    setConfirmacion({
      titulo: 'Eliminar equipo',
      mensaje: `¿Seguro que quieres eliminar el equipo "${nombre}"? Se removerá de todos los empleados.`,
      accion: () => ejecutarEliminar(id)
    })
  }

  const ejecutarEliminar = async (id) => {
    try {
      await api.delete(`/admin/equipos/${id}`)
      setToast({ mensaje: 'Equipo eliminado correctamente', tipo: 'exito' })
      fetchData()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al eliminar', tipo: 'error' })
    } finally {
      setConfirmacion(null)
    }
  }

  const handleGuardarEquipo = async (id) => {
    if (!nombreEditando) { setToast({ mensaje: 'El nombre es obligatorio', tipo: 'error' }); return }
    try {
      await api.put(`/admin/equipos/${id}`, { nombre: nombreEditando, descripcion: descEditando })
      setToast({ mensaje: 'Equipo actualizado correctamente', tipo: 'exito' })
      setEditando(null); fetchData()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al actualizar', tipo: 'error' })
    }
  }

  const handleQuitarMiembro = async (equipoId, empleadoId) => {
    try {
      await api.delete(`/admin/equipos/${equipoId}/miembro/${empleadoId}`)
      setToast({ mensaje: 'Miembro removido correctamente', tipo: 'exito' })
      fetchData()
    } catch (err) {
      setToast({ mensaje: 'Error al remover miembro', tipo: 'error' })
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '0.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '13px', color: '#1E293B',
    background: '#F0F4F8', outline: 'none', boxSizing: 'border-box'
  }

  const miembrosDeEquipo = (equipoId) => empleados.filter(emp => emp.equipos.includes(equipoId))

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      <style>{`
        .eq-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 20px; align-items: start; }
        @media (max-width: 640px) { .eq-grid { grid-template-columns: 1fr; } }
      `}</style>

      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {confirmacion && <ConfirmModal titulo={confirmacion.titulo} mensaje={confirmacion.mensaje} onConfirmar={confirmacion.accion} onCancelar={() => setConfirmacion(null)} />}

      {/* Topbar */}
      <div style={{ height: '56px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
        <button onClick={() => navigate('/admin')} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Gestión de equipos</span>
      </div>

      <div className='eq-grid' style={{ padding: '20px 16px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Panel izquierdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Crear equipo */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>Crear equipo</h2>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Nombre *</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder='Ej. Diseño UX' style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Descripción</label>
              <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder='Descripción opcional' style={inputStyle} />
            </div>
            <button onClick={handleCrearEquipo} style={{ width: '100%', padding: '12px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              Crear equipo
            </button>
          </div>

          {/* Asignar miembro */}
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>Asignar miembro</h2>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Equipo</label>
              <select value={equipoSeleccionado} onChange={e => setEquipoSeleccionado(e.target.value)} style={inputStyle}>
                <option value=''>Selecciona un equipo</option>
                {equipos.map(eq => <option key={eq._id} value={eq._id}>{eq.nombre}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Empleado</label>
              <select value={empleadoSeleccionado} onChange={e => setEmpleadoSeleccionado(e.target.value)} style={inputStyle}>
                <option value=''>Selecciona un empleado</option>
                {empleados.map(emp => <option key={emp._id} value={emp.numeroEmpleado}>#{emp.numeroEmpleado} — {emp.rol}</option>)}
              </select>
            </div>
            <button onClick={handleAsignar} style={{ width: '100%', padding: '12px', background: '#1E293B', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              Asignar al equipo
            </button>
          </div>
        </div>

        {/* Lista equipos */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>Equipos existentes</h2>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
          ) : equipos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>No hay equipos creados</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {equipos.map(eq => (
                <div key={eq._id} style={{ background: '#F0F4F8', borderRadius: '10px', padding: '12px' }}>
                  {editando === eq._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input value={nombreEditando} onChange={e => setNombreEditando(e.target.value)} style={{ ...inputStyle, background: '#fff' }} placeholder='Nombre del equipo' />
                      <input value={descEditando} onChange={e => setDescEditando(e.target.value)} style={{ ...inputStyle, background: '#fff' }} placeholder='Descripción' />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleGuardarEquipo(eq._id)} style={{ flex: 1, padding: '10px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Guardar</button>
                        <button onClick={() => setEditando(null)} style={{ flex: 1, padding: '10px', background: '#fff', color: '#64748B', border: '0.5px solid #E2E8F0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>👥</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eq.nombre}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{eq.descripcion || 'Sin descripción'}</div>
                        </div>
                        <button onClick={() => { setEditando(eq._id); setNombreEditando(eq.nombre); setDescEditando(eq.descripcion || '') }}
                          style={{ padding: '8px', background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}>✏️</button>
                        <button onClick={() => pedirConfirmacionEliminar(eq._id, eq.nombre)}
                          style={{ padding: '8px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', flexShrink: 0 }}>🗑</button>
                      </div>
                      {miembrosDeEquipo(eq._id).length > 0 && (
                        <div style={{ borderTop: '0.5px solid #E2E8F0', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Miembros</div>
                          {miembrosDeEquipo(eq._id).map(emp => (
                            <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`} alt='' style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0 }} />
                              <span style={{ fontSize: '12px', color: '#475569', flex: 1 }}>#{emp.numeroEmpleado}</span>
                              <button onClick={() => handleQuitarMiembro(eq._id, emp._id)} style={{ padding: '4px 8px', background: 'transparent', color: '#94A3B8', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}