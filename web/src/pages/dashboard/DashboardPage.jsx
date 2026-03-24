import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'

function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <PageHeader title="Dashboard" subtitle="Resumen general del sistema" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <div style={cardStyle}>
          <h3>Usuario</h3>
          <p>{user?.name} {user?.lastName}</p>
        </div>

        <div style={cardStyle}>
          <h3>Correo</h3>
          <p>{user?.email}</p>
        </div>

        <div style={cardStyle}>
          <h3>Rol</h3>
          <p>{user?.role}</p>
        </div>
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

export default DashboardPage