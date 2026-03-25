import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'

const spaces = [
  {
    id: 1,
    name: 'Laboratorio de Cómputo 1',
    location: 'Edificio A',
    status: 'Disponible',
  },
  {
    id: 2,
    name: 'Sala de Juntas',
    location: 'Edificio B',
    status: 'Ocupado',
  },
  {
    id: 3,
    name: 'Aula Multimedia',
    location: 'Edificio C',
    status: 'Mantenimiento',
  },
]

function SpacesPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Espacios"
        subtitle="Consulta los espacios registrados en el sistema"
      />

      <div style={{ display: 'grid', gap: '1rem' }}>
        {spaces.map((space) => (
          <div key={space.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ color: '#022859' }}>{space.name}</h3>
              <span style={getStatusStyle(space.status)}>{space.status}</span>
            </div>

            <p style={{ color: '#8A9BB8' }}>Ubicación: {space.location}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

function getStatusStyle(status) {
  if (status === 'Disponible') {
    return badgeStyle('#C8E6C9', '#01402E')
  }

  if (status === 'Ocupado') {
    return badgeStyle('#FFE5CC', '#8B4500')
  }

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

const cardStyle = {
  background: '#FFFFFF',
  padding: '1.2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  border: '2px solid #C8E6C9',
}

export default SpacesPage