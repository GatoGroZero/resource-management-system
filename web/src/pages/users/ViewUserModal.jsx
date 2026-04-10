function ViewUserModal({ user, onClose }) {
    if (!user) return null
  
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={headerStyle}>
            <div>
              <h2 style={titleStyle}>Detalle de Usuario</h2>
              <p style={subtitleStyle}>Información registrada del usuario</p>
            </div>
  
            <button type="button" onClick={onClose} style={closeButtonStyle}>
              ✕
            </button>
          </div>
  
          <div style={contentStyle}>
            <Section title="Información personal">
              <div style={gridStyle}>
                <Info label="Nombre" value={user.name} />
                <Info label="Apellidos" value={user.lastName} />
                <Info label="Fecha de nacimiento" value={user.birthDate || '—'} />
                <Info label="Rol" value={formatRole(user.role)} />
              </div>
            </Section>

            <Section title="Información institucional">
              <div style={gridStyle}>
                <Info label="Tipo de usuario" value={user.userType || '—'} />
                <Info label="Matrícula / ID" value={user.identifier || '—'} />
                <Info label="Estado" value={user.active ? 'Activo' : 'Inactivo'} />
              </div>
            </Section>

            <Section title="Contacto">
              <div style={gridStyle}>
                <Info label="Correo" value={user.email} />
                <Info label="Teléfono" value={user.phone || '—'} />
              </div>
            </Section>
          </div>
  
          <div style={footerStyle}>
            <button type="button" onClick={onClose} style={buttonStyle}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  function Section({ title, children }) {
    return (
      <section style={sectionStyle}>
        <h4 style={sectionTitleStyle}>{title}</h4>
        {children}
      </section>
    )
  }

  function Info({ label, value }) {
    return (
      <div style={infoBoxStyle}>
        <span style={infoLabelStyle}>{label}</span>
        <p style={infoValueStyle}>{value}</p>
      </div>
    )
  }
  
  function formatRole(role) {
    if (role === 'ADMIN') return 'Administrador'
    if (role === 'STAFF') return 'Personal'
    return 'Solicitante'
  }
  
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px',
    zIndex: 100,
  }
  
  const modalStyle = {
    width: '100%',
    maxWidth: '720px',
    background: '#ffffff',
    borderRadius: '18px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    padding: '24px',
  }
  
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  }
  
  const titleStyle = {
    fontSize: '22px',
    fontWeight: 800,
    color: '#111827',
    marginBottom: '6px',
  }
  
  const subtitleStyle = {
    color: '#64748b',
    fontSize: '14px',
  }
  
  const closeButtonStyle = {
    border: 'none',
    background: '#f8fafc',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    cursor: 'pointer',
  }

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  }

  const sectionStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '14px',
    background: '#ffffff',
  }

  const sectionTitleStyle = {
    marginBottom: '10px',
    color: '#1f2937',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px',
  }
  
  const infoBoxStyle = {
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '12px 14px',
  }
  
  const infoLabelStyle = {
    display: 'block',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '6px',
    textTransform: 'uppercase',
  }
  
  const infoValueStyle = {
    color: '#111827',
    fontSize: '14px',
    fontWeight: 600,
  }
  
  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  }
  
  const buttonStyle = {
    border: 'none',
    background: '#e2e8f0',
    color: '#0f172a',
    padding: '12px 16px',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
  }
  
  export default ViewUserModal