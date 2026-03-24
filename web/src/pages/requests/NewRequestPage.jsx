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
        subtitle="Registra una nueva solicitud de recurso"
      />

      <div style={cardStyle}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AppInput
            label="Título"
            placeholder="Ej. Prestamo de proyector"
            error={errors.title?.message}
            {...register('title')}
          />

          <AppInput
            label="Descripción"
            placeholder="Describe tu solicitud"
            error={errors.description?.message}
            {...register('description')}
          />

          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear solicitud'}
          </AppButton>
        </form>
      </div>
    </DashboardLayout>
  )
}

const cardStyle = {
  background: '#ffffff',
  padding: '1.2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  maxWidth: '600px',
}

export default NewRequestPage