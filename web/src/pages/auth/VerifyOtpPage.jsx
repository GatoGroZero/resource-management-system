import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { verifyOtpRequest } from '../../api/authApi'
import { showToast } from '../../utils/alertUtils'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'

const schema = z.object({
  code: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos'),
})

function VerifyOtpPage() {
  const navigate = useNavigate()
  const recoveryEmail = sessionStorage.getItem('recoveryEmail')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await verifyOtpRequest({
        email: recoveryEmail,
        code: data.code,
      })
      sessionStorage.setItem('verifiedOtp', data.code)
      showToast('success', 'Código válido')
      navigate('/reset-password')
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'Código inválido')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Verificar código</h1>
        <p className="auth-subtitle">Ingresa el NIP de 6 dígitos recibido</p>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <AppInput
            label="Código OTP"
            placeholder="123456"
            registration={register('code')}
            error={errors.code?.message}
          />

          <AppButton type="submit" variant="primary">
            {isSubmitting ? 'Verificando...' : 'Verificar código'}
          </AppButton>
        </form>

        <div className="link-text">
          <Link to="/forgot-password">Volver</Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtpPage