import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import AppButton from '../../components/common/AppButton'
import AppCard from '../../components/common/AppCard'
import { approveRequest, getAllRequests, rejectRequest } from '../../api/requestApi'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../utils/alertUtils'

function RequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === 'ADMIN'

  const fetchRequests = async () => {
    try {
      const data = await getAllRequests()
      setRequests(data)
    } catch {
      showToast('error', 'No se pudieron cargar las solicitudes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = async (id) => {
    try {
      await approveRequest(id, {
        adminEmail: user?.email,
        responseMessage: 'Solicitud aprobada correctamente',
      })
      showToast('success', 'Solicitud aprobada')
      fetchRequests()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo aprobar'
      showToast('error', message)
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectRequest(id, {
        adminEmail: user?.email,
        responseMessage: 'Solicitud rechazada',
      })
      showToast('warning', 'Solicitud rechazada')
      fetchRequests()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo rechazar'
      showToast('error', message)
    }
  }

  const visibleRequests = isAdmin
    ? requests
    : requests.filter((request) => request.requester?.email === user?.email)

  return (
    <DashboardLayout>
      <PageHeader
        title="Solicitudes"
        subtitle={isAdmin ? 'Administra las solicitudes registradas' : 'Consulta tus solicitudes registradas'}
      />

      {loading ? (
        <AppCard>
          <p style={mutedStyle}>Cargando solicitudes...</p>
        </AppCard>
      ) : visibleRequests.length === 0 ? (
        <AppCard>
          <p style={mutedStyle}>No hay solicitudes registradas.</p>
        </AppCard>
      ) : (
        <div style={listStyle}>
          {visibleRequests.map((request) => (
            <AppCard key={request.id} style={requestCardStyle}>
              <div style={requestTopRowStyle}>
                <div>
                  <h3 style={requestTitleStyle}>{request.title}</h3>
                  <p style={mutedStyle}>
                    {request.requester?.name} {request.requester?.lastName}
                  </p>
                </div>

                <StatusBadge status={request.status} />
              </div>

              <div style={detailBoxStyle}>
                <span style={detailLabelStyle}>Descripción</span>
                <p style={detailValueStyle}>{request.description}</p>
              </div>

              {request.responseMessage && (
                <div style={responseBoxStyle}>
                  <span style={detailLabelStyle}>Respuesta</span>
                  <p style={responseTextStyle}>{request.responseMessage}</p>
                </div>
              )}

              {isAdmin && request.status === 'PENDING' && (
                <div style={actionsRowStyle}>
                  <AppButton onClick={() => handleApprove(request.id)}>
                    Aprobar
                  </AppButton>

                  <AppButton
                    onClick={() => handleReject(request.id)}
                    style={{ background: '#8B0000' }}
                  >
                    Rechazar
                  </AppButton>
                </div>
              )}
            </AppCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

const listStyle = {
  display: 'grid',
  gap: '1rem',
}

const requestCardStyle = {
  padding: '1.4rem',
}

const requestTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
  marginBottom: '1rem',
}

const requestTitleStyle = {
  color: '#022859',
  fontSize: '1.15rem',
  marginBottom: '0.3rem',
}

const mutedStyle = {
  color: '#8A9BB8',
  fontSize: '0.92rem',
}

const detailBoxStyle = {
  background: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: '14px',
  padding: '1rem',
  marginBottom: '0.85rem',
}

const responseBoxStyle = {
  background: '#F0FFF4',
  border: '1px solid #C8E6C9',
  borderRadius: '14px',
  padding: '1rem',
  marginBottom: '0.85rem',
}

const detailLabelStyle = {
  display: 'block',
  color: '#8A9BB8',
  fontSize: '0.85rem',
  marginBottom: '0.4rem',
}

const detailValueStyle = {
  color: '#022859',
  lineHeight: '1.6',
}

const responseTextStyle = {
  color: '#01402E',
  lineHeight: '1.6',
}

const actionsRowStyle = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  marginTop: '0.5rem',
}

export default RequestsPage