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
import RequestsPage from '../pages/requests/RequestsPage'
import NewRequestPage from '../pages/requests/NewRequestPage'
import HistoryPage from '../pages/history/HistoryPage'
import ProfilePage from '../pages/profile/ProfilePage'

import ProtectedRoute from './ProtectedRoute'
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

      {/* Rutas solo ADMIN */}
      <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/inventory" element={<EquipmentsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>

      {/* Rutas para todos los autenticados */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <RequestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-request"
        element={
          <ProtectedRoute>
            <NewRequestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter