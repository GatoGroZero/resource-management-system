import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'

function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general del sistema de gestión de recursos"
      />

      <div style={gridStyle}>
        <div style={cardStyle}>
          <p style={labelStyle}>Usuario</p>
          <h3 style={valueStyle}>{user?.name} {user?.lastName}</h3>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Correo</p>
          <h3 style={valueStyle}>{user?.email}</h3>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Rol</p>
          <h3 style={valueStyle}>{user?.role}</h3>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', ...cardStyle }}>
        <h3 style={{ color: '#022859', marginBottom: '0.75rem' }}>
          Bienvenido al sistema
        </h3>
        <p style={{ color: '#8A9BB8', lineHeight: '1.6' }}>
          Desde este panel podrás consultar información general, revisar solicitudes
          y navegar entre los distintos módulos habilitados según tu rol.
        </p>
      </div>
    </DashboardLayout>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1rem',
}

const cardStyle = {
  background: '#FFFFFF',
  padding: '1.3rem',
  borderRadius: '16px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  border: '2px solid #C8E6C9',
}

const labelStyle = {
  color: '#8A9BB8',
  marginBottom: '0.5rem',
  fontSize: '0.95rem',
}

const valueStyle = {
  color: '#022859',
  fontSize: '1.15rem',
}

export default DashboardPage