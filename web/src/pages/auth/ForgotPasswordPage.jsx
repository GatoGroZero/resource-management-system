import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { forgotPasswordRequest } from '../../api/authApi'
import { showToast } from '../../utils/alertUtils'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'

const schema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('El correo no es válido'),
})

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await forgotPasswordRequest(data)
      sessionStorage.setItem('recoveryEmail', data.email)
      showToast('success', 'Código enviado correctamente')
      navigate('/verify-otp')
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'No se pudo enviar el código')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Recuperar contraseña</h1>
        <p className="auth-subtitle">Ingresa tu correo para recibir el código OTP</p>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <AppInput
            label="Correo"
            type="email"
            placeholder="admin@sgr.com"
            registration={register('email')}
            error={errors.email?.message}
          />

          <AppButton type="submit" variant="primary">
            {isSubmitting ? 'Enviando...' : 'Enviar código'}
          </AppButton>
        </form>

        <div className="link-text">
          <Link to="/login">Volver al login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage