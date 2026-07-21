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
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}>
      <div style={{
        height: '64px', background: 'var(--color-topbar-bg)',
        borderBottom: '1px solid var(--color-topbar-border)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)'
      }}>
        <button onClick={() => navigate('/admin')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-topbar-text)', flex: 1 }}>Todos los documentos</span>
        <input
          placeholder='Buscar documento...'
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            padding: '7px 12px', border: 'none',
            borderRadius: '20px', fontSize: '12px', background: 'rgba(255,255,255,0.12)',
            color: 'var(--color-topbar-text)', outline: 'none', width: '180px',
            fontFamily: 'var(--font-body)'
          }}
        />
      </div>

      <div style={{ padding: '28px 24px', maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cargando...</p>
        ) : documentosFiltrados.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No se encontraron documentos</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {documentosFiltrados.map(doc => (
              <div key={doc._id}
                onClick={() => navigate(`/equipos/${doc.equipoId}/docs/${doc._id}`)}
                style={{
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  cursor: 'pointer', transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <div style={{
                  width: '36px', height: '36px',
                  background: doc.tipo === 'plantilla' ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  borderRadius: 'var(--radius-sm)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: doc.tipo === 'plantilla' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)' }}>
                    {doc.tipo === 'plantilla' ? 'assignment' : 'description'}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>{doc.titulo}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{doc.archivoNombre}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{
                    background: doc.tipo === 'plantilla' ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    color: doc.tipo === 'plantilla' ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                    borderRadius: '20px', padding: '2px 8px',
                    fontSize: '10px', fontWeight: '600'
                  }}>
                    {doc.tipo}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
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