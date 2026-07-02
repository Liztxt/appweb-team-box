import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function DetalleDocumento() {
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [descargando, setDescargando] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const { teamId, docId } = useParams()
  const navigate = useNavigate()

  const esImagen = (tipo) => tipo?.startsWith('image/')
  const esPDF = (tipo) => tipo === 'application/pdf'
  const puedePrevisualizar = (tipo) => esImagen(tipo) || esPDF(tipo)

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/teams/${teamId}/docs`)
        const encontrado = res.data.find(d => d._id === docId)
        setDoc(encontrado)

        if (encontrado && puedePrevisualizar(encontrado.archivoTipo)) {
          const previewRes = await api.get(`/teams/${teamId}/docs/${docId}/preview`, {
            responseType: 'blob'
          })
          const url = window.URL.createObjectURL(new Blob([previewRes.data], { type: encontrado.archivoTipo }))
          setPreviewUrl(url)
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

  const handleEliminar = async () => {
    if (!confirm('¿Segura que quieres eliminar este archivo?')) return
    try {
      await api.delete(`/teams/${teamId}/docs/${docId}`)
      navigate(`/equipos/${teamId}/docs`)
    } catch (err) {
      console.log('Error al eliminar:', err)
    }
  }

  const DocumentSkeleton = () => (
    <div style={{
      background: '#F8FAFC', borderRadius: '8px', padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px'
    }}>
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
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>
          Detalle del archivo
        </span>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }}>
        <div style={{
          background: '#fff', border: '0.5px solid #E2E8F0',
          borderRadius: '12px', overflow: 'hidden'
        }}>

          {/* Vista previa */}
          <div style={{ borderBottom: '0.5px solid #E2E8F0' }}>
            {puedePrevisualizar(doc.archivoTipo) && previewUrl ? (
              esImagen(doc.archivoTipo) ? (
                <img
                  src={previewUrl}
                  alt={doc.titulo}
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title={doc.titulo}
                  style={{ width: '100%', height: '300px', border: 'none', display: 'block' }}
                />
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

          {/* Info */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: doc.tipo === 'plantilla' ? '#EEF2FF' : '#F0F4F8',
                color: doc.tipo === 'plantilla' ? '#3730A3' : '#475569',
                borderRadius: '20px', padding: '2px 10px',
                fontSize: '11px', fontWeight: '500'
              }}>
                {doc.tipo === 'plantilla' ? 'Plantilla' : 'Documento'}
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                {new Date(doc.creadoEn).toLocaleDateString('es-MX', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })} · {new Date(doc.creadoEn).toLocaleTimeString('es-MX', {
                  hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: '0 0 8px' }}>
              {doc.titulo}
            </h2>

            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px', lineHeight: '1.5' }}>
              {doc.descripcion || 'Sin descripción'}
            </p>

            <div style={{
              background: '#F0F4F8', borderRadius: '8px',
              padding: '10px 12px', marginBottom: '24px'
            }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                📎 {doc.archivoNombre}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleDescargar}
                disabled={descargando}
                style={{
                  flex: 1, padding: '10px',
                  background: descargando ? '#A5B4FC' : '#6366F1',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '500', cursor: descargando ? 'not-allowed' : 'pointer'
                }}
              >
                {descargando ? 'Descargando...' : '⬇ Descargar'}
              </button>
              <button
                onClick={handleEliminar}
                style={{
                  padding: '10px 16px',
                  background: '#FEF2F2', color: '#EF4444',
                  border: '0.5px solid #FECACA', borderRadius: '8px',
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer'
                }}
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}