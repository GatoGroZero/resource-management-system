import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'

const equipments = [
  {
    id: 1,
    name: 'Proyector Epson',
    inventory: 'EQ-001',
    status: 'Disponible',
  },
  {
    id: 2,
    name: 'Laptop Dell',
    inventory: 'EQ-002',
    status: 'Prestado',
  },
  {
    id: 3,
    name: 'Micrófono Inalámbrico',
    inventory: 'EQ-003',
    status: 'Mantenimiento',
  },
]

function EquipmentsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Equipos"
        subtitle="Consulta los equipos registrados en el sistema"
      />

      <div style={{ display: 'grid', gap: '1rem' }}>
        {equipments.map((equipment) => (
          <div key={equipment.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ color: '#022859' }}>{equipment.name}</h3>
              <span style={getStatusStyle(equipment.status)}>{equipment.status}</span>
            </div>

            <p style={{ color: '#8A9BB8' }}>Inventario: {equipment.inventory}</p>
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

  if (status === 'Prestado') {
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

export default EquipmentsPage