import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const adminItems = [
    { label: 'Usuarios', to: '/users' },
    { label: 'Espacios', to: '/infrastructure' },
    { label: 'Inventario', to: '/inventory' },
    { label: 'Reservas', to: '/reservations' },
    { label: 'Auditoría', to: '/audit' },
  ]

  const applicantItems = [
    { label: 'Portal', to: '/portal' },
    { label: 'Nueva Solicitud', to: '/new-request' },
    { label: 'Mi Historial', to: '/request-history' },
  ]

  const items = isAdmin ? adminItems : applicantItems

  return (
    <aside style={sidebarStyle}>
      <div style={brandRowStyle}>
        <div style={logoBoxStyle}></div>
        <div style={brandTextStyle}>DIGITAL CORE</div>
      </div>

      <nav style={navStyle}>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} style={getLinkStyle}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

const sidebarStyle = {
  width: '204px',
  background: '#008A3A',
  color: '#ffffff',
  padding: '18px 12px',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
}

const brandRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '28px',
  padding: '0 10px',
}

const logoBoxStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: '#f8fafc',
  border: '1px solid rgba(255,255,255,0.35)',
}

const brandTextStyle = {
  fontSize: '14px',
  fontWeight: 800,
  letterSpacing: '0.2px',
}

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const getLinkStyle = ({ isActive }) => ({
  padding: '12px 14px',
  borderRadius: '10px',
  color: '#eafff1',
  background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
  fontSize: '14px',
  fontWeight: isActive ? 700 : 500,
})

export default Sidebar