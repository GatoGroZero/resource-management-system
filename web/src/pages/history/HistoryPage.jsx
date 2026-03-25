import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'

const historyItems = [
  {
    id: 1,
    action: 'Solicitud creada',
    detail: 'Préstamo de proyector',
    user: 'Juan Estudiante',
    date: '2026-03-24 10:30',
    status: 'PENDING',
  },
  {
    id: 2,
    action: 'Solicitud aprobada',
    detail: 'Uso de laboratorio',
    user: 'Maria Personal',
    date: '2026-03-24 11:10',
    status: 'APPROVED',
  },
  {
    id: 3,
    action: 'Solicitud rechazada',
    detail: 'Sala de juntas',
    user: 'Juan Estudiante',
    date: '2026-03-24 12:00',
    status: 'REJECTED',
  },
]

function HistoryPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Historial"
        subtitle="Seguimiento de movimientos y cambios en el sistema"
      />

      <div style={{ display: 'grid', gap: '1rem' }}>
        {historyItems.map((item) => (
          <div key={item.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <h3 style={{ color: '#022859' }}>{item.action}</h3>
              <span style={getStatusStyle(item.status)}>{item.status}</span>
            </div>

            <p style={{ color: '#022859', marginBottom: '0.4rem' }}>
              <strong>Detalle:</strong> {item.detail}
            </p>

            <p style={{ color: '#8A9BB8', marginBottom: '0.3rem' }}>
              <strong>Usuario:</strong> {item.user}
            </p>

            <p style={{ color: '#8A9BB8' }}>
              <strong>Fecha:</strong> {item.date}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

function getStatusStyle(status) {
  if (status === 'APPROVED') {
    return badgeStyle('#C8E6C9', '#01402E')
  }

  if (status === 'REJECTED') {
    return badgeStyle('#FFE0E0', '#8B0000')
  }

  return badgeStyle('#FFE5CC', '#8B4500')
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

export default HistoryPage