import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>SGR</div>

      <nav style={{ marginTop: '2rem' }}>
        <NavLink to="/dashboard" style={linkStyle}>
          Inicio
        </NavLink>

        {isAdmin && (
          <NavLink to="/users" style={linkStyle}>
            Gestión de Usuarios
          </NavLink>
        )}

        <NavLink to="/requests" end style={linkStyle}>
          Gestión de Solicitudes
        </NavLink>

        <NavLink to="/requests/new" style={linkStyle}>
          Nueva Solicitud
        </NavLink>

        {isAdmin && (
          <>
            <NavLink to="/spaces" style={linkStyle}>
              Gestión de Espacios
            </NavLink>

            <NavLink to="/equipments" style={linkStyle}>
              Gestión de Equipos
            </NavLink>

            <NavLink to="/history" style={linkStyle}>
              Historial
            </NavLink>
          </>
        )}

        <NavLink to="/profile" style={linkStyle}>
          Perfil
        </NavLink>
      </nav>
    </aside>
  )
}

const sidebarStyle = {
  width: '240px',
  background: '#01402E',
  color: '#FFFFFF',
  padding: '1.5rem 1rem',
}

const logoStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
}

const linkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '0.8rem 1rem',
  borderRadius: '10px',
  marginBottom: '0.4rem',
  color: isActive ? '#01402E' : '#E5E7EB',
  background: isActive ? '#C8E6C9' : 'transparent',
  fontWeight: isActive ? '700' : '500',
})

export default Sidebar