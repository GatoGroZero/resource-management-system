import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'

function ProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <PageHeader title="Perfil" subtitle="Información del usuario" />
      <div style={cardStyle}>
        <p><strong>Nombre:</strong> {user?.name} {user?.lastName}</p>
        <p><strong>Correo:</strong> {user?.email}</p>
        <p><strong>Rol:</strong> {user?.role}</p>
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

export default ProfilePage