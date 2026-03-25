import { useAuth } from '../../context/AuthContext'

function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header style={topbarStyle}>
      <div>
        <strong style={{ color: '#022859', fontSize: '1rem' }}>
          {user?.name} {user?.lastName}
        </strong>
        <div style={{ color: '#8A9BB8', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          {user?.email}
        </div>
      </div>

      <button onClick={logout} style={buttonStyle}>
        Cerrar sesión
      </button>
    </header>
  )
}

const topbarStyle = {
  height: '76px',
  background: '#FFFFFF',
  borderBottom: '1px solid #E5E7EB',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
}

const buttonStyle = {
  background: '#01402E',
  color: '#FFFFFF',
  border: 'none',
  padding: '0.7rem 1.1rem',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
}

export default Topbar