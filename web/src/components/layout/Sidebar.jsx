import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const userRaw = localStorage.getItem('user')
  let user = null
  try {
    user = JSON.parse(userRaw)
  } catch {
    /* ignore */
  }

  const isAdmin = user?.role === 'ADMIN'

  const adminItems = [
    { label: 'Usuarios', path: '/users', icon: '👥' },
    { label: 'Espacios', path: '/spaces', icon: '🏢' },
    { label: 'Equipos', path: '/inventory', icon: '📦' },
    { label: 'Reservas', path: '/reservations', icon: '🗓️' },
    { label: 'Auditoría', path: '/history', icon: '🕘' },
  ]

  const userItems = [
    { label: 'Inicio', path: '/dashboard', icon: '🏠' },
    { label: 'Nueva Solicitud', path: '/new-request', icon: '➕' },
    { label: 'Mi Historial', path: '/requests', icon: '🕘' },
    { label: 'Mi Perfil', path: '/profile', icon: '👤' },
  ]

  const items = isAdmin ? adminItems : userItems

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <aside style={sidebarStyle}>
      <div style={brandStyle}>
        <div style={logoBoxStyle}></div>
        <span style={brandTextStyle}>DIGITAL CORE</span>
      </div>

      <nav style={navStyle}>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? activeLinkStyle : {}),
            })}
          >
            <span style={iconStyle}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={bottomStyle}>
        <button type="button" onClick={handleLogout} style={logoutButtonStyle}>
          <span style={iconStyle}>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

const sidebarStyle = {
  width: '202px',
  minWidth: '202px',
  background: '#00843D',
  color: '#ffffff',
  height: '100vh',
  padding: '16px 10px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 0,
  alignSelf: 'flex-start',
}

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '28px',
  padding: '0 10px',
}

const logoBoxStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  background: '#d9d9d9',
}

const brandTextStyle = {
  fontWeight: 800,
  fontSize: '16px',
}

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
}

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#e7f7ee',
  textDecoration: 'none',
  padding: '13px 12px',
  borderRadius: '12px',
  fontWeight: 500,
  fontSize: '14px',
}

const activeLinkStyle = {
  background: 'rgba(255,255,255,0.12)',
  color: '#ffffff',
  fontWeight: 700,
}

const iconStyle = {
  width: '18px',
  display: 'inline-flex',
  justifyContent: 'center',
}

const bottomStyle = {
  borderTop: '1px solid rgba(255,255,255,0.15)',
  paddingTop: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const logoutButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#ffffff',
  background: 'none',
  border: 'none',
  padding: '13px 12px',
  borderRadius: '12px',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
}

export default Sidebar