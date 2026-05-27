import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [numeroEmpleado, setNumeroEmpleado] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', { numeroEmpleado, password })
      login(res.data.token, {
        numeroEmpleado: res.data.numeroEmpleado,
        rol: res.data.rol
      })
      navigate('/equipos')
    } catch (err) {
      setError('Número de empleado o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0F4F8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        border: '0.5px solid #E2E8F0',
        borderRadius: '14px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: '#6366F1',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <span style={{ color: '#fff', fontSize: '20px' }}>📦</span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', margin: 0 }}>
            Team Box
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Ingresa con tu número de empleado
          </p>
        </div>

        {/* Form */}
        <div onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#1E293B',
              marginBottom: '6px'
            }}>
              Número de empleado
            </label>
            <input
              type='text'
              value={numeroEmpleado}
              onChange={(e) => setNumeroEmpleado(e.target.value)}
              placeholder='Ej. 22789'
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '0.5px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#1E293B',
                background: '#F0F4F8',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#1E293B',
              marginBottom: '6px'
            }}>
              Contraseña
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '0.5px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#1E293B',
                background: '#F0F4F8',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '0.5px solid #FECACA',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '13px',
              color: '#EF4444',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              background: loading ? '#A5B4FC' : '#6366F1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </div>
    </div>
  )
}