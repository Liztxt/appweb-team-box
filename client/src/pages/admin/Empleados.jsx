import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Toast from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'

export default function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [numeroEmpleado, setNumeroEmpleado] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState('empleado')
  const [creando, setCreando] = useState(false)
  const [toast, setToast] = useState(null)
  const [editando, setEditando] = useState(null)
  const [rolEditando, setRolEditando] = useState('')
  const [passwordEditando, setPasswordEditando] = useState('')
  const [emailEditando, setEmailEditando] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)
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
      setToast({ mensaje: 'Número de empleado y contraseña son obligatorios', tipo: 'error' }); return
    }
    setCreando(true)
    try {
      await api.post('/auth/register', { numeroEmpleado, password, rol, email: email || undefined })
      setToast({ mensaje: 'Empleado creado correctamente', tipo: 'exito' })
      setNumeroEmpleado(''); setPassword(''); setRol('empleado'); setEmail('')
      fetchEmpleados()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al crear empleado', tipo: 'error' })
    } finally {
      setCreando(false)
    }
  }

  const pedirConfirmacionEliminar = (id, numero) => {
    setConfirmacion({
      titulo: 'Eliminar empleado',
      mensaje: `¿Seguro que quieres eliminar al empleado #${numero}? Esta acción no se puede deshacer.`,
      accion: () => ejecutarEliminar(id)
    })
  }

  const ejecutarEliminar = async (id) => {
    try {
      await api.delete(`/admin/empleados/${id}`)
      setToast({ mensaje: 'Empleado eliminado correctamente', tipo: 'exito' })
      fetchEmpleados()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al eliminar', tipo: 'error' })
    } finally {
      setConfirmacion(null)
    }
  }

  const handleGuardarRol = async (id) => {
    try {
      await api.put(`/admin/empleados/${id}`, { rol: rolEditando, email: emailEditando || undefined })
      if (passwordEditando) {
        if (passwordEditando.length < 8) {
          setToast({ mensaje: 'La contraseña debe tener al menos 8 caracteres', tipo: 'error' }); return
        }
        await api.put(`/admin/empleados/${id}/password`, { passwordNueva: passwordEditando })
      }
      setToast({ mensaje: 'Empleado actualizado correctamente', tipo: 'exito' })
      setEditando(null); setPasswordEditando(''); setEmailEditando('')
      fetchEmpleados()
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al actualizar', tipo: 'error' })
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', color: 'var(--color-text)',
    background: 'var(--color-bg)', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)'
  }

  const rolConfig = {
    admin: { bg: 'rgba(75, 67, 176, 0.1)', color: '#4B43B0' },
    manager: { bg: 'rgba(46, 125, 50, 0.1)', color: '#2E7D32' },
    empleado: { bg: 'var(--color-bg)', color: 'var(--color-text-muted)' }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <style>{`
        .emp-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; align-items: start; }
        @media (max-width: 640px) { .emp-grid { grid-template-columns: 1fr; } }
        .emp-row { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .emp-row:hover { border-color: var(--color-primary); box-shadow: var(--shadow-sm); }
      `}</style>

      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {confirmacion && <ConfirmModal titulo={confirmacion.titulo} mensaje={confirmacion.mensaje} onConfirmar={confirmacion.accion} onCancelar={() => setConfirmacion(null)} />}

      {/* Topbar */}
      <div
        className="h-[72px] md:h-[92px] flex items-center gap-3 px-4 sm:px-6 md:px-8"
        style={{ background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <button onClick={() => navigate('/admin')}
          className="flex items-center bg-transparent border-none cursor-pointer shrink-0"
          style={{ color: 'var(--color-topbar-text)' }}>
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <span className="text-[13px] sm:text-[14px] font-bold truncate" style={{ color: 'var(--color-topbar-text)', flex: 1 }}>Gestión de empleados</span>
      </div>

      <div className='emp-grid px-8 sm:px-8 md:px-8 py-6 md:py-7' style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Formulario crear */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '20px' }}>Registrar empleado</h2>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Número de empleado</label>
            <input value={numeroEmpleado} onChange={e => setNumeroEmpleado(e.target.value)} placeholder='Ej. 12345' style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Email (opcional)</label>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='correo@empresa.com' style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Contraseña</label>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Mínimo 8 caracteres, 1 mayúscula y 1 número' style={inputStyle} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Rol</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { value: 'empleado', label: 'Empleado', icon: 'person' },
                { value: 'manager', label: 'Manager', icon: 'manage_accounts' },
                { value: 'admin', label: 'Admin', icon: 'shield' }
              ].map(r => (
                <button key={r.value} onClick={() => setRol(r.value)} style={{
                  flex: 1, padding: '8px 4px',
                  border: `1px solid ${rol === r.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                  background: rol === r.value ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  color: rol === r.value ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                  fontFamily: 'var(--font-body)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleCrear} disabled={creando}
            style={{ width: '100%', padding: '11px', background: creando ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: creando ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}>
            {creando ? 'Creando...' : 'Crear empleado'}
          </button>
        </div>

        {/* Lista empleados */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '16px' }}>Empleados registrados</h2>
          {loading ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
          ) : empleados.length === 0 ? (
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '32px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--color-gray)', marginBottom: '10px', display: 'block' }}>person_off</span>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No hay empleados registrados</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {empleados.map(emp => (
                <div key={emp._id} className='emp-row' style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '12px', border: '1px solid var(--color-border)' }}>
                  {editando === emp._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>#{emp.numeroEmpleado}</div>
                      <input type='email' value={emailEditando} onChange={e => setEmailEditando(e.target.value)} placeholder={emp.email || 'Email (opcional)'} style={{ ...inputStyle, background: 'var(--color-surface)' }} />
                      <select value={rolEditando} onChange={e => setRolEditando(e.target.value)} style={{ ...inputStyle, background: 'var(--color-surface)' }}>
                        <option value='empleado'>Empleado</option>
                        <option value='manager'>Manager</option>
                        <option value='admin'>Admin</option>
                      </select>
                      <input type='password' value={passwordEditando} onChange={e => setPasswordEditando(e.target.value)} placeholder='Nueva contraseña (opcional)' style={{ ...inputStyle, background: 'var(--color-surface)' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleGuardarRol(emp._id)}
                          style={{ flex: 1, padding: '10px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          Guardar
                        </button>
                        <button onClick={() => { setEditando(null); setPasswordEditando(''); setEmailEditando('') }}
                          style={{ flex: 1, padding: '10px', background: 'var(--color-surface)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${emp.numeroEmpleado}`} loading="lazy" alt={`Avatar ${emp.numeroEmpleado}`}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'var(--color-bg)' }} />
                      <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>#{emp.numeroEmpleado}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.email || 'Sin email'} · {emp.equipos.length} equipo{emp.equipos.length !== 1 ? 's' : ''}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                        <span style={{
                          background: rolConfig[emp.rol]?.bg || 'var(--color-bg)',
                          color: rolConfig[emp.rol]?.color || 'var(--color-text-muted)',
                          borderRadius: '20px', padding: '2px 10px', fontSize: '10px', fontWeight: '600', flexShrink: 0
                        }}>
                          {emp.rol}
                        </span>
                        <button onClick={() => { setEditando(emp._id); setRolEditando(emp.rol); setEmailEditando(emp.email || '') }}
                          style={{ padding: '7px', background: 'rgba(75, 67, 176, 0.1)', color: '#4B43B0', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                        </button>
                        <button onClick={() => pedirConfirmacionEliminar(emp._id, emp.numeroEmpleado)}
                          style={{ padding: '7px', background: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      </div>
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