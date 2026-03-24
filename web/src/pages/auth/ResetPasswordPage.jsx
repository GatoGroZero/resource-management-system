import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { resetPasswordRequest } from '../../api/authApi'
import { showToast } from '../../utils/alertUtils'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'Confirma tu contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

function ResetPasswordPage() {
  const navigate = useNavigate()
  const recoveryEmail = sessionStorage.getItem('recoveryEmail')
  const verifiedOtp = sessionStorage.getItem('verifiedOtp')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await resetPasswordRequest({
        email: recoveryEmail,
        code: verifiedOtp,
        newPassword: data.newPassword,
      })

      sessionStorage.removeItem('recoveryEmail')
      sessionStorage.removeItem('verifiedOtp')

      showToast('success', 'Contraseña actualizada')
      navigate('/login')
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'No se pudo actualizar la contraseña')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Nueva contraseña</h1>
        <p className="auth-subtitle">Ingresa y confirma tu nueva contraseña</p>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <AppInput
            label="Nueva contraseña"
            type="password"
            placeholder="Nueva123*"
            registration={register('newPassword')}
            error={errors.newPassword?.message}
          />

          <AppInput
            label="Confirmar contraseña"
            type="password"
            placeholder="Nueva123*"
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <AppButton type="submit" variant="primary">
            {isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}
          </AppButton>
        </form>

        <div className="link-text">
          <Link to="/login">Volver al login</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage