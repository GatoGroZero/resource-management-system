import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ViewReservationModal from './ViewReservationModal'
import {
  approveReservation,
  cancelReservation,
  getReservationById,
  getReservations,
  rejectReservation,
} from '../../api/reservationApi'
import { showToast } from '../../utils/alertUtils'

function ReservationsPage() {
  const [reservationsPage, setReservationsPage] = useState(null)
  const [page, setPage] = useState(0)

  const [statusFilter, setStatusFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [requesterSearch, setRequesterSearch] = useState('')
  const [backendFilter, setBackendFilter] = useState('')

  const [selectedReservation, setSelectedReservation] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)

  const fetchReservations = async (customPage = page, customFilter = backendFilter) => {
    try {
      const data = await getReservations({
        page: customPage,
        size: 10,
        filter: customFilter,
      })
      setReservationsPage(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  useEffect(() => {
    fetchReservations(page, backendFilter)
  }, [page, backendFilter])

  const applyStatusFilter = (value) => {
    setPage(0)
    setStatusFilter(value)
    setResourceFilter('')
    setRequesterSearch('')

    if (value === 'PENDIENTE') setBackendFilter('PENDIENTE')
    else if (value === 'APROBADA') setBackendFilter('APROBADA')
    else if (value === 'RECHAZADA') setBackendFilter('RECHAZADA')
    else if (value === 'CANCELADA') setBackendFilter('CANCELADA')
    else setBackendFilter('')
  }

  const applyResourceFilter = (value) => {
    setPage(0)
    setStatusFilter('')
    setResourceFilter(value)
    setRequesterSearch('')

    if (value === 'SPACE') setBackendFilter('SPACE')
    else if (value === 'EQUIPMENT') setBackendFilter('EQUIPMENT')
    else setBackendFilter('')
  }

  const clearFilters = () => {
    setPage(0)
    setStatusFilter('')
    setResourceFilter('')
    setRequesterSearch('')
    setBackendFilter('')
  }

  const handlePrev = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (reservationsPage && !reservationsPage.last) setPage(page + 1)
  }

  const handleView = async (id) => {
    try {
      const data = await getReservationById(id)
      setSelectedReservation(data)
      setOpenViewModal(true)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveReservation(id, '')
      showToast('success', 'Reserva aprobada correctamente')
      fetchReservations()
    } catch (error) {
      const message = error?.response?.data?.message || 'Datos inválidos'
      showToast('error', message)
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectReservation(id, '')
      showToast('success', 'Reserva rechazada correctamente')
      fetchReservations()
    } catch (error) {
      const message = error?.response?.data?.message || 'Datos inválidos'
      showToast('error', message)
    }
  }

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id)
      showToast('success', 'Reserva cancelada correctamente')
      fetchReservations()
    } catch (error) {
      const message = error?.response?.data?.message || 'Datos inválidos'
      showToast('error', message)
    }
  }

  const filteredRows =
    reservationsPage?.content?.filter((item) =>
      item.requesterName.toLowerCase().includes(requesterSearch.toLowerCase().trim())
    ) || []

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div style={titleWrapStyle}>
          <div>
            <h1 style={titleStyle}>Reservas</h1>
            <p style={subtitleStyle}>Control de solicitudes de espacios físicos y equipamiento institucional.</p>
          </div>
        </div>
      </div>

      <div style={filtersPanelStyle}>
        <div style={filtersGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>ESTATUS DE SOLICITUD</label>
            <select value={statusFilter} onChange={(e) => applyStatusFilter(e.target.value)} style={selectStyle}>
              <option value="">Todos los Estatus</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="APROBADA">En préstamo</option>
              <option value="RECHAZADA">Rechazada</option>
              <option value="CANCELADA">Devuelta</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>DISPONIBILIDAD</label>
            <select value={resourceFilter} onChange={(e) => applyResourceFilter(e.target.value)} style={selectStyle}>
              <option value="">Todos los Tipos</option>
              <option value="SPACE">Espacio</option>
              <option value="EQUIPMENT">Equipo</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>SOLICITANTE</label>
            <input
              type="text"
              value={requesterSearch}
              onChange={(e) => setRequesterSearch(e.target.value)}
              placeholder="Nombre del usuario..."
              style={inputStyle}
            />
          </div>

          <div style={clearWrapStyle}>
            <button type="button" onClick={clearFilters} style={refreshButtonStyle}>
              ↺
            </button>
          </div>
        </div>
      </div>

      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>SOLICITANTE</th>
              <th style={thStyle}>CATEGORÍA</th>
              <th style={thStyle}>ESTADO</th>
              <th style={thStyle}>ESTATUS DE SOLICITUD</th>
              <th style={thStyle}>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((reservation, index) => (
              <tr key={reservation.id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdRequesterStyle}>
                  <div style={{ fontWeight: 700 }}>{reservation.requesterName}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {reservation.resourceName}
                  </div>
                </td>

                <td style={tdStyle}>
                  <span style={categoryBadgeStyle(reservation.resourceType)}>
                    {reservation.resourceType === 'SPACE' ? 'ESPACIO' : 'EQUIPO'}
                  </span>
                </td>

                <td style={tdStyle}>
                  <span style={activeBadgeStyle}>
                    Activo
                  </span>
                </td>

                <td style={tdStyle}>
                  <span style={requestStatusStyle(reservation.status)}>
                    {formatStatusLabel(reservation.status)}
                  </span>
                </td>

                <td style={tdStyle}>
                  <div style={actionsIconsStyle}>
                    <button type="button" onClick={() => handleView(reservation.id)} style={viewButtonStyle}>👁</button>

                    {reservation.status === 'PENDIENTE' && (
                      <>
                        <button type="button" onClick={() => handleApprove(reservation.id)} style={approveButtonStyle}>✓</button>
                        <button type="button" onClick={() => handleReject(reservation.id)} style={rejectButtonStyle}>↩</button>
                      </>
                    )}

                    {(reservation.status === 'PENDIENTE' || reservation.status === 'APROBADA') && (
                      <button type="button" onClick={() => handleCancel(reservation.id)} style={cancelActionButtonStyle}>⏻</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="5" style={emptyStateStyle}>
                  No hay reservas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={footerRowStyle}>
          <span style={pageTextStyle}>
            Página {reservationsPage ? reservationsPage.number + 1 : 1} de {reservationsPage ? Math.max(reservationsPage.totalPages, 1) : 1}
          </span>

          <div style={pagerButtonsStyle}>
            <button type="button" onClick={handlePrev} disabled={page === 0} style={pagerButtonStyle(page === 0)}>‹</button>
            <button type="button" onClick={handleNext} disabled={reservationsPage?.last} style={pagerButtonStyle(Boolean(reservationsPage?.last))}>›</button>
          </div>
        </div>
      </div>

      {openViewModal && (
        <ViewReservationModal
          reservation={selectedReservation}
          onClose={() => setOpenViewModal(false)}
        />
      )}
    </DashboardLayout>
  )
}

function formatStatusLabel(value) {
  if (value === 'PENDIENTE') return 'Pendiente'
  if (value === 'APROBADA') return 'En préstamo'
  if (value === 'RECHAZADA') return 'Rechazada'
  return 'Devuelta'
}

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '18px',
}

const titleWrapStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
}

const backIconStyle = {
  border: 'none',
  background: 'transparent',
  color: '#94a3b8',
  fontSize: '20px',
  cursor: 'pointer',
  marginTop: '2px',
}

const titleStyle = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#0b2f63',
  marginBottom: '6px',
}

