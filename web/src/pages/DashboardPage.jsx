import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.name} {user?.lastName}</p>
      <p>Correo: {user?.email}</p>
      <p>Rol: {user?.role}</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.2rem',
          border: 'none',
          borderRadius: '8px',
          background: '#dc2626',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default DashboardPage