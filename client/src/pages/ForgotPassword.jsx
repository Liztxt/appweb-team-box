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
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-md)' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--color-topbar-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', padding: '6px' }}>
            <img src="/logo-pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 6px' }}>Recuperar contraseña</h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>Ingresa tu email y te enviaremos un enlace</p>
        </div>

        {enviado ? (
          <div style={{ textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-primary)', marginBottom: '12px', display: 'block' }}>mark_email_read</span>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '8px' }}>Revisa tu correo</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Si el email está registrado, recibirás un enlace para restablecer tu contraseña.</p>
            <button onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '11px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Volver al login
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Email</label>
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='correo@empresa.com'
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-bg)', outline: 'none', boxSizing: 'border-box', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
              />
            </div>

            {error && (
              <div style={{ background: 'var(--color-error-bg)', border: '1px solid var(--color-error-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: '13px', color: 'var(--color-error)', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '11px', background: loading ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>

            <button onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '11px', background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  )
}