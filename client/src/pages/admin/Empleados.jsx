import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'

export default function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [numeroEmpleado, setNumeroEmpleado] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('empleado')
  const [toast, setToast] = useState(null)
  const [editando, setEditando] = useState(null)
  const [rolEditando, setRolEditando] = useState('')
  const navigate = useNavigate()

  const fetchEmpleados = async () => {
    try {
      const res = await api.get('/admin/empleados')
      setEmpleados(res.data)
    } catch (err) {
      console.log('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmpleados() }, [])

  const handleCrear = async () => {
    if (!numeroEmpleado || !password) {
      setToast({ mensaje: 'Número de empleado y contraseña son obligatorios', tipo: 'error' })
      return
    }
    try {
      await api.post('/auth/register', { numeroEmpleado, password, rol })
      setToast({ mensaje: 'Empleado creado correctamente', tipo: 'exito' })
      setNumeroEmpleado(''); setPassword(''); setRol('empleado')
      fetchEmpleados()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al crear empleado', tipo: 'error' })
    }
  }

  const handleEliminar = async (id, numero) => {
    if (!confirm(`¿Seguro que quieres eliminar al empleado #${numero}?`)) return
    try {
      await api.delete(`/admin/empleados/${id}`)
      setToast({ mensaje: 'Empleado eliminado correctamente', tipo: 'exito' })
      fetchEmpleados()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al eliminar', tipo: 'error' })
    }
  }

  const handleGuardarRol = async (id) => {
    try {
      await api.put(`/admin/empleados/${id}`, { rol: rolEditando })
      setToast({ mensaje: 'Rol actualizado correctamente', tipo: 'exito' })
      setEditando(null)
      fetchEmpleados()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al actualizar', tipo: 'error' })
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

      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}

      {/* Topbar */}
      <div style={{
        height: '56px', background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '12px'
      }}>
        <button onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>
          Gestión de empleados
        </span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', alignItems: 'start' }}>

        {/* Formulario crear */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
            Registrar empleado
          </h2>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Número de empleado</label>
            <input value={numeroEmpleado} onChange={e => setNumeroEmpleado(e.target.value)} placeholder='Ej. 12345' style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Contraseña</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Mínimo 8 caracteres, 1 mayúscula y 1 número' style={inputStyle} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Rol</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['empleado', 'admin'].map(r => (
                <button key={r} onClick={() => setRol(r)} style={{
                  flex: 1, padding: '7px',
                  border: rol === r ? '1.5px solid #6366F1' : '0.5px solid #E2E8F0',
                  borderRadius: '8px', fontSize: '12px', fontWeight: '500',
                  cursor: 'pointer',
                  background: rol === r ? '#EEF2FF' : '#fff',
                  color: rol === r ? '#4F46E5' : '#64748B'
                }}>
                  {r === 'empleado' ? '👤 Empleado' : '⚙️ Admin'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleCrear} style={{ width: '100%', padding: '10px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            Crear empleado
          </button>
        </div>

        {/* Lista empleados */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
            Empleados registrados
          </h2>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
          ) : empleados.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#64748B' }}>No hay empleados registrados</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {empleados.map(emp => (
                <div key={emp._id} style={{ background: '#F0F4F8', borderRadius: '8px', padding: '10px 12px' }}>
                  {editando === emp._id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, fontSize: '13px', fontWeight: '500', color: '#1E293B' }}>#{emp.numeroEmpleado}</div>
                      <select value={rolEditando} onChange={e => setRolEditando(e.target.value)}
                        style={{ padding: '5px 8px', borderRadius: '6px', border: '0.5px solid #E2E8F0', fontSize: '12px', color: '#1E293B', background: '#fff' }}>
                        <option value='empleado'>Empleado</option>
                        <option value='admin'>Admin</option>
                      </select>
                      <button onClick={() => handleGuardarRol(emp._id)}
                        style={{ padding: '5px 10px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                        Guardar
                      </button>
                      <button onClick={() => setEditando(null)}
                        style={{ padding: '5px 10px', background: '#F0F4F8', color: '#64748B', border: '0.5px solid #E2E8F0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: emp.rol === 'admin' ? '#6366F1' : '#CBD5E1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: '600', color: '#fff', flexShrink: 0
                      }}>
                        {emp.numeroEmpleado.slice(-2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B' }}>#{emp.numeroEmpleado}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{emp.equipos.length} equipo{emp.equipos.length !== 1 ? 's' : ''}</div>
                      </div>
                      <span style={{
                        background: emp.rol === 'admin' ? '#EEF2FF' : '#F0F4F8',
                        color: emp.rol === 'admin' ? '#3730A3' : '#475569',
                        borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '500'
                      }}>
                        {emp.rol}
                      </span>
                      <button onClick={() => { setEditando(emp._id); setRolEditando(emp.rol) }}
                        style={{ padding: '5px 8px', background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleEliminar(emp._id, emp.numeroEmpleado)}
                        style={{ padding: '5px 8px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
                        🗑
                      </button>
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