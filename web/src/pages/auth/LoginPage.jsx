import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../utils/alertUtils'

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
      navigate('/dashboard')
    } catch (error) {
      const message = error?.response?.data?.message || 'Error al iniciar sesión'
      showToast('error', message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Accede al sistema de gestión de recursos</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Correo</label>
            <input
              type="email"
              placeholder="admin@sgr.com"
              {...register('email')}
              className="auth-input"
            />
            {errors.email && <span className="auth-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="auth-input"
            />
            {errors.password && <span className="auth-error">{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="auth-button">
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage