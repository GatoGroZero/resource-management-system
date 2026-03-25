import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'

function ProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <PageHeader
        title="Perfil"
        subtitle="Consulta la información de tu cuenta"
      />

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={labelStyle}>Nombre</h3>
          <p style={valueStyle}>{user?.name || '—'} {user?.lastName || ''}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={labelStyle}>Correo</h3>
          <p style={valueStyle}>{user?.email || '—'}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={labelStyle}>Rol</h3>
          <p style={valueStyle}>{user?.role || '—'}</p>
        </div>

        <div style={cardStyle}>
          <h3 style={labelStyle}>Estado</h3>
          <p style={valueStyle}>Activo</p>
        </div>
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
  padding: '1.2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  border: '2px solid #C8E6C9',
}

const labelStyle = {
  fontSize: '0.95rem',
  color: '#8A9BB8',
  marginBottom: '0.5rem',
}

const valueStyle = {
  fontSize: '1.05rem',
  color: '#022859',
  fontWeight: '700',
}

export default ProfilePage