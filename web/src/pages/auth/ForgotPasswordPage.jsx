import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPasswordRequest } from '../../api/authApi'
import { showToast } from '../../utils/alertUtils'
import AuthShell from '../../components/auth/AuthShell'

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
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await forgotPasswordRequest(data)
      localStorage.setItem('resetEmail', data.email)
      showToast('success', 'Código enviado correctamente')
      navigate('/verify-otp')
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo enviar el código'
      showToast('error', message)
    }
  }

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Ingresa tu correo para recibir un código de verificación."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@utez.edu.mx"
            {...register('email')}
            className="auth-input"
          />
          {errors.email && <span className="auth-error">{errors.email.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>

      <div className="auth-helper">
        <Link to="/login" className="auth-link">
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthShell>
  )
}

export default ForgotPasswordPage