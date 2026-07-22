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
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '480px',
        maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        border: '1px solid var(--color-border)',
        fontFamily: 'var(--font-body)'
      }}>

        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '32px', height: '32px', background: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-sm)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-dark)' }}>lock</span>
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>
              Aviso de privacidad
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
            Antes de continuar, lee y acepta nuestras políticas de confidencialidad.
          </p>
        </div>

        {/* Contenido */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: '1.6', marginBottom: '12px' }}>
            <strong>Team Box</strong> es una plataforma corporativa de gestión documental. 
            El acceso está restringido exclusivamente a empleados autorizados mediante número 
            de empleado válido.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: '1.6', marginBottom: '12px' }}>
            Al ingresar al sistema, reconoces que:
          </p>
          <ul style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.8', paddingLeft: '18px', marginBottom: '12px' }}>
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
              fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600',
              padding: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--font-body)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{expandido ? 'expand_less' : 'expand_more'}</span>
            {expandido ? 'Ocultar información adicional' : 'Ver información adicional'}
          </button>

          {expandido && (
            <div style={{
              background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)',
              padding: '14px', fontSize: '12px',
              color: 'var(--color-text-secondary)', lineHeight: '1.7'
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
          borderTop: '1px solid var(--color-border)',
          display: 'flex', gap: '8px'
        }}>
          <button
            onClick={onAceptar}
            style={{
              flex: 1, padding: '11px',
              background: 'var(--color-primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'var(--font-body)'
            }}
          >
            Entendido, continuar
          </button>
        </div>

      </div>
    </div>
  )
}