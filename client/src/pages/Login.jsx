import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AvisoPrivacidad from '../components/AvisoPrivacidad'
import api from '../api/axios'

export default function Login() {
  const [numeroEmpleado, setNumeroEmpleado] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mostrarAviso, setMostrarAviso] = useState(!localStorage.getItem('avisoAceptado'))
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { numeroEmpleado, password })
      login(res.data.token, { id: res.data.id, numeroEmpleado: res.data.numeroEmpleado, rol: res.data.rol })
      navigate(res.data.rol === 'admin' ? '/admin' : res.data.rol === 'manager' ? '/manager' : '/equipos')
    } catch (err) {
      setError('Número de empleado o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {mostrarAviso && (
        <AvisoPrivacidad onAceptar={() => {
          localStorage.setItem('avisoAceptado', 'true')
          setMostrarAviso(false)
        }} />
      )}

      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
<div style={{ textAlign: 'center', marginBottom: '32px' }}>
  <div style={{
    width: '64px', height: '64px',
    background: 'var(--color-topbar-bg)',
    borderRadius: 'var(--radius-md)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px', padding: '8px',
    boxShadow: 'var(--shadow-md)'
  }}>
    <img src="/logo_pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
  </div>
  <h1 style={{ fontFamily: 'var(--font-logo)', fontStyle: 'italic', fontWeight: 800, fontSize: '26px', color: 'var(--color-text)', marginBottom: '4px', letterSpacing: '-0.02em' }}>Team Box</h1>
  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Ingresa con tu número de empleado</p>
</div>

        {/* Card */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>
              Número de empleado
            </label>
            <input
              type='text'
              value={numeroEmpleado}
              onChange={e => setNumeroEmpleado(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder='Ej. 13560'
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder='••••••••'
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', background: 'var(--color-bg)', color: 'var(--color-text)', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: 'var(--color-error-bg)', border: '1px solid #FFCDD2', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: '13px', color: 'var(--color-error)', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '10px' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <button onClick={() => navigate('/forgot-password')}
            style={{ width: '100%', padding: '10px', background: 'transparent', color: 'var(--color-text-muted)', border: 'none', fontSize: '13px', cursor: 'pointer' }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  )
}