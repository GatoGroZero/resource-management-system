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
      const message =
        error?.response?.data?.message || 'Error al iniciar sesión'
      showToast('error', message)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar sesión</h1>
        <p style={styles.subtitle}>Accede al sistema de gestión de recursos</p>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Correo</label>
            <input
              type="email"
              placeholder="admin@sgr.com"
              {...register('email')}
              style={styles.input}
            />
            {errors.email && <span style={styles.error}>{errors.email.message}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              style={styles.input}
            />
            {errors.password && (
              <span style={styles.error}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e0e7ff, #f8fafc)',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '18px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#6b7280',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontWeight: '600',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid #d1d5db',
    outline: 'none',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.9rem 1rem',
    border: 'none',
    borderRadius: '10px',
    background: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '700',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.85rem',
  },
}

export default LoginPage