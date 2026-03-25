import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import AppCard from '../../components/common/AppCard'

const spaces = [
  { id: 1, name: 'Laboratorio de Cómputo 1', location: 'Edificio A', status: 'Disponible' },
  { id: 2, name: 'Sala de Juntas', location: 'Edificio B', status: 'Ocupado' },
  { id: 3, name: 'Aula Multimedia', location: 'Edificio C', status: 'Mantenimiento' },
]

function SpacesPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Espacios"
        subtitle="Consulta los espacios registrados en el sistema"
      />

      <div style={gridStyle}>
        {spaces.map((space) => (
          <AppCard key={space.id}>
            <div style={topRowStyle}>
              <h3 style={titleStyle}>{space.name}</h3>
              <span style={getStatusStyle(space.status)}>{space.status}</span>
            </div>

            <div style={infoBoxStyle}>
              <span style={labelStyle}>Ubicación</span>
              <p style={valueStyle}>{space.location}</p>
            </div>
          </AppCard>
        ))}
      </div>
    </DashboardLayout>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
}

const topRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
  marginBottom: '1rem',
}

const titleStyle = {
  color: '#022859',
  fontSize: '1.05rem',
}

const infoBoxStyle = {
  background: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: '14px',
  padding: '0.9rem',
}

const labelStyle = {
  display: 'block',
  color: '#8A9BB8',
  fontSize: '0.85rem',
  marginBottom: '0.35rem',
}

const valueStyle = {
  color: '#022859',
  fontWeight: '600',
}

function getStatusStyle(status) {
  if (status === 'Disponible') return badgeStyle('#C8E6C9', '#01402E')
  if (status === 'Ocupado') return badgeStyle('#FFE5CC', '#8B4500')
  return badgeStyle('#FFE0E0', '#8B0000')
}

function badgeStyle(background, color) {
  return {
    background,
    color,
    padding: '0.35rem 0.7rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '700',
  }
}

export default SpacesPage