import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const location = useLocation()

  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')

  const hasSession = Boolean(token || userRaw)

  if (!hasSession) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute