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
      if (err.response?.status === 403) setAccesoDenegado(true)
      else setError(true)
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
    reporte: documentos.filter(d => d.tipo === 'reporte').length
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>

      {/* Topbar */}
<div style={{ height: '64px', background: 'var(--color-topbar-bg)', borderBottom: '1px solid var(--color-topbar-border)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', boxShadow: 'var(--shadow-sm)' }}>
  <button onClick={() => navigate('/equipos')}
    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-topbar-text)', display: 'flex', alignItems: 'center' }}>
    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
  </button>
  <div onClick={() => navigate('/equipos')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}>
    <div style={{ width: '30px', height: '30px', background: 'var(--color-accent)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/logo_pyasa.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
</div>
    <span style={{
  fontFamily: 'var(--font-logo)',
  fontStyle: 'italic',
  fontWeight: 800,
  fontSize: '17px',
  letterSpacing: '-0.02em',
  color: 'var(--color-topbar-text)'
}}>Team Box</span>
  </div>
  <span onClick={() => navigate('/perfil')} style={{ fontSize: '12px', color: 'var(--color-topbar-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}>
    #{usuario?.numeroEmpleado}
  </span>
  <button onClick={handleLogout}
    style={{ background: 'transparent', border: '1px solid var(--color-topbar-border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '12px', color: 'var(--color-topbar-text)', cursor: 'pointer' }}>
    Salir
  </button>
</div>

      <div style={{ padding: '28px 24px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Documentos</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Archivos y reportes de tu equipo</p>
          </div>
          <input placeholder='Buscar...' value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', background: 'var(--color-surface)', color: 'var(--color-text)', width: '160px', fontFamily: 'var(--font-body)' }} />
          <button onClick={() => navigate(`/equipos/${teamId}/docs/subir`)}
            style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload</span>
            Subir
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'documento', label: 'Documentos' },
            { key: 'reporte', label: 'Reportes' }
          ].map(tab => (
            <button key={tab.key} onClick={() => setTabActivo(tab.key)}
              style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: tabActivo === tab.key ? 'var(--color-primary-light)' : 'transparent', color: tabActivo === tab.key ? 'var(--color-primary-dark)' : 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {tab.label}
              <span style={{ marginLeft: '6px', background: tabActivo === tab.key ? 'var(--color-primary)' : 'var(--color-border)', color: tabActivo === tab.key ? '#fff' : 'var(--color-text-muted)', borderRadius: '20px', padding: '1px 7px', fontSize: '10px' }}>
                {conteo[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ height: '80px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-gray)', marginBottom: '12px', display: 'block' }}>lock</span>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>No tienes acceso a este equipo</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Solo los miembros de este equipo pueden ver su contenido.</p>
            <button onClick={() => navigate('/equipos')}
              style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Volver a mis equipos
            </button>
          </div>
        ) : error ? (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '40px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-gray)', marginBottom: '12px', display: 'block' }}>wifi_off</span>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>No se pudo cargar el contenido</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Verifica tu conexión e intenta de nuevo.</p>
            <button onClick={fetchDocs}
              style={{ padding: '10px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        ) : docsFiltrados.length === 0 ? (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '40px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-gray)', marginBottom: '12px', display: 'block' }}>folder_open</span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No hay archivos aquí todavía</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {docsFiltrados.map(doc => (
              <div key={doc._id} onClick={() => navigate(`/equipos/${teamId}/docs/${doc._id}`)}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.15s ease, border-color 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: doc.tipo === 'reporte' ? 'var(--color-primary-light)' : 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: doc.tipo === 'reporte' ? 'var(--color-primary-dark)' : 'var(--color-gray)' }}>
                    {doc.tipo === 'reporte' ? 'assignment' : 'description'}
                  </span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.titulo}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.tipo === 'reporte' ? `Por #${doc.autor}` : doc.descripcion || 'Sin descripción'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: doc.tipo === 'reporte' ? 'var(--color-primary-light)' : 'var(--color-bg)', color: doc.tipo === 'reporte' ? 'var(--color-primary-dark)' : 'var(--color-text-muted)', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '600' }}>
                      {doc.tipo === 'reporte' ? 'Reporte' : 'Documento'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
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