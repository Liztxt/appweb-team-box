import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [exitoso, setExitoso] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const handleSubmit = async () => {
    if (!password || !confirmar) { setError('Completa todos los campos'); return }
    if (password !== confirmar) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 8) { setError('Mínimo 8 caracteres'); return }
    if (!/[A-Z]/.test(password)) { setError('Debe contener al menos una mayúscula'); return }
    if (!/[0-9]/.test(password)) { setError('Debe contener al menos un número'); return }

    setError('')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, passwordNueva: password })
      setExitoso(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Token inválido o expirado')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
      <div style={{ textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-error)', marginBottom: '12px', display: 'block' }}>error</span>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Enlace inválido</p>
        <button onClick={() => navigate('/login')} style={{ marginTop: '12px', padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Volver al login
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-md)' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--color-topbar-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', padding: '6px' }}>
            <img src="/logo_pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 6px' }}>Nueva contraseña</h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>Elige una contraseña segura</p>
        </div>

        {exitoso ? (
          <div style={{ textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-success)', marginBottom: '12px', display: 'block' }}>check_circle</span>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Contraseña actualizada</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <button onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '11px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Ir al login
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Nueva contraseña</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Mínimo 8 caracteres, 1 mayúscula y 1 número'
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', outline: 'none', boxSizing: 'border-box', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Confirmar contraseña</label>
              <input type='password' value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder='Repite la contraseña'
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', outline: 'none', boxSizing: 'border-box', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }} />
            </div>

            {error && (
              <div style={{ background: 'var(--color-error-bg)', border: '1px solid var(--color-error-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: '13px', color: 'var(--color-error)', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '11px', background: loading ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}