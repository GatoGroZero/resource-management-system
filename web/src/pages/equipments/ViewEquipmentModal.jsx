function ViewEquipmentModal({ equipment, onClose }) {
  if (!equipment) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Detalle de Equipo</h2>
          <button type="button" onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        <div style={contentStyle}>
          <Section title="Identificación">
            <div style={gridStyle}>
              <Info label="Número de inventario" value={equipment.inventoryNumber} />
              <Info label="Nombre del equipo" value={equipment.name} />
              <Info label="Tipo" value={equipment.category} />
              <Info label="Espacio asociado" value={equipment.spaceName || 'Sin espacio asociado'} />
            </div>
          </Section>

          <Section title="Estado y acceso">
            <div style={gridStyle}>
              <Info label="Estado" value={equipment.active ? 'Activo' : 'Inactivo'} />
              <Info label="Condición" value={formatCondition(equipment.condition)} />
              <Info label="Acceso para estudiantes" value={equipment.allowStudents ? 'Permitido' : 'Restringido'} />
            </div>
          </Section>

          <Section title="Descripción">
            <Info label="Detalle" value={equipment.description || '—'} fullWidth />
          </Section>
        </div>

        <div style={footerStyle}>
          <button type="button" onClick={onClose} style={buttonStyle}>Cerrar</button>
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

function Info({ label, value, fullWidth = false }) {
  return (
    <div style={fullWidth ? fullInfoBoxStyle : infoBoxStyle}>
      <span style={infoLabelStyle}>{label}</span>
      <p style={infoValueStyle}>{value}</p>
    </div>
  )
}

function formatCondition(value) {
  if (value === 'DISPONIBLE') return 'Disponible'
  if (value === 'EN_USO') return 'En uso'
  return 'Mantenimiento'
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 100 }
const modalStyle = { width: '100%', maxWidth: '560px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', boxShadow: '0 18px 40px rgba(0,0,0,0.12)', overflow: 'hidden', padding: '20px' }
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }
const titleStyle = { fontSize: '18px', fontWeight: 800, color: '#111827' }
const closeButtonStyle = { border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }
const contentStyle = { display: 'flex', flexDirection: 'column', gap: '14px' }
const sectionStyle = { border: '1px solid #e5e7eb', borderRadius: '14px', padding: '14px', background: '#ffffff' }
const sectionTitleStyle = { marginBottom: '10px', color: '#1f2937', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
const infoBoxStyle = { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px' }
const fullInfoBoxStyle = { ...infoBoxStyle }
const infoLabelStyle = { display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }
const infoValueStyle = { color: '#111827', fontSize: '14px', fontWeight: 600, whiteSpace: 'pre-wrap' }
const footerStyle = { display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }
const buttonStyle = { border: 'none', background: '#e2e8f0', color: '#0f172a', padding: '10px 14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

export default ViewEquipmentModal