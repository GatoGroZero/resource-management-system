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
      } catch (error) {
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
        subtitle="Listado de solicitudes registradas"
      />

      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : requests.length === 0 ? (
        <p>No hay solicitudes registradas.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {requests.map((request) => (
            <div key={request.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <h3>{request.title}</h3>
                <StatusBadge status={request.status} />
              </div>
              <p style={{ marginBottom: '0.5rem' }}>{request.description}</p>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
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
  background: '#ffffff',
  padding: '1.2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
}

export default RequestsPage