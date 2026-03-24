import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'

function HistoryPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Historial"
        subtitle="Seguimiento de solicitudes y movimientos"
      />

      <div style={cardStyle}>
        <p>Aquí se mostrará el historial del sistema.</p>
      </div>
    </DashboardLayout>
  )
}

const cardStyle = {
  background: '#ffffff',
  padding: '1.2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
}

export default HistoryPage