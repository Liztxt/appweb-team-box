import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'

export default function ManagerEquipos() {
  const [equipos, setEquipos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  const [toast, setToast] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const [equiposRes, empleadosRes] = await Promise.all([
        api.get('/manager/mis-equipos'),
        api.get('/manager/empleados')
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
      await api.post('/manager/equipos', { nombre, descripcion })
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
      await api.post('/manager/equipos/asignar', { equipoId: equipoSeleccionado, numeroEmpleado: empleadoSeleccionado })
      setToast({ mensaje: 'Empleado asignado correctamente', tipo: 'exito' })
      setEquipoSeleccionado(''); setEmpleadoSeleccionado(''); fetchData()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al asignar', tipo: 'error' })
    }
  }

  const handleQuitarMiembro = async (equipoId, empleadoId) => {
    setConfirmacion({
      titulo: 'Quitar miembro',
      mensaje: '¿Seguro que quieres quitar a este miembro del equipo?',
      accion: async () => {
        try {
          await api.delete(`/manager/equipos/${equipoId}/miembro/${empleadoId}`)
          setToast({ mensaje: 'Miembro removido correctamente', tipo: 'exito' })
          fetchData()
        } catch (err) {
          setToast({ mensaje: 'Error al remover miembro', tipo: 'error' })
        } finally {
          setConfirmacion(null)
        }
      }
    })
  }

  const miembrosDeEquipo = (equipoId) => empleados.filter(emp => emp.equipos.includes(equipoId))

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', color: 'var(--color-text)',
    background: 'var(--color-bg)', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .mgr-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 20px; align-items: start; }
        @media (max-width: 640px) { .mgr-grid { grid-template-columns: 1fr; } }
      `}</style>

      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {confirmacion && <ConfirmModal titulo={confirmacion.titulo} mensaje={confirmacion.mensaje} onConfirmar={confirmacion.accion} onCancelar={() => setConfirmacion(null)} />}

      <div style={{ height: '128px', background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => navigate('/manager')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)' }}>Gestión de equipos</span>
      </div>

      <div className='mgr-grid' style={{ padding: '24px 16px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Panel izquierdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Crear equipo */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '20px' }}>Crear equipo</h2>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Nombre *</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder='Ej. Diseño UX' style={inputStyle} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Descripción</label>
              <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder='Descripción opcional' style={inputStyle} />
            </div>
            <button onClick={handleCrearEquipo}
              style={{ width: '100%', padding: '11px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Crear equipo
            </button>
          </div>

          {/* Asignar miembro */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '20px' }}>Asignar miembro</h2>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Equipo</label>
              <select value={equipoSeleccionado} onChange={e => setEquipoSeleccionado(e.target.value)} style={inputStyle}>
                <option value=''>Selecciona un equipo</option>
                {equipos.map(eq => <option key={eq._id} value={eq._id}>{eq.nombre}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Empleado</label>
              <select value={empleadoSeleccionado} onChange={e => setEmpleadoSeleccionado(e.target.value)} style={inputStyle}>
                <option value=''>Selecciona un empleado</option>
                {empleados.map(emp => <option key={emp._id} value={emp.numeroEmpleado}>#{emp.numeroEmpleado}</option>)}
              </select>
            </div>
            <button onClick={handleAsignar}
              style={{ width: '100%', padding: '11px', background: 'var(--color-primary-dark)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Asignar al equipo
            </button>
          </div>
        </div>

        {/* Lista equipos */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '16px' }}>Mis equipos</h2>
          {loading ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
          ) : equipos.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No tienes equipos creados</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {equipos.map(eq => (
                <div key={eq._id} onClick={() => navigate(`/manager/equipos/${eq._id}`)} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px', cursor: 'pointer', transition: 'background 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-dark)' }}>group</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>{eq.nombre}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{eq.descripcion || 'Sin descripción'}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); navigate(`/equipos/${eq._id}/docs`) }}
                      style={{ padding: '6px 10px', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
                      Ver docs
                    </button>
                  </div>
                  {miembrosDeEquipo(eq._id).length > 0 && (
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Miembros</div>
                      {miembrosDeEquipo(eq._id).map(emp => (
                        <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`} loading="lazy" alt='' style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', flex: 1 }}>#{emp.numeroEmpleado}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleQuitarMiembro(eq._id, emp._id) }}
                            style={{ padding: '4px', background: 'transparent', color: 'var(--color-text-muted)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                          </button>
                        </div>
                      ))}
                    </div>
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