import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Perfil() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCambiarPassword = async () => {
    setError('')
    setExito('')

    if (!passwordActual || !passwordNueva || !passwordConfirm) {
      setError('Todos los campos son obligatorios')
      return
    }
    if (passwordNueva !== passwordConfirm) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }
    if (passwordNueva.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      await api.put('/auth/change-password', { passwordActual, passwordNueva })
      setExito('Contraseña actualizada correctamente')
      setPasswordActual('')
      setPasswordNueva('')
      setPasswordConfirm('')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
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
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}
        >←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>
          Mi perfil
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', border: '0.5px solid #E2E8F0',
            borderRadius: '7px', padding: '6px 12px',
            fontSize: '12px', color: '#64748B', cursor: 'pointer'
          }}
        >Cerrar sesión</button>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Card datos */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${usuario?.numeroEmpleado}`}
              alt='Avatar'
              style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F0F4F8' }}
            />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>
                Empleado #{usuario?.numeroEmpleado}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                {usuario?.rol === 'admin' ? '⚙️ Administrador' : '👤 Empleado'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#F0F4F8', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Número de empleado</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B' }}>#{usuario?.numeroEmpleado}</div>
            </div>
            <div style={{ background: '#F0F4F8', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Rol en el sistema</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B' }}>
                {usuario?.rol === 'admin' ? 'Administrador' : 'Empleado'}
              </div>
            </div>
            <div style={{ background: '#F0F4F8', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Estado de la cuenta</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B' }}>Activa</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card cambiar contraseña */}
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
            Cambiar contraseña
          </h2>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>
              Contraseña actual
            </label>
            <input type='password' value={passwordActual} onChange={e => setPasswordActual(e.target.value)} placeholder='••••••••' style={inputStyle} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>
              Nueva contraseña
            </label>
            <input type='password' value={passwordNueva} onChange={e => setPasswordNueva(e.target.value)} placeholder='Mínimo 8 caracteres' style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>
              Confirmar nueva contraseña
            </label>
            <input type='password' value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder='Repite la nueva contraseña' style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#EF4444', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          {exito && (
            <div style={{ background: '#F0FDF4', border: '0.5px solid #BBF7D0', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#15803D', marginBottom: '12px' }}>
              {exito}
            </div>
          )}

          <button
            onClick={handleCambiarPassword}
            disabled={loading}
            style={{
              width: '100%', padding: '10px',
              background: loading ? '#A5B4FC' : '#6366F1',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </div>
      </div>
    </div>
  )
}