const subtitleStyle = {
  color: '#64748b',
  fontSize: '14px',
}

const filtersPanelStyle = {
  background: '#ffffff',
  border: '1px solid #dfe6ee',
  borderRadius: '16px',
  padding: '14px',
  marginBottom: '18px',
  boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
}

const filtersGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr auto',
  gap: '12px',
  alignItems: 'end',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const labelStyle = {
  fontSize: '12px',
  fontWeight: 800,
  color: '#94a3b8',
}

const selectStyle = {
  border: '1px solid #d7dde5',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '12px 14px',
  outline: 'none',
  color: '#334155',
  fontSize: '14px',
}

const inputStyle = {
  border: '1px solid #d7dde5',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '12px 14px',
  outline: 'none',
  color: '#334155',
  fontSize: '14px',
}

const clearWrapStyle = {
  display: 'flex',
  alignItems: 'end',
}

const refreshButtonStyle = {
  width: '44px',
  height: '44px',
  border: '1px solid #d7dde5',
  background: '#ffffff',
  color: '#64748b',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 700,
}

const tableCardStyle = {
  background: '#ffffff',
  border: '1px solid #dfe6ee',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
}

const thStyle = {
  textAlign: 'left',
  padding: '16px 18px',
  background: '#f8fafc',
  borderBottom: '1px solid #e5e7eb',
  color: '#64748b',
  fontSize: '13px',
  fontWeight: 800,
  textTransform: 'uppercase',
}

