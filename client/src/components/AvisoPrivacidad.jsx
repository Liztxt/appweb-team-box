import { useState } from 'react'

export default function AvisoPrivacidad({ onAceptar }) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '14px',
        width: '100%', maxWidth: '480px',
        maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        border: '0.5px solid #E2E8F0'
      }}>

        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '0.5px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '32px', height: '32px', background: '#EEF2FF',
              borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>🔒</div>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B', margin: 0 }}>
              Aviso de privacidad
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
            Antes de continuar, lee y acepta nuestras políticas de confidencialidad.
          </p>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <p style={{ fontSize: '13px', color: '#1E293B', lineHeight: '1.6', marginBottom: '12px' }}>
            <strong>Team Box</strong> es una plataforma corporativa de gestión documental. 
            El acceso está restringido exclusivamente a empleados autorizados mediante número 
            de empleado válido.
          </p>
          <p style={{ fontSize: '13px', color: '#1E293B', lineHeight: '1.6', marginBottom: '12px' }}>
            Al ingresar al sistema, reconoces que:
          </p>
          <ul style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8', paddingLeft: '18px', marginBottom: '12px' }}>
            <li>Los documentos y plantillas aquí almacenados son <strong>confidenciales</strong>.</li>
            <li>El acceso no autorizado está <strong>estrictamente prohibido</strong>.</li>
            <li>Tus actividades dentro del sistema pueden ser <strong>registradas y auditadas</strong>.</li>
            <li>Está prohibido compartir credenciales de acceso con terceros.</li>
          </ul>

          {/* Expandible */}
          <button
            onClick={() => setExpandido(!expandido)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '12px', color: '#6366F1', fontWeight: '500',
              padding: 0, marginBottom: '8px'
            }}
          >
            {expandido ? '▲ Ocultar información adicional' : '▼ Ver información adicional'}
          </button>

          {expandido && (
            <div style={{
              background: '#F0F4F8', borderRadius: '8px',
              padding: '14px', fontSize: '12px',
              color: '#475569', lineHeight: '1.7'
            }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>Protección de datos personales:</strong> La información personal 
                de los empleados registrados en este sistema es tratada conforme a las 
                leyes aplicables de protección de datos. Solo el personal administrativo 
                autorizado tiene acceso a dicha información.
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>Confidencialidad:</strong> Toda la información contenida en este 
                sistema es propiedad de la organización y tiene carácter confidencial. 
                Su divulgación no autorizada puede tener consecuencias legales.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Seguridad:</strong> Las comunicaciones entre tu dispositivo y 
                el servidor están protegidas mediante cifrado HTTPS/TLS. Las contraseñas 
                se almacenan con cifrado bcrypt y nunca en texto plano.
              </p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div style={{
          padding: '16px 24px',
          borderTop: '0.5px solid #E2E8F0',
          display: 'flex', gap: '8px'
        }}>
          <button
            onClick={onAceptar}
            style={{
              flex: 1, padding: '11px',
              background: '#6366F1', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer'
            }}
          >
            Entendido, continuar
          </button>
        </div>

      </div>
    </div>
  )
}