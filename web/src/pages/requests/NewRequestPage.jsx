import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'
import { createRequest } from '../../api/requestApi'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../utils/alertUtils'

const schema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
})

function NewRequestPage() {
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await createRequest({
        ...data,
        requesterEmail: user?.email,
      })

      showToast('success', 'Solicitud creada correctamente')
      reset()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo crear la solicitud'
      showToast('error', message)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Nueva Solicitud"
        subtitle="Completa el formulario para registrar una nueva solicitud"
      />

      <div style={cardStyle}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AppInput
            label="Título de la solicitud"
            placeholder="Ej. Préstamo de proyector"
            error={errors.title?.message}
            {...register('title')}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontWeight: '600', color: '#022859' }}>Descripción</label>
            <textarea
              placeholder="Describe el motivo o contexto de la solicitud"
              {...register('description')}
              style={textareaStyle}
            />
            {errors.description && (
              <span style={{ color: '#8B0000', fontSize: '0.85rem' }}>
                {errors.description.message}
              </span>
            )}
          </div>

          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Enviar solicitud'}
          </AppButton>
        </form>
      </div>
    </DashboardLayout>
  )
}

const cardStyle = {
  background: '#FFFFFF',
  padding: '1.3rem',
  borderRadius: '16px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  border: '2px solid #C8E6C9',
  maxWidth: '760px',
}

const textareaStyle = {
  minHeight: '130px',
  padding: '0.95rem 1rem',
  borderRadius: '10px',
  border: '1px solid #E5E7EB',
  outline: 'none',
  background: '#F5F5F5',
  color: '#022859',
  resize: 'vertical',
  font: 'inherit',
}

export default NewRequestPage