import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import AppCard from '../../components/common/AppCard'
import { useAuth } from '../../context/AuthContext'

function ProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <PageHeader
        title="Perfil"
        subtitle="Consulta la información de tu cuenta"
      />

      <div style={wrapperStyle}>
        <AppCard style={profileCardStyle}>
          <div style={avatarStyle}>
            {(user?.name?.[0] || 'U').toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={nameStyle}>
              {user?.name} {user?.lastName}
            </h2>
            <p style={roleStyle}>{user?.role}</p>
          </div>
        </AppCard>

        <div style={gridStyle}>
          <AppCard>
            <span style={labelStyle}>Nombre</span>
            <p style={valueStyle}>{user?.name || '—'}</p>
          </AppCard>

          <AppCard>
            <span style={labelStyle}>Apellidos</span>
            <p style={valueStyle}>{user?.lastName || '—'}</p>
          </AppCard>

          <AppCard>
            <span style={labelStyle}>Correo</span>
            <p style={valueStyle}>{user?.email || '—'}</p>
          </AppCard>

          <AppCard>
            <span style={labelStyle}>Rol</span>
            <p style={valueStyle}>{user?.role || '—'}</p>
          </AppCard>
        </div>
      </div>
    </DashboardLayout>
  )
}

const wrapperStyle = {
  display: 'grid',
  gap: '1rem',
}

const profileCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.5rem',
}

const avatarStyle = {
  width: '72px',
  height: '72px',
  borderRadius: '18px',
  background: '#D1D9E6',
  color: '#022859',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.8rem',
  fontWeight: '800',
}

const nameStyle = {
  color: '#022859',
  fontSize: '1.35rem',
  marginBottom: '0.25rem',
}

const roleStyle = {
  color: '#8A9BB8',
  fontSize: '0.95rem',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1rem',
}

const labelStyle = {
  display: 'block',
  color: '#8A9BB8',
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
}

const valueStyle = {
  color: '#022859',
  fontSize: '1.05rem',
  fontWeight: '700',
  lineHeight: '1.5',
}

export default ProfilePage