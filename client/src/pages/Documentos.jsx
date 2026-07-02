import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Skeleton from '../components/Skeleton'
import api from '../api/axios'

export default function Documentos() {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [accesoDenegado, setAccesoDenegado] = useState(false)
  const [tabActivo, setTabActivo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const { teamId } = useParams()
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const fetchDocs = async () => {
    setError(false)
    setAccesoDenegado(false)
    setLoading(true)
    try {
      const res = await api.get(`/teams/${teamId}/docs`)
      setDocumentos(res.data)
    } catch (err) {
      console.log('Error al cargar documentos:', err)
      if (err.response?.status === 403) {
        setAccesoDenegado(true)
      } else {
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchDocs() }, [teamId])

  const handleLogout = () => { logout(); navigate('/login') }

  const docsFiltrados = documentos.filter(doc => {
    const coincideTipo = tabActivo === 'todos' || doc.tipo === tabActivo
    const coincideBusqueda = doc.titulo.toLowerCase().includes(busqueda.toLowerCase())
    return coincideTipo && coincideBusqueda
  })

  const conteo = {
    todos: documentos.length,
    documento: documentos.filter(d => d.tipo === 'documento').length,
    plantilla: documentos.filter(d => d.tipo === 'plantilla').length
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{ height: '56px', background: '#fff', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px' }}>
        <button onClick={() => navigate('/equipos')} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>←</button>
        <div style={{ width: '28px', height: '28px', background: '#6366F1', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px' }}>📦</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', flex: 1 }}>Team Box</span>
        <span onClick={() => navigate('/perfil')} style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer', textDecoration: 'underline' }}>
          #{usuario?.numeroEmpleado}
        </span>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '0.5px solid #E2E8F0', borderRadius: '7px', padding: '6px 12px', fontSize: '12px', color: '#64748B', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: '28px 24px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', margin: 0 }}>Documentos</h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>Archivos y plantillas de tu equipo</p>
          </div>
          <input placeholder='Buscar...' value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 12px', border: '0.5px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none', width: '160px' }} />
          <button onClick={() => navigate(`/equipos/${teamId}/docs/subir`)}
            style={{ background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            + Subir
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[{ key: 'todos', label: 'Todos' }, { key: 'documento', label: 'Documentos' }, { key: 'plantilla', label: 'Plantillas' }].map(tab => (
            <button key={tab.key} onClick={() => setTabActivo(tab.key)}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '500', cursor: 'pointer', background: tabActivo === tab.key ? '#EEF2FF' : 'transparent', color: tabActivo === tab.key ? '#4F46E5' : '#64748B' }}>
              {tab.label}
              <span style={{ marginLeft: '6px', background: tabActivo === tab.key ? '#C7D2FE' : '#E2E8F0', color: tabActivo === tab.key ? '#3730A3' : '#64748B', borderRadius: '20px', padding: '1px 7px', fontSize: '10px' }}>
                {conteo[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '80px', background: '#F0F4F8', borderBottom: '0.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Skeleton width='40px' height='40px' borderRadius='8px' />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <Skeleton width='70%' height='14px' style={{ marginBottom: '8px' }} />
                  <Skeleton width='90%' height='11px' style={{ marginBottom: '10px' }} />
                  <Skeleton width='40%' height='10px' />
                </div>
              </div>
            ))}
          </div>

          ) : accesoDenegado ? (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>No tienes acceso a este equipo</div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Solo los miembros de este equipo pueden ver su contenido.</p>
            <button onClick={() => navigate('/equipos')} style={{ padding: '10px 20px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              Volver a mis equipos
            </button>
          </div>
        ) : error ? (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '6px' }}>No se pudo cargar el contenido</div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Verifica tu conexión e intenta de nuevo.</p>
            <button onClick={fetchDocs} style={{ padding: '10px 20px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              🔄 Reintentar
            </button>
          </div>
        ) : docsFiltrados.length === 0 ? (
          <div style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#64748B' }}>No hay archivos aquí todavía</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {docsFiltrados.map(doc => (
              <div key={doc._id} onClick={() => navigate(`/equipos/${teamId}/docs/${doc._id}`)}
                style={{ background: '#fff', border: '0.5px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#C7D2FE'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: doc.tipo === 'plantilla' ? '#EEF2FF' : '#F0F4F8', borderBottom: '0.5px solid #E2E8F0' }}>
                  <span style={{ fontSize: '28px' }}>{doc.tipo === 'plantilla' ? '📋' : '📄'}</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.titulo}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.descripcion || 'Sin descripción'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: doc.tipo === 'plantilla' ? '#EEF2FF' : '#F0F4F8', color: doc.tipo === 'plantilla' ? '#3730A3' : '#475569', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '500' }}>
                      {doc.tipo === 'plantilla' ? 'Plantilla' : 'Documento'}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                      {new Date(doc.creadoEn).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}