import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function VerDocumentos() {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/documentos').then(res => {
      setDocumentos(res.data)
      setLoading(false)
    })
  }, [])

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
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Todos los documentos</span>
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: '#64748B' }}>Cargando...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documentos.map(doc => (
              <div key={doc._id} style={{
                background: '#fff', border: '0.5px solid #E2E8F0',
                borderRadius: '10px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
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