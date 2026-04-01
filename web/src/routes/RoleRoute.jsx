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

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default RoleRoute