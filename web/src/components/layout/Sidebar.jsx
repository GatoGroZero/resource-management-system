import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const baseLinkStyle = {
  display: 'block',
  padding: '0.8rem 1rem',
  borderRadius: '10px',
  marginBottom: '0.5rem',
  fontWeight: '500',
}

const getLinkStyle = ({ isActive }) => ({
  ...baseLinkStyle,
  background: isActive ? '#C8E6C9' : 'transparent',
  color: isActive ? '#022859' : '#E5E7EB',
  fontWeight: isActive ? '700' : '500',
})

function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <aside
      style={{
        width: '250px',
        background: '#01402E',
        color: '#FFFFFF',
        padding: '1.5rem 1rem',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem', color: '#FFFFFF' }}>SGR</h2>

      <NavLink to="/dashboard" style={getLinkStyle}>
        Dashboard
      </NavLink>

      <NavLink to="/requests" end style={getLinkStyle}>
        Solicitudes
      </NavLink>

      <NavLink to="/requests/new" style={getLinkStyle}>
        Nueva Solicitud
      </NavLink>

      {isAdmin && (
        <>
          <NavLink to="/spaces" style={getLinkStyle}>
            Espacios
          </NavLink>

          <NavLink to="/equipments" style={getLinkStyle}>
            Equipos
          </NavLink>

          <NavLink to="/history" style={getLinkStyle}>
            Historial
          </NavLink>
        </>
      )}

      <NavLink to="/profile" style={getLinkStyle}>
        Perfil
      </NavLink>
    </aside>
  )
}

export default Sidebar