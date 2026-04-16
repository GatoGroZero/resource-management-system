import { Navigate, Outlet } from 'react-router-dom'

function RoleRoute({ allowedRoles }) {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />
  }

  let user = null
  try {
    user = JSON.parse(userRaw)
  } catch {
    return <Navigate to="/login" replace />
  }

  // Si no es admin, borrar sesión y mandarlo al login
  if (!allowedRoles.includes(user?.role)) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return <Navigate to="/login?onlyAdmin=1" replace />
  }

  return <Outlet />
}

export default RoleRoute