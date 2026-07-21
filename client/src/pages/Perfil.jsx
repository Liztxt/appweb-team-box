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
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', color: 'var(--color-text)',
    background: 'var(--color-bg)', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)'
  }

  const rolInfo = {
    admin: { label: 'Administrador', icon: 'shield' },
    manager: { label: 'Manager', icon: 'manage_accounts' },
    empleado: { label: 'Empleado', icon: 'person' }
  }
  const rolActual = rolInfo[usuario?.rol] || rolInfo.empleado

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>

      {/* Topbar */}
      <div style={{
        height: '64px', background: 'var(--color-topbar-bg)',
        borderBottom: '1px solid var(--color-topbar-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)', flex: 1 }}>
          Mi perfil
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent', border: '1px solid var(--color-topbar-border)',
            borderRadius: 'var(--radius-sm)', padding: '6px 12px',
            fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer'
          }}
        >Cerrar sesión</button>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Card datos */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <img
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${usuario?.numeroEmpleado}`}
              alt='Avatar'
              loading="lazy"
              style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--color-bg)' }}
            />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
                Empleado #{usuario?.numeroEmpleado}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{rolActual.icon}</span>
                {rolActual.label}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Número de empleado</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>#{usuario?.numeroEmpleado}</div>
            </div>
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Rol en el sistema</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>{rolActual.label}</div>
            </div>
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Estado de la cuenta</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>Activa</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card cambiar contraseña */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '16px' }}>
            Cambiar contraseña
          </h2>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>
              Contraseña actual
            </label>
            <input type='password' value={passwordActual} onChange={e => setPasswordActual(e.target.value)} placeholder='••••••••' style={inputStyle} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>
              Nueva contraseña
            </label>
            <input type='password' value={passwordNueva} onChange={e => setPasswordNueva(e.target.value)} placeholder='Mínimo 8 caracteres' style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>
              Confirmar nueva contraseña
            </label>
            <input type='password' value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder='Repite la nueva contraseña' style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: 'var(--color-error-bg)', border: '1px solid var(--color-error-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: '12px', color: 'var(--color-error)', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          {exito && (
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: '12px', color: 'var(--color-success)', marginBottom: '12px' }}>
              {exito}
            </div>
          )}

          <button
            onClick={handleCambiarPassword}
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? 'var(--color-gray)' : 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '13px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)'
            }}
          >
            {loading ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </div>
      </div>
    </div>
  )
}