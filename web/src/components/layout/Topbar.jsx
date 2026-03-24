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
        background: '#FFFFFF',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <strong style={{ color: '#022859' }}>
          {user?.name} {user?.lastName}
        </strong>
        <p style={{ color: '#8A9BB8', fontSize: '0.9rem' }}>{user?.email}</p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: '0.8rem 1rem',
          border: 'none',
          borderRadius: '10px',
          background: '#01402E',
          color: '#FFFFFF',
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