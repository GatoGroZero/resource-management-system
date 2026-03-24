import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import RequestsPage from '../pages/requests/RequestsPage'
import NewRequestPage from '../pages/requests/NewRequestPage'
import SpacesPage from '../pages/spaces/SpacesPage'
import EquipmentsPage from '../pages/equipments/EquipmentsPage'
import HistoryPage from '../pages/history/HistoryPage'
import ProfilePage from '../pages/profile/ProfilePage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/new" element={<NewRequestPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/equipments" element={<EquipmentsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter