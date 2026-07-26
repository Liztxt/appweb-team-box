import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Toast from '../components/Toast'

export default function SubirDocumento() {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('documento')
  const [archivo, setArchivo] = useState(null)
  const [texto, setTexto] = useState('')
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [tipoToast, setTipoToast] = useState('error')
  const { teamId } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const mostrarError = (msg) => {
    setTipoToast('error')
    setToast(msg)
  }

  const handleFotos = (e) => {
    const archivos = Array.from(e.target.files)
    if (archivos.length > 4) {
      mostrarError('Máximo 4 fotos permitidas')
      return
    }
    setFotos(archivos)
    setToast('')
  }

  const handleSubmit = async () => {
    if (!titulo) { mostrarError('El título es obligatorio'); return }
    if (tipo === 'documento' && !archivo) { mostrarError('El archivo es obligatorio'); return }

    setToast('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('descripcion', descripcion)
      formData.append('tipo', tipo)

      if (tipo === 'documento') {
        formData.append('archivo', archivo)
      } else {
        formData.append('texto', texto)
        fotos.forEach(foto => formData.append('fotos', foto))
      }

      await api.post(`/teams/${teamId}/docs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate(`/equipos/${teamId}/docs`)
    } catch (err) {
      mostrarError(err.response?.data?.error || 'Error al subir, intenta de nuevo')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', background: 'var(--color-bg)',
    outline: 'none', boxSizing: 'border-box', color: 'var(--color-text)',
    fontFamily: 'var(--font-body)'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      {toast && <Toast mensaje={toast} tipo={tipoToast} onClose={() => setToast('')} />}

      <div style={{ height: '92px', background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => navigate(`/equipos/${teamId}/docs`)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)' }}>Subir archivo</span>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>

          {/* Tipo */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Tipo</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { value: 'documento', label: 'Documento', icon: 'description' },
                { value: 'reporte', label: 'Reporte', icon: 'assignment' }
              ].map(t => (
                <button key={t.value} onClick={() => setTipo(t.value)}
                  style={{ flex: 1, padding: '8px', border: tipo === t.value ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: tipo === t.value ? 'var(--color-primary-light)' : 'var(--color-surface)', color: tipo === t.value ? 'var(--color-primary-dark)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-body)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Título *</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder='Nombre del documento' style={inputStyle} />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Descripción</label>
            <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder='Descripción opcional' style={inputStyle} />
          </div>

          {tipo === 'documento' ? (
            /* Archivo para documento normal */
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Archivo *</label>
              <div style={{ border: `1.5px dashed ${archivo ? 'var(--color-success)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-sm)', padding: '24px', textAlign: 'center', cursor: 'pointer', background: archivo ? 'var(--color-success-bg)' : 'var(--color-bg)' }}
                onClick={() => document.getElementById('fileInput').click()}>
                <input id='fileInput' type='file' style={{ display: 'none' }} onChange={e => setArchivo(e.target.files[0])} />
                {archivo ? (
                  <div>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-success)', marginBottom: '4px' }}>check_circle</span>
                    <div style={{ fontSize: '13px', color: 'var(--color-text)', fontWeight: '600' }}>{archivo.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{(archivo.size / 1024).toFixed(0)} KB</div>
                  </div>
                ) : (
                  <div>
                    <span className="material-symbols-outlined" style={{ fontSize: '26px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>attach_file</span>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Clic para seleccionar archivo</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>PDF, Word, imágenes hasta 10MB</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Campos de reporte */
            <>
              {/* Autor automático */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Autor</label>
                <div style={{ ...inputStyle, background: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>#{usuario?.numeroEmpleado}</div>
              </div>

              {/* Texto */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Notas / Descripción</label>
                <textarea value={texto} onChange={e => setTexto(e.target.value)} placeholder='Escribe el contenido del reporte...' rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Fotos */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '6px' }}>Fotos (máx. 4, opcional)</label>
                <div style={{ border: `1.5px dashed ${fotos.length > 0 ? 'var(--color-success)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-sm)', padding: '20px', textAlign: 'center', cursor: 'pointer', background: fotos.length > 0 ? 'var(--color-success-bg)' : 'var(--color-bg)' }}
                  onClick={() => document.getElementById('fotosInput').click()}>
                  <input id='fotosInput' type='file' accept='image/*' multiple style={{ display: 'none' }} onChange={handleFotos} />
                  {fotos.length > 0 ? (
                    <div>
                      <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-success)', marginBottom: '4px' }}>check_circle</span>
                      <div style={{ fontSize: '13px', color: 'var(--color-text)', fontWeight: '600' }}>{fotos.length} foto{fotos.length !== 1 ? 's' : ''} seleccionada{fotos.length !== 1 ? 's' : ''}</div>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                        {fotos.map((f, i) => (
                          <div key={i} style={{ fontSize: '11px', color: 'var(--color-text-secondary)', background: 'var(--color-border)', borderRadius: '4px', padding: '2px 6px' }}>{f.name}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="material-symbols-outlined" style={{ fontSize: '26px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>add_a_photo</span>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Clic para agregar fotos</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>JPG, PNG hasta 10MB cada una</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '11px', background: loading ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
            {loading ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  )
}