import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function VerDocumentos() {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/documentos').then(res => {
      setDocumentos(res.data)
      setLoading(false)
    })
  }, [])

  const documentosFiltrados = documentos.filter(doc =>
    doc.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    doc.archivoNombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      <div style={{
        height: '56px', background: '#fff',
        borderBottom: '0.5px solid #E2E8F0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: '12px'
      }}>
        <button onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Todos los documentos</span>
        <input
          placeholder='Buscar documento...'
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            padding: '7px 12px', border: '0.5px solid #E2E8F0',
            borderRadius: '8px', fontSize: '12px', background: '#F0F4F8',
            outline: 'none', width: '180px'
          }}
        />
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : documentosFiltrados.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>No se encontraron documentos</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documentosFiltrados.map(doc => (
              <div key={doc._id}
                onClick={() => navigate(`/equipos/${doc.equipoId}/docs/${doc._id}`)}
                style={{
                  background: '#fff', border: '0.5px solid #E2E8F0',
                  borderRadius: '10px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                <div style={{
                  width: '36px', height: '36px',
                  background: doc.tipo === 'plantilla' ? '#EEF2FF' : '#F0F4F8',
                  borderRadius: '8px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0
                }}>
                  {doc.tipo === 'plantilla' ? '📋' : '📄'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B' }}>{doc.titulo}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{doc.archivoNombre}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    background: doc.tipo === 'plantilla' ? '#EEF2FF' : '#F0F4F8',
                    color: doc.tipo === 'plantilla' ? '#3730A3' : '#475569',
                    borderRadius: '20px', padding: '2px 8px',
                    fontSize: '10px', fontWeight: '500'
                  }}>
                    {doc.tipo}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {new Date(doc.creadoEn).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}