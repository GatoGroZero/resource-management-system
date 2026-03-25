import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import AppButton from '../../components/common/AppButton'
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
        subtitle={isAdmin ? 'Administra las solicitudes registradas' : 'Consulta tus solicitudes'}
      />

      {loading ? (
        <div style={cardStyle}>
          <p style={{ color: '#8A9BB8' }}>Cargando solicitudes...</p>
        </div>
      ) : visibleRequests.length === 0 ? (
        <div style={cardStyle}>
          <p style={{ color: '#8A9BB8' }}>No hay solicitudes registradas.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {visibleRequests.map((request) => (
            <div key={request.id} style={cardStyle}>
              <div style={topRowStyle}>
                <div>
                  <h3 style={titleStyle}>{request.title}</h3>
                  <p style={mutedStyle}>
                    Solicitante: {request.requester?.name} {request.requester?.lastName}
                  </p>
                </div>

                <StatusBadge status={request.status} />
              </div>

              <p style={descriptionStyle}>{request.description}</p>

              {request.responseMessage && (
                <div style={responseBoxStyle}>
                  <strong style={{ color: '#01402E' }}>Respuesta:</strong>{' '}
                  <span style={{ color: '#01402E' }}>{request.responseMessage}</span>
                </div>
              )}

              {isAdmin && request.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
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
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

const cardStyle = {
  background: '#FFFFFF',
  padding: '1.3rem',
  borderRadius: '16px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  border: '2px solid #C8E6C9',
}

const topRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
  marginBottom: '0.8rem',
}

const titleStyle = {
  color: '#022859',
  marginBottom: '0.35rem',
}

const mutedStyle = {
  color: '#8A9BB8',
  fontSize: '0.92rem',
}

const descriptionStyle = {
  color: '#022859',
  lineHeight: '1.6',
  marginBottom: '0.9rem',
}

const responseBoxStyle = {
  background: '#F0FFF4',
  border: '1px solid #C8E6C9',
  padding: '0.8rem',
  borderRadius: '10px',
  marginTop: '0.5rem',
}

export default RequestsPage