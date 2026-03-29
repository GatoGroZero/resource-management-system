function ViewReservationModal({ reservation, onClose }) {
    if (!reservation) return null
  
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={headerStyle}>
            <div>
              <h2 style={titleStyle}>Detalle de Reserva</h2>
              <p style={subtitleStyle}>Información registrada de la reserva</p>
            </div>
            <button type="button" onClick={onClose} style={closeButtonStyle}>✕</button>
          </div>
  
          <div style={gridStyle}>
            <Info label="Solicitante" value={reservation.requesterName} />
            <Info label="Correo" value={reservation.requesterEmail} />
            <Info label="Tipo de solicitante" value={reservation.requesterType} />
            <Info label="Tipo de recurso" value={formatResourceType(reservation.resourceType)} />
            <Info label="Recurso" value={reservation.resourceName} />
            <Info label="Fecha" value={reservation.reservationDate} />
            <Info label="Hora inicio" value={reservation.startTime} />
            <Info label="Hora fin" value={reservation.endTime} />
            <Info label="Estado" value={formatStatus(reservation.status)} />
            <Info label="Motivo" value={reservation.purpose} />
            <Info label="Observaciones" value={reservation.observations || '—'} />
            <Info label="Comentario administrativo" value={reservation.adminComment || '—'} />
          </div>
  
          <div style={footerStyle}>
            <button type="button" onClick={onClose} style={buttonStyle}>Cerrar</button>
          </div>
        </div>
      </div>
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
  
  function formatResourceType(value) {
    return value === 'SPACE' ? 'Espacio' : 'Equipo'
  }
  
  function formatStatus(value) {
    if (value === 'PENDIENTE') return 'Pendiente'
    if (value === 'APROBADA') return 'Aprobada'
    if (value === 'RECHAZADA') return 'Rechazada'
    return 'Cancelada'
  }
  
  const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 100 }
  const modalStyle = { width: '100%', maxWidth: '860px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', boxShadow: '0 18px 40px rgba(0,0,0,0.12)', overflow: 'hidden', padding: '24px' }
  const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }
  const titleStyle = { fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '6px' }
  const subtitleStyle = { color: '#64748b', fontSize: '14px' }
  const closeButtonStyle = { border: 'none', background: '#f8fafc', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer' }
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }
  const infoBoxStyle = { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px' }
  const infoLabelStyle = { display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }
  const infoValueStyle = { color: '#111827', fontSize: '14px', fontWeight: 600, whiteSpace: 'pre-wrap' }
  const footerStyle = { display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }
  const buttonStyle = { border: 'none', background: '#e2e8f0', color: '#0f172a', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }
  
  export default ViewReservationModal