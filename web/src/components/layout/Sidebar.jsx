import { NavLink } from 'react-router-dom'

const linkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '0.8rem 1rem',
  borderRadius: '10px',
  background: isActive ? '#2563eb' : 'transparent',
  color: isActive ? '#ffffff' : '#e5e7eb',
  marginBottom: '0.5rem',
})

function Sidebar() {
  return (
    <aside
      style={{
        width: '250px',
        background: '#111827',
        color: '#ffffff',
        padding: '1.5rem 1rem',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem' }}>SGR</h2>

      <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/requests" style={linkStyle}>Solicitudes</NavLink>
      <NavLink to="/requests/new" style={linkStyle}>Nueva Solicitud</NavLink>
      <NavLink to="/spaces" style={linkStyle}>Espacios</NavLink>
      <NavLink to="/equipments" style={linkStyle}>Equipos</NavLink>
      <NavLink to="/history" style={linkStyle}>Historial</NavLink>
      <NavLink to="/profile" style={linkStyle}>Perfil</NavLink>
    </aside>
  )
}

export default Sidebar