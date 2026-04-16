import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

import DashboardPage from '../pages/dashboard/DashboardPage'
import UsersPage from '../pages/users/UsersPage'
import SpacesPage from '../pages/spaces/SpacesPage'
import EquipmentsPage from '../pages/equipments/EquipmentsPage'
import ReservationsPage from '../pages/reservations/ReservationsPage'
import HistoryPage from '../pages/history/HistoryPage'
import ProfilePage from '../pages/profile/ProfilePage'

import RoleRoute from './RoleRoute'

function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* TODAS las rutas internas son solo ADMIN */}
      <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/inventory" element={<EquipmentsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter