import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginRequest } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../utils/alertUtils'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await loginRequest({ email, password })
      login(response)
      showToast('success', 'Inicio de sesión correcto')

      if (response.role === 'ADMIN') {
        navigate('/reservations')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Correo o contraseña incorrectos'
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={logoBoxStyle}>UTEZ</div>

        <h1 style={titleStyle}>Bienvenido al Sistema de Recursos</h1>
        <p style={subtitleStyle}>
          Ingresa tus credenciales institucionales para continuar
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Correo Institucional</label>
            <input
              type="email"
              required
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '46px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButtonStyle}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={submitStyle}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={forgotBoxStyle}>
          <Link to="/forgot-password" style={forgotLinkStyle}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#f8fafc',
  padding: '24px',
}

const cardStyle = {
  width: '100%',
  maxWidth: '520px',
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
}

const logoBoxStyle = {
  width: '80px',
  height: '80px',
  margin: '0 auto 24px auto',
  borderRadius: '18px',
  background: '#ffffff',
  border: '1px solid #f1f5f9',
  boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  color: '#0b2f63',
}

const titleStyle = {
  textAlign: 'center',
  color: '#111827',
  fontSize: '30px',
  fontWeight: 700,
  marginBottom: '10px',
}

const subtitleStyle = {
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '14px',
  marginBottom: '28px',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const labelStyle = {
  color: '#374151',
  fontSize: '14px',
  fontWeight: 600,
}

const inputStyle = {
  width: '100%',
  border: '1px solid #e5e7eb',
  background: '#f8fafc',
  borderRadius: '12px',
  padding: '14px 16px',
  fontSize: '14px',
  color: '#111827',
  outline: 'none',
}

const eyeButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
}

const submitStyle = {
  border: 'none',
  background: '#00843D',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '14px 16px',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: '4px',
}

const forgotBoxStyle = {
  marginTop: '24px',
  textAlign: 'center',
}

const forgotLinkStyle = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: 500,
}

export default LoginPage