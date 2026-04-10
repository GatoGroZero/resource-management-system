import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { resetPasswordRequest } from '../../api/authApi'
import { showToast } from '../../utils/alertUtils'
import AuthShell from '../../components/auth/AuthShell'

const schema = z
  .object({
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'La confirmación debe tener al menos 8 caracteres'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

function ResetPasswordPage() {
  const navigate = useNavigate()
  const email = localStorage.getItem('resetEmail') || ''
  const code = localStorage.getItem('resetCode') || ''

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')

    if (token && userRaw) {
      try {
        const parsedUser = JSON.parse(userRaw)
        const redirectPath = parsedUser?.role === 'ADMIN' ? '/reservations' : '/dashboard'
        navigate(redirectPath, { replace: true })
        return
      } catch {
        /* ignore */
      }
    }

    if (!email || !code) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, code, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await resetPasswordRequest({
        email,
        code,
        newPassword: data.newPassword,
      })

      localStorage.removeItem('resetEmail')
      localStorage.removeItem('resetCode')

      showToast('success', 'Contraseña actualizada correctamente')
      navigate('/login', { replace: true })
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo actualizar la contraseña'
      showToast('error', message)
    }
  }

  return (
    <AuthShell
      title="Nueva contraseña"
      subtitle="Ingresa tu nueva contraseña para completar la recuperación."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Nueva contraseña</label>
          <input
            type="password"
            placeholder="********"
            {...register('newPassword')}
            className="auth-input"
          />
          {errors.newPassword && <span className="auth-error">{errors.newPassword.message}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label">Confirmar contraseña</label>
          <input
            type="password"
            placeholder="********"
            {...register('confirmPassword')}
            className="auth-input"
          />
          {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </AuthShell>
  )
}

export default ResetPasswordPage