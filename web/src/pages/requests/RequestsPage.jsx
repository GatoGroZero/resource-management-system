import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { getAllRequests } from '../../api/requestApi'
import { showToast } from '../../utils/alertUtils'

function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchRequests()
  }, [])

  return (
    <DashboardLayout>
      <PageHeader
        title="Solicitudes"
        subtitle="Consulta las solicitudes registradas"
      />

      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : requests.length === 0 ? (
        <div style={cardStyle}>
          <p>No hay solicitudes registradas.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {requests.map((request) => (
            <div key={request.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <h3 style={{ color: '#022859' }}>{request.title}</h3>
                <StatusBadge status={request.status} />
              </div>

              <p style={{ marginBottom: '0.6rem', color: '#022859' }}>
                {request.description}
              </p>

              <p style={{ color: '#8A9BB8', fontSize: '0.92rem' }}>
                Solicitante: {request.requester?.name} {request.requester?.lastName}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

const cardStyle = {
  background: '#FFFFFF',
  padding: '1.2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  border: '2px solid #C8E6C9',
}

export default RequestsPage