const rowEvenStyle = { background: '#ffffff' }
const rowOddStyle = { background: '#fcfdff' }

const tdStyle = {
  padding: '16px 18px',
  borderBottom: '1px solid #eef2f7',
  fontSize: '14px',
  verticalAlign: 'middle',
}

const tdRequesterStyle = {
  ...tdStyle,
  color: '#0b2f63',
}

const categoryBadgeStyle = (type) => ({
  background: type === 'SPACE' ? '#f3e8ff' : '#dbeafe',
  color: type === 'SPACE' ? '#9333ea' : '#2563eb',
  padding: '5px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 700,
  display: 'inline-block',
})

const activeBadgeStyle = {
  background: '#dcfce7',
  color: '#15803d',
  padding: '5px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 700,
  display: 'inline-block',
}

const requestStatusStyle = (status) => {
  if (status === 'PENDIENTE') {
    return {
      background: '#fef3c7',
      color: '#d97706',
      padding: '5px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      display: 'inline-block',
    }
  }

  if (status === 'APROBADA') {
    return {
      background: '#dbeafe',
      color: '#2563eb',
      padding: '5px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      display: 'inline-block',
    }
  }

  if (status === 'RECHAZADA') {
    return {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '5px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      display: 'inline-block',
    }
  }

  return {
    background: '#dcfce7',
    color: '#15803d',
    padding: '5px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    display: 'inline-block',
  }
}

const actionsIconsStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}

const baseIconButtonStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  border: '1px solid transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
}

const viewButtonStyle = {
  ...baseIconButtonStyle,
  background: '#f8fafc',
  color: '#64748b',
  borderColor: '#e5e7eb',
}

const approveButtonStyle = {
  ...baseIconButtonStyle,
  background: '#eff6ff',
  color: '#2563eb',
  borderColor: '#bfdbfe',
}

const rejectButtonStyle = {
  ...baseIconButtonStyle,
  background: '#fff7ed',
  color: '#ea580c',
  borderColor: '#fed7aa',
}

const cancelActionButtonStyle = {
  ...baseIconButtonStyle,
  background: '#fef2f2',
  color: '#dc2626',
  borderColor: '#fecaca',
}

const footerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 18px',
  background: '#ffffff',
}

const pageTextStyle = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: 500,
}

const pagerButtonsStyle = {
  display: 'flex',
  gap: '8px',
}

const pagerButtonStyle = (disabled) => ({
  width: '36px',
  height: '36px',
  border: '1px solid #e5e7eb',
  background: disabled ? '#f8fafc' : '#ffffff',
  borderRadius: '10px',
  color: disabled ? '#cbd5e1' : '#475569',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: 700,
})

const emptyStateStyle = {
  padding: '30px 18px',
  textAlign: 'center',
  color: '#94a3b8',
  fontSize: '14px',
}

export default ReservationsPage