import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'

function HistoryPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Historial" subtitle="Historial del sistema" />
      <div style={cardStyle}>
        <p>Página de historial.</p>
      </div>
    </DashboardLayout>
  )
}

const cardStyle = {
    background: '#FFFFFF',
    padding: '1.2rem',
    borderRadius: '14px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
    border: '2px solid #C8E6C9',
  }

export default HistoryPage