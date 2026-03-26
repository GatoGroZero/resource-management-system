import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

import DashboardPage from '../pages/dashboard/DashboardPage'
import UsersPage from '../pages/users/UsersPage'
import SpacesPage from '../pages/spaces/SpacesPage'
import EquipmentsPage from '../pages/equipments/EquipmentsPage'
import RequestsPage from '../pages/requests/RequestsPage'
import NewRequestPage from '../pages/requests/NewRequestPage'
import HistoryPage from '../pages/history/HistoryPage'
import ProfilePage from '../pages/profile/ProfilePage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/portal" element={<DashboardPage />} />
        <Route path="/new-request" element={<NewRequestPage />} />
        <Route path="/request-history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/infrastructure" element={<SpacesPage />} />
        <Route path="/inventory" element={<EquipmentsPage />} />
        <Route path="/reservations" element={<RequestsPage />} />
        <Route path="/audit" element={<HistoryPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter