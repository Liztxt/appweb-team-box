import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!email) { setError('El email es obligatorio'); return }
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setEnviado(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el correo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', background: '#6366F1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px' }}>📦</div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', margin: '0 0 6px' }}>Recuperar contraseña</h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Ingresa tu email y te enviaremos un enlace</p>
        </div>

        {enviado ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📧</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Revisa tu correo</div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Si el email está registrado, recibirás un enlace para restablecer tu contraseña.</p>
            <button onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '11px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              Volver al login
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>Email</label>
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='correo@empresa.com'
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '10px 12px', border: '0.5px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#F0F4F8', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#EF4444', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '11px', background: loading ? '#A5B4FC' : '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>

            <button onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '11px', background: 'transparent', color: '#64748B', border: '0.5px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              ← Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  )
}