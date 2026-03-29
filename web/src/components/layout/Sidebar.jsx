import { NavLink } from 'react-router-dom'

function Sidebar() {
  const items = [
    { label: 'Usuarios', path: '/users', icon: '👥' },
    { label: 'Espacios', path: '/spaces', icon: '📋' },
    { label: 'Inventario', path: '/inventory', icon: '📦' },
    { label: 'Reservas', path: '/reservations', icon: '🗓️' },
    { label: 'Auditoría', path: '/audit', icon: '🕘' },
  ]

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
    </aside>
  )
}

const sidebarStyle = {
  width: '202px',
  minWidth: '202px',
  background: '#00843D',
  color: '#ffffff',
  minHeight: '100vh',
  padding: '16px 10px',
  boxSizing: 'border-box',
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

export default Sidebar