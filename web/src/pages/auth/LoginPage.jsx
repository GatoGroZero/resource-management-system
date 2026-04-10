import { useEffect, useState } from 'react'
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
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')

    if (!token || !userRaw) return

    try {
      const parsedUser = JSON.parse(userRaw)
      const redirectPath = parsedUser?.role === 'ADMIN' ? '/reservations' : '/dashboard'
      navigate(redirectPath, { replace: true })
    } catch {
      /* ignore */
    }
  }, [navigate])

  const validate = () => {
    const e = {}
    if (!email.trim()) e.email = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Ingresa un correo válido'
    if (!password) e.password = 'La contraseña es obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    if (!validate()) return

    setLoading(true)
    try {
      const response = await loginRequest({ email: email.trim(), password })
      login(response)
      showToast('success', 'Inicio de sesión correcto')
      if (response.role === 'ADMIN') navigate('/reservations', { replace: true })
      else navigate('/dashboard', { replace: true })
    } catch {
      setLoginError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={logoBoxStyle}>UTEZ</div>
        <h1 style={titleStyle}>Bienvenido al Sistema de Recursos</h1>
        <p style={subtitleStyle}>Ingresa tus credenciales institucionales para continuar</p>

        {loginError && (
          <div style={alertStyle}>
            <span style={alertIconStyle}>⚠</span>
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Correo Institucional</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }}
              style={{ ...inputStyle, ...(errors.email ? inputErrorStyle : {}) }}
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }) }}
                style={{ ...inputStyle, paddingRight: '46px', ...(errors.password ? inputErrorStyle : {}) }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span style={errorStyle}>{errors.password}</span>}
          </div>

          <button type="submit" disabled={loading} style={submitStyle}>
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={forgotBoxStyle}>
          <Link to="/forgot-password" style={forgotLinkStyle}>¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  )
}

const pageStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '24px' }
const cardStyle = { width: '100%', maxWidth: '520px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }
const logoBoxStyle = { width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '18px', background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0b2f63' }
const titleStyle = { textAlign: 'center', color: '#111827', fontSize: '30px', fontWeight: 700, marginBottom: '10px' }
const subtitleStyle = { textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '28px' }
const alertStyle = { display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px', fontWeight: 600 }
const alertIconStyle = { fontSize: '18px', flexShrink: 0 }
const formStyle = { display: 'flex', flexDirection: 'column', gap: '18px' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }
const labelStyle = { color: '#374151', fontSize: '14px', fontWeight: 600 }
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box' }
const inputErrorStyle = { borderColor: '#fca5a5', background: '#fef2f2' }
const errorStyle = { color: '#dc2626', fontSize: '12px', fontWeight: 600 }
const eyeButtonStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer' }
const submitStyle = { border: 'none', background: '#00843D', color: '#fff', borderRadius: '12px', padding: '14px 16px', fontWeight: 700, cursor: 'pointer', marginTop: '4px', fontSize: '15px' }
const forgotBoxStyle = { marginTop: '24px', textAlign: 'center' }
const forgotLinkStyle = { color: '#6b7280', fontSize: '14px', fontWeight: 500 }

export default LoginPage