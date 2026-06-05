import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('')
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
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
    if (!nombre) { setError('El nombre es obligatorio'); return }
    setError(''); setExito('')
    try {
      await api.post('/teams', { nombre, descripcion })
      setExito('Equipo creado correctamente')
      setNombre(''); setDescripcion('')
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear equipo')
    }
  }

  const handleAsignar = async () => {
    if (!equipoSeleccionado || !empleadoSeleccionado) {
      setError('Selecciona un equipo y un empleado'); return
    }
    setError(''); setExito('')
    try {
      await api.post('/teams/asignar', {
        equipoId: equipoSeleccionado,
        numeroEmpleado: empleadoSeleccionado
      })
      setExito('Empleado asignado correctamente')
      setEquipoSeleccionado(''); setEmpleadoSeleccionado('')
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al asignar')
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '0.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '13px', color: '#1E293B',
    background: '#F0F4F8', outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>

      {/* Topbar */}
      <div style={{
        height: '56px', background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '12px'
      }}>
        <button
          onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}
        >←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>
          Gestión de equipos
        </span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Crear equipo */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
            Crear equipo
          </h2>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Nombre *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder='Ej. Diseño UX' style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Descripción</label>
            <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder='Descripción opcional' style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', color: '#EF4444', marginBottom: '12px' }}>{error}</div>
          )}
          {exito && (
            <div style={{ background: '#F0FDF4', border: '0.5px solid #BBF7D0', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', color: '#15803D', marginBottom: '12px' }}>{exito}</div>
          )}

          <button onClick={handleCrearEquipo} style={{ width: '100%', padding: '10px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            Crear equipo
          </button>

          {/* Asignar miembro */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '0.5px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
              Asignar miembro
            </h2>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Equipo</label>
              <select value={equipoSeleccionado} onChange={e => setEquipoSeleccionado(e.target.value)} style={inputStyle}>
                <option value=''>Selecciona un equipo</option>
                {equipos.map(eq => (
                  <option key={eq._id} value={eq._id}>{eq.nombre}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Empleado</label>
              <select value={empleadoSeleccionado} onChange={e => setEmpleadoSeleccionado(e.target.value)} style={inputStyle}>
                <option value=''>Selecciona un empleado</option>
                {empleados.map(emp => (
                  <option key={emp._id} value={emp.numeroEmpleado}>#{emp.numeroEmpleado} — {emp.rol}</option>
                ))}
              </select>
            </div>
            <button onClick={handleAsignar} style={{ width: '100%', padding: '10px', background: '#1E293B', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              Asignar al equipo
            </button>
          </div>
        </div>

        {/* Lista equipos */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
            Equipos existentes
          </h2>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
          ) : equipos.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>No hay equipos creados</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {equipos.map(eq => (
                <div key={eq._id} style={{ padding: '12px', background: '#F0F4F8', borderRadius: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '2px' }}>{eq.nombre}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{eq.descripcion || 'Sin descripción'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}