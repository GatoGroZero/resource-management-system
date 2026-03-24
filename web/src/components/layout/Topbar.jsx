import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      style={{
        background: '#ffffff',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <strong>{user?.name} {user?.lastName}</strong>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{user?.email}</p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: '0.8rem 1rem',
          border: 'none',
          borderRadius: '10px',
          background: '#dc2626',
          color: '#ffffff',
          cursor: 'pointer',
          fontWeight: '700',
        }}
      >
        Cerrar sesión
      </button>
    </header>
  )
}

export default Topbar