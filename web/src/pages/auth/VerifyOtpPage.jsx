import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { verifyOtpRequest } from '../../api/authApi'
import { showToast } from '../../utils/alertUtils'
import AuthShell from '../../components/auth/AuthShell'

const schema = z.object({
  code: z.string().min(6, 'El código debe tener 6 dígitos').max(6, 'El código debe tener 6 dígitos'),
})

function VerifyOtpPage() {
  const navigate = useNavigate()
  const email = localStorage.getItem('resetEmail') || ''

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await verifyOtpRequest({
        email,
        code: data.code,
      })

      localStorage.setItem('resetCode', data.code)
      showToast('success', 'Código verificado correctamente')
      navigate('/reset-password')
    } catch (error) {
      const message = error?.response?.data?.message || 'Código inválido'
      showToast('error', message)
    }
  }

  return (
    <AuthShell
      title="Verificar código"
      subtitle="Ingresa el código de 6 dígitos enviado a tu correo."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="auth-field">
          <label className="auth-label">Código</label>
          <input
            type="text"
            maxLength="6"
            placeholder="Ingresa el código de verificación"
            {...register('code')}//validar que el código sea de 6 dígitos
            className="auth-input"
          />
          {errors.code && <span className="auth-error">{errors.code.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? 'Verificando...' : 'Verificar código'}
        </button>
      </form>

      <div className="auth-helper">
        <Link to="/forgot-password" className="auth-link">
          Reenviar o cambiar correo
        </Link>
      </div>
    </AuthShell>
  )
}

export default VerifyOtpPage