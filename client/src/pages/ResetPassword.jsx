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
    <div style={{ minHeight: '100vh', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>❌</div>
        <p style={{ fontSize: '13px', color: '#64748B' }}>Enlace inválido</p>
        <button onClick={() => navigate('/login')} style={{ marginTop: '12px', padding: '10px 20px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
          Volver al login
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', background: '#6366F1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px' }}>📦</div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', margin: '0 0 6px' }}>Nueva contraseña</h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Elige una contraseña segura</p>
        </div>

        {exitoso ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Contraseña actualizada</div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <button onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '11px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              Ir al login
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>Nueva contraseña</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Mínimo 8 caracteres, 1 mayúscula y 1 número'
                style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#F0F4F8', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>Confirmar contraseña</label>
              <input type='password' value={confirmar} onChange={e => setConfirmar(e.target.value)} placeholder='Repite la contraseña'
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#F0F4F8', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#EF4444', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '11px', background: loading ? '#A5B4FC' : '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}