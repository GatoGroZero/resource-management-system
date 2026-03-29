import DashboardLayout from '../../components/layout/DashboardLayout'

function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 style={titleStyle}>Inicio</h1>
      <p style={subtitleStyle}>Panel principal del sistema.</p>
    </DashboardLayout>
  )
}

const titleStyle = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#0b2f63',
  marginBottom: '8px',
}

const subtitleStyle = {
  color: '#64748b',
  fontSize: '14px',
}

export default DashboardPage