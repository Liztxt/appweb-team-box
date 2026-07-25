import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

export default function DetalleDocumento() {
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [descargando, setDescargando] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fotoUrls, setFotoUrls] = useState([])
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('')
  const [archivoNuevo, setArchivoNuevo] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [fotoAmpliada, setFotoAmpliada] = useState(null)
  const { teamId, docId } = useParams()
  const navigate = useNavigate()

  const esImagen = (t) => t?.startsWith('image/')
  const esPDF = (t) => t === 'application/pdf'
  const puedePrevisualizar = (t) => esImagen(t) || esPDF(t)

  const cargarPreview = async (doc) => {
    if (doc && puedePrevisualizar(doc.archivoTipo)) {
      try {
        const previewRes = await api.get(`/teams/${teamId}/docs/${docId}/preview`, { responseType: 'blob' })
        const url = window.URL.createObjectURL(new Blob([previewRes.data], { type: doc.archivoTipo }))
        setPreviewUrl(url)
      } catch (err) {
        console.log('Error al cargar preview:', err)
      }
    }
  }

  const cargarFotos = async (doc) => {
    if (doc?.tipo === 'reporte' && doc?.fotos?.length > 0) {
      try {
        const urls = await Promise.all(
          doc.fotos.map(async (foto, i) => {
            const res = await api.get(`/teams/${teamId}/docs/${docId}/foto/${i}`, { responseType: 'blob' })
            return window.URL.createObjectURL(new Blob([res.data], { type: foto.tipo || 'image/jpeg' }))
          })
        )
        setFotoUrls(urls)
      } catch (err) {
        console.log('Error al cargar fotos:', err)
      }
    }
  }

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/teams/${teamId}/docs`)
        const encontrado = res.data.find(d => d._id === docId)
        setDoc(encontrado)
        if (encontrado) {
          setTitulo(encontrado.titulo)
          setDescripcion(encontrado.descripcion || '')
          setTipo(encontrado.tipo)
          await cargarPreview(encontrado)
          await cargarFotos(encontrado)
        }
      } catch (err) {
        console.log('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [teamId, docId])

  const handleDescargar = async () => {
  setDescargando(true)
  try {
    const res = await api.get(`/teams/${teamId}/docs/${docId}/download`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', doc.archivoNombre)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    setToast({ mensaje: 'Error al descargar el archivo', tipo: 'error' })
  } finally {
    setDescargando(false)
  }
}

  const handleEliminar = () => {
    setConfirmacion({
      titulo: 'Eliminar documento',
      mensaje: `¿Segura que quieres eliminar "${doc.titulo}"? Esta acción no se puede deshacer.`,
      accion: async () => {
        try {
          await api.delete(`/teams/${teamId}/docs/${docId}`)
          navigate(`/equipos/${teamId}/docs`)
        } catch (err) {
          setToast({ mensaje: 'Error al eliminar documento', tipo: 'error' })
        } finally {
          setConfirmacion(null)
        }
      }
    })
  }

  const handleGuardar = async () => {
    if (!titulo.trim()) { setToast({ mensaje: 'El título es obligatorio', tipo: 'error' }); return }
    setGuardando(true)
    try {
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('descripcion', descripcion)
      formData.append('tipo', tipo)
      if (archivoNuevo) formData.append('archivo', archivoNuevo)

      const res = await api.put(`/teams/${teamId}/docs/${docId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setDoc({ ...doc, ...res.data })
      setArchivoNuevo(null)
      setEditando(false)
      setToast({ mensaje: 'Documento actualizado correctamente', tipo: 'exito' })

      if (archivoNuevo) {
        setPreviewUrl(null)
        await cargarPreview({ ...doc, ...res.data, archivoTipo: archivoNuevo.type })
      }
    } catch (err) {
      setToast({ mensaje: err.response?.data?.error || 'Error al guardar', tipo: 'error' })
    } finally {
      setGuardando(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
    fontSize: '13px', background: 'var(--color-bg)',
    outline: 'none', boxSizing: 'border-box', color: 'var(--color-text)',
    fontFamily: 'var(--font-body)'
  }

  const DocumentSkeleton = () => (
    <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--color-border)', borderRadius: '4px' }} />
        <div style={{ flex: 1, height: '14px', background: 'var(--color-border)', borderRadius: '4px' }} />
      </div>
      {[100, 90, 95, 80, 85, 70, 90, 75, 100, 88, 92, 78].map((w, i) => (
        <div key={i} style={{ height: '10px', background: 'var(--color-border)', borderRadius: '4px', width: `${w}%` }} />
      ))}
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
    </div>
  )

  if (!doc) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Documento no encontrado</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {confirmacion && <ConfirmModal titulo={confirmacion.titulo} mensaje={confirmacion.mensaje} onConfirmar={confirmacion.accion} onCancelar={() => setConfirmacion(null)} />}

      {fotoAmpliada && (
        <div
          onClick={() => setFotoAmpliada(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '24px', cursor: 'pointer'
          }}
        >
          <button
            onClick={() => setFotoAmpliada(null)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
          </button>
          <img
            src={fotoAmpliada}
            alt='Foto ampliada'
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 'var(--radius-md)', objectFit: 'contain', cursor: 'default' }}
          />
        </div>
      )}

      <div style={{ height: '92px', background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)', flex: 1 }}>Detalle del archivo</span>
        {doc.tipo !== 'reporte' && (
          <button onClick={() => setEditando(!editando)}
            style={{ background: editando ? 'rgba(255,255,255,0.12)' : 'var(--color-accent)', color: editando ? 'var(--color-topbar-text)' : 'var(--color-topbar-bg)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{editando ? 'close' : 'edit'}</span>
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        )}
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }}>

        {doc.tipo === 'reporte' ? (
          /* Vista de Reporte */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Header reporte */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>assignment</span>
                  Reporte
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {new Date(doc.creadoEn).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })} · {new Date(doc.creadoEn).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 8px' }}>{doc.titulo}</h2>
              {doc.descripcion && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '0 0 12px' }}>{doc.descripcion}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${doc.autor}`} loading="lazy" alt=''
                  style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-bg)' }} />
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Autor: #{doc.autor}</span>
              </div>
            </div>

            {/* Texto del reporte */}
            {doc.texto && (
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '10px' }}>Notas</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>{doc.texto}</p>
              </div>
            )}

            {/* Fotos */}
            {fotoUrls.length > 0 && (
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px' }}>Fotos ({fotoUrls.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {fotoUrls.map((url, i) => (
                    <img key={i} src={url} alt={`Foto ${i + 1}`} loading="lazy"
                      style={{ width: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'cover', aspectRatio: '1', cursor: 'pointer' }}
                      onClick={() => setFotoAmpliada(url)} />
                  ))}
                </div>
              </div>
            )}

            {/* Botón eliminar */}
            <button onClick={handleEliminar}
              style={{ width: '100%', padding: '10px 16px', background: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
              Eliminar reporte
            </button>
          </div>

        ) : (
          /* Vista de Documento normal */
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>

            {!editando && (
              <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                {puedePrevisualizar(doc.archivoTipo) && previewUrl ? (
                  esImagen(doc.archivoTipo) ? (
                    <img src={previewUrl} alt={doc.titulo} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <iframe src={previewUrl} title={doc.titulo} style={{ width: '100%', height: '300px', border: 'none', display: 'block' }} />
                  )
                ) : (
                  <div style={{ padding: '20px', background: 'var(--color-bg)' }}>
                    <DocumentSkeleton />
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '12px', marginBottom: '0' }}>
                      Vista previa no disponible — descarga el archivo para verlo
                    </p>
                  </div>
                )}
              </div>
            )}

            <div style={{ padding: '24px' }}>
              {editando ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Título *</label>
                    <input value={titulo} onChange={e => setTitulo(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Descripción</label>
                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '5px' }}>Reemplazar archivo (opcional)</label>
                    <div style={{ border: `1.5px dashed ${archivoNuevo ? 'var(--color-success)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-sm)', padding: '16px', textAlign: 'center', cursor: 'pointer', background: archivoNuevo ? 'var(--color-success-bg)' : 'var(--color-bg)' }}
                      onClick={() => document.getElementById('fileInputEdit').click()}>
                      <input id='fileInputEdit' type='file' style={{ display: 'none' }} onChange={e => setArchivoNuevo(e.target.files[0])} />
                      {archivoNuevo ? (
                        <div>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-success)', marginBottom: '2px' }}>check_circle</span>
                          <div style={{ fontSize: '12px', color: 'var(--color-text)', fontWeight: '600' }}>{archivoNuevo.name}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>attach_file</span>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{doc.archivoNombre}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Clic para cambiar archivo</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={handleGuardar} disabled={guardando}
                    style={{ width: '100%', padding: '11px', background: guardando ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: guardando ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '600' }}>
                      Documento
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {new Date(doc.creadoEn).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })} · {new Date(doc.creadoEn).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 8px' }}>{doc.titulo}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '0 0 16px', lineHeight: '1.5' }}>{doc.descripcion || 'Sin descripción'}</p>
                  <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>attach_file</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{doc.archivoNombre}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleDescargar} disabled={descargando}
                      style={{ flex: 1, padding: '10px', background: descargando ? 'var(--color-gray)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: descargando ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                      {descargando ? 'Descargando...' : 'Descargar'}
                    </button>
                    <button onClick={handleEliminar}
                      style={{ padding: '10px 16px', background: 'var(--color-error-bg)', color: 'var(--color-error)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}