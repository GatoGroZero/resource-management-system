import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

import UsersPage from '../pages/users/UsersPage'
import SpacesPage from '../pages/spaces/SpacesPage'
import EquipmentsPage from '../pages/equipments/EquipmentsPage'
import ReservationsPage from '../pages/reservations/ReservationsPage'

import ProtectedRoute from './ProtectedRoute'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/spaces"
        element={
          <ProtectedRoute>
            <SpacesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <EquipmentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <ReservationsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter