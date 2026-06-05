import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function SubirDocumento() {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('documento')
  const [archivo, setArchivo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { teamId } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!titulo || !archivo) {
      setError('El título y el archivo son obligatorios')
      return
    }

    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('descripcion', descripcion)
      formData.append('tipo', tipo)
      formData.append('archivo', archivo)

      await api.post(`/teams/${teamId}/docs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate(`/equipos/${teamId}/docs`)
    } catch (err) {
      setError('Error al subir el archivo, intenta de nuevo')
    } finally {
      setLoading(false)
    }
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
          onClick={() => navigate(`/equipos/${teamId}/docs`)}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}
        >←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
          Subir archivo
        </span>
      </div>

      {/* Formulario */}
      <div style={{ padding: '32px 24px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{
          background: '#fff', border: '0.5px solid #E2E8F0',
          borderRadius: '12px', padding: '28px'
        }}>

          {/* Título */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>
              Título *
            </label>
            <input
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder='Nombre del documento'
              style={{
                width: '100%', padding: '10px 12px',
                border: '0.5px solid #E2E8F0', borderRadius: '8px',
                fontSize: '13px', background: '#F0F4F8',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder='Descripción opcional'
              rows={3}
              style={{
                width: '100%', padding: '10px 12px',
                border: '0.5px solid #E2E8F0', borderRadius: '8px',
                fontSize: '13px', background: '#F0F4F8',
                outline: 'none', resize: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Tipo */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>
              Tipo
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['documento', 'plantilla'].map(t => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  style={{
                    flex: 1, padding: '8px',
                    border: tipo === t ? '1.5px solid #6366F1' : '0.5px solid #E2E8F0',
                    borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                    cursor: 'pointer',
                    background: tipo === t ? '#EEF2FF' : '#fff',
                    color: tipo === t ? '#4F46E5' : '#64748B'
                  }}
                >
                  {t === 'documento' ? '📄 Documento' : '📋 Plantilla'}
                </button>
              ))}
            </div>
          </div>

          {/* Archivo */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>
              Archivo *
            </label>
            <div style={{
              border: '1.5px dashed #CBD5E1', borderRadius: '8px',
              padding: '24px', textAlign: 'center', cursor: 'pointer',
              background: archivo ? '#F0FDF4' : '#F0F4F8'
            }}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id='fileInput'
                type='file'
                style={{ display: 'none' }}
                onChange={e => setArchivo(e.target.files[0])}
              />
              {archivo ? (
                <div>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>✅</div>
                  <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: '500' }}>{archivo.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    {(archivo.size / 1024).toFixed(0)} KB
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📎</div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>Clic para seleccionar archivo</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>PDF, Word, imágenes hasta 10MB</div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '0.5px solid #FECACA',
              borderRadius: '8px', padding: '10px 12px',
              fontSize: '13px', color: '#EF4444', marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? '#A5B4FC' : '#6366F1',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Subiendo...' : 'Subir archivo'}
          </button>
        </div>
      </div>
    </div>
  )
}