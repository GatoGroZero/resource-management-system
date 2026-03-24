import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'

function SpacesPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Gestión de Espacios"
        subtitle="Consulta de espacios disponibles, ocupados o en mantenimiento"
      />

      <div style={cardStyle}>
        <p>Aquí se mostrarán los espacios del sistema.</p>
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

export default SpacesPage