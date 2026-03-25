import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { loginRequest } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../utils/alertUtils'
import AuthShell from '../../components/auth/AuthShell'

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('El correo no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await loginRequest(data)
      login(response)
      showToast('success', 'Inicio de sesión correcto')

      if (response.role === 'ADMIN') {
        navigate('/dashboard')
      } else {
        navigate('/requests/new')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Error al iniciar sesión'
      showToast('error', message)
    }
  }

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Accede al sistema con tu cuenta institucional."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Correo</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            {...register('email')}
            className="auth-input"
          />
          {errors.email && <span className="auth-error">{errors.email.message}</span>}
        </div>

        <div className="auth-field">
          <label className="auth-label">Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            {...register('password')}
            className="auth-input"
          />
          {errors.password && <span className="auth-error">{errors.password.message}</span>}
        </div>

        <div style={{ textAlign: 'right', marginTop: '-0.2rem' }}>
          <Link to="/forgot-password" className="auth-link">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </AuthShell>
  )
}

export default LoginPage