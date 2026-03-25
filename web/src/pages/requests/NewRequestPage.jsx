import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import AppInput from '../../components/common/AppInput'
import AppButton from '../../components/common/AppButton'
import AppCard from '../../components/common/AppCard'
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

      <AppCard style={formCardStyle}>
        <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
          <AppInput
            label="Título de la solicitud"
            placeholder="Escribe el título de la solicitud"
            error={errors.title?.message}
            {...register('title')}
          />

          <div style={fieldStyle}>
            <label style={labelStyle}>Descripción</label>
            <textarea
              placeholder="Escribe una descripción detallada"
              {...register('description')}
              style={textareaStyle}
            />
            {errors.description && (
              <span style={errorStyle}>{errors.description.message}</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AppButton type="submit" disabled={isSubmitting} style={{ minWidth: '220px' }}>
              {isSubmitting ? 'Guardando...' : 'Enviar solicitud'}
            </AppButton>
          </div>
        </form>
      </AppCard>
    </DashboardLayout>
  )
}

const formCardStyle = {
  maxWidth: '820px',
  padding: '1.5rem',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
}

const labelStyle = {
  fontWeight: '600',
  color: '#022859',
}

const textareaStyle = {
  minHeight: '150px',
  padding: '0.95rem 1rem',
  borderRadius: '12px',
  border: '1px solid #D8DEE8',
  outline: 'none',
  background: '#F5F7FA',
  color: '#022859',
  resize: 'vertical',
  font: 'inherit',
}

const errorStyle = {
  color: '#8B0000',
  fontSize: '0.85rem',
}

export default NewRequestPage