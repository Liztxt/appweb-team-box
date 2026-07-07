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
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState('')
  const [archivoNuevo, setArchivoNuevo] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const { teamId, docId } = useParams()
  const navigate = useNavigate()

  const esImagen = (t) => t?.startsWith('image/')
  const esPDF = (t) => t === 'application/pdf'
  const puedePrevisualizar = (t) => esImagen(t) || esPDF(t)

  const cargarPreview = async (doc) => {
    if (doc && puedePrevisualizar(doc.archivoTipo)) {
      try {
        const previewRes = await api.get(`/teams/${teamId}/docs/${docId}/preview`, {
          responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([previewRes.data], { type: doc.archivoTipo }))
        setPreviewUrl(url)
      } catch (err) {
        console.log('Error al cargar preview:', err)
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
        }
      } catch (err) {
        console.log('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()

    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl)
    }
  }, [teamId, docId])

  const handleDescargar = async () => {
    setDescargando(true)
    try {
      const res = await api.get(`/teams/${teamId}/docs/${docId}/download`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', doc.archivoNombre)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.log('Error al descargar:', err)
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
    if (!titulo.trim()) {
      setToast({ mensaje: 'El título es obligatorio', tipo: 'error' })
      return
    }
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
    border: '0.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '13px', background: '#F0F4F8',
    outline: 'none', boxSizing: 'border-box', color: '#1E293B'
  }

  const DocumentSkeleton = () => (
    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '32px', height: '32px', background: '#E2E8F0', borderRadius: '4px' }} />
        <div style={{ flex: 1, height: '14px', background: '#E2E8F0', borderRadius: '4px' }} />
      </div>
      {[100, 90, 95, 80, 85, 70, 90, 75, 100, 88, 92, 78].map((w, i) => (
        <div key={i} style={{ height: '10px', background: '#E2E8F0', borderRadius: '4px', width: `${w}%` }} />
      ))}
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
    </div>
  )

  if (!doc) return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '13px', color: '#64748B' }}>Documento no encontrado</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(null)} />}
      {confirmacion && <ConfirmModal titulo={confirmacion.titulo} mensaje={confirmacion.mensaje} onConfirmar={confirmacion.accion} onCancelar={() => setConfirmacion(null)} />}

      {/* Topbar */}
      <div style={{ height: '56px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px' }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Detalle del archivo</span>
        <button onClick={() => setEditando(!editando)}
          style={{ background: editando ? '#F0F4F8' : '#EEF2FF', color: editando ? '#64748B' : '#4F46E5', border: 'none', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
          {editando ? 'Cancelar' : '✏️ Editar'}
        </button>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>

          {/* Vista previa */}
          {!editando && (
            <div style={{ borderBottom: '0.5px solid #E2E8F0' }}>
              {puedePrevisualizar(doc.archivoTipo) && previewUrl ? (
                esImagen(doc.archivoTipo) ? (
                  <img src={previewUrl} alt={doc.titulo} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} />
                ) : (
                  <iframe src={previewUrl} title={doc.titulo} style={{ width: '100%', height: '300px', border: 'none', display: 'block' }} />
                )
              ) : (
                <div style={{ padding: '20px', background: '#F8FAFC' }}>
                  <DocumentSkeleton />
                  <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '12px', marginBottom: '0' }}>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Título *</label>
                  <input value={titulo} onChange={e => setTitulo(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Descripción</label>
                  <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3}
                    style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Tipo</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['documento', 'plantilla'].map(t => (
                      <button key={t} onClick={() => setTipo(t)}
                        style={{ flex: 1, padding: '8px', border: tipo === t ? '1.5px solid #6366F1' : '0.5px solid #E2E8F0', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', background: tipo === t ? '#EEF2FF' : '#fff', color: tipo === t ? '#4F46E5' : '#64748B' }}>
                        {t === 'documento' ? '📄 Documento' : '📋 Plantilla'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '5px' }}>Reemplazar archivo (opcional)</label>
                  <div style={{ border: '1.5px dashed #CBD5E1', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: archivoNuevo ? '#F0FDF4' : '#F8FAFC' }}
                    onClick={() => document.getElementById('fileInputEdit').click()}>
                    <input id='fileInputEdit' type='file' style={{ display: 'none' }} onChange={e => setArchivoNuevo(e.target.files[0])} />
                    {archivoNuevo ? (
                      <div>
                        <div style={{ fontSize: '16px', marginBottom: '2px' }}>✅</div>
                        <div style={{ fontSize: '12px', color: '#1E293B', fontWeight: '500' }}>{archivoNuevo.name}</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>📎</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>{doc.archivoNombre}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Clic para cambiar archivo</div>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={handleGuardar} disabled={guardando}
                  style={{ width: '100%', padding: '11px', background: guardando ? '#A5B4FC' : '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: guardando ? 'not-allowed' : 'pointer' }}>
                  {guardando ? 'Guardando...' : '💾 Guardar cambios'}
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: doc.tipo === 'plantilla' ? '#EEF2FF' : '#F0F4F8', color: doc.tipo === 'plantilla' ? '#3730A3' : '#475569', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '500' }}>
                    {doc.tipo === 'plantilla' ? 'Plantilla' : 'Documento'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {new Date(doc.creadoEn).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })} · {new Date(doc.creadoEn).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px' }}>{doc.titulo}</h2>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px', lineHeight: '1.5' }}>{doc.descripcion || 'Sin descripción'}</p>
                <div style={{ background: '#F0F4F8', borderRadius: '8px', padding: '10px 12px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>📎 {doc.archivoNombre}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleDescargar} disabled={descargando}
                    style={{ flex: 1, padding: '10px', background: descargando ? '#A5B4FC' : '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: descargando ? 'not-allowed' : 'pointer' }}>
                    {descargando ? 'Descargando...' : '⬇ Descargar'}
                  </button>
                  <button onClick={handleEliminar}
                    style={{ padding: '10px 16px', background: '#FEF2F2', color: '#EF4444', border: '0.5px solid #FECACA', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                    🗑 Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}