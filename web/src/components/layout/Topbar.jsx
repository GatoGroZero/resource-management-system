import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const initials = `${user?.name?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={headerStyle}>
      <div></div>

      <div style={profileWrapStyle}>
        <button type="button" onClick={() => setOpen(!open)} style={profileButtonStyle}>
          <div style={avatarStyle}>{initials || 'U'}</div>

          <div style={{ textAlign: 'left' }}>
            <div style={nameStyle}>{user?.name} {user?.lastName}</div>
            <div style={roleStyle}>{formatRole(user?.role)}</div>
          </div>

          <div style={chevronStyle}>⌄</div>
        </button>

        {open && (
          <div style={dropdownStyle}>
            <button type="button" style={dropdownItemStyle} onClick={() => navigate('/profile')}>
              Perfil
            </button>
            <button type="button" style={dropdownItemDangerStyle} onClick={handleLogout}>
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  )
}



function formatRole(role) {
  if (role === 'ADMIN') return 'Administrador'
  if (role === 'STAFF') return 'Personal UTEZ'
  return 'Estudiante'
}

const headerStyle = {
  height: '50px',
  background: '#ffffff',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  position: 'relative',
}

const profileWrapStyle = {
  position: 'relative',
}

const profileButtonStyle = {
  border: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
}

const avatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '999px',
  background: '#d1fae5',
  color: '#166534',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  fontWeight: 800,
  border: '1px solid #bbf7d0',
}

const nameStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#111827',
  lineHeight: 1.1,
}

const roleStyle = {
  fontSize: '12px',
  color: '#64748b',
  marginTop: '2px',
}

const chevronStyle = {
  color: '#94a3b8',
  fontSize: '12px',
}

const dropdownStyle = {
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 8px)',
  width: '160px',
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  padding: '8px',
  zIndex: 20,
}

const dropdownItemStyle = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  padding: '10px 12px',
  borderRadius: '8px',
  color: '#0f172a',
  cursor: 'pointer',
}

const dropdownItemDangerStyle = {
  ...dropdownItemStyle,
  color: '#dc2626',
}

export default Topbar