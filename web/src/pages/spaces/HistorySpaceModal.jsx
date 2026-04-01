import { useEffect, useState } from 'react'
import { getReservationsBySpace } from '../../api/reservationApi'

function HistorySpaceModal({ space, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (space?.id) {
      setLoading(true)
      getReservationsBySpace(space.id)
        .then((data) => setHistory(data))
        .catch(() => setHistory([]))
        .finally(() => setLoading(false))
    }
  }, [space])

  if (!space) return null

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>Historial de Reservas</h2>
            <div style={subtitleRowStyle}>
              <span style={iconStyle}>🏢</span>
              <span style={subtitleStyle}>{space.name}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        {/* Content */}
        <div style={bodyStyle}>
          {loading && <p style={emptyStyle}>Cargando...</p>}

          {!loading && history.length === 0 && (
            <div style={emptyBlockStyle}>
              <span style={emptyIconStyle}>ℹ</span>
              <p style={emptyStyle}>Este espacio no tiene registros de reservas previas.</p>
            </div>
          )}

          {!loading && history.length > 0 && (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>SOLICITANTE</th>
                  <th style={thStyle}>FECHA</th>
                  <th style={thStyle}>HORARIO</th>
                  <th style={thStyle}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((item) => (
                  <tr key={item.id} style={trStyle}>
                    <td style={tdNameStyle}>{item.requesterName}</td>
                    <td style={tdStyle}>{item.reservationDate}</td>
                    <td style={tdStyle}>{item.schedule}</td>
                    <td style={tdStyle}>
                      <span style={statusBadge(item.status)}>
                        {formatStatus(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <span style={footerTextStyle}>Últimos 10 registros</span>
        </div>
      </div>
    </div>
  )
}

function formatStatus(value) {
  if (value === 'PENDIENTE') return 'Pendiente'
  if (value === 'APROBADA') return 'Aprobada'
  if (value === 'RECHAZADA') return 'Rechazada'
  if (value === 'CANCELADA') return 'Cancelada'
  return value
}

function statusBadge(status) {
  const colors = {
    PENDIENTE: { bg: '#FEF3C7', color: '#92400E' },
    APROBADA: { bg: '#DCFCE7', color: '#15803D' },
    RECHAZADA: { bg: '#FEE2E2', color: '#DC2626' },
    CANCELADA: { bg: '#F1F5F9', color: '#64748B' },
  }
  const c = colors[status] || colors.CANCELADA
  return { background: c.bg, color: c.color, padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, display: 'inline-block' }
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 120 }
const modalStyle = { width: '100%', maxWidth: '640px', maxHeight: '85vh', background: '#ffffff', borderRadius: '18px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }
const titleStyle = { fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '6px' }
const subtitleRowStyle = { display: 'flex', alignItems: 'center', gap: '6px' }
const iconStyle = { fontSize: '14px' }
const subtitleStyle = { fontSize: '13px', fontWeight: 700, color: '#00843D', textTransform: 'uppercase', letterSpacing: '0.5px' }
const closeButtonStyle = { border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '22px', cursor: 'pointer', padding: '4px' }
const bodyStyle = { flex: 1, overflowY: 'auto', padding: '20px 24px' }
const emptyBlockStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: '12px' }
const emptyIconStyle = { width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#cbd5e1' }
const emptyStyle = { color: '#94a3b8', fontSize: '14px', textAlign: 'center' }
const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const thStyle = { textAlign: 'left', padding: '12px 0', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }
const trStyle = { borderBottom: '1px solid #f8fafc' }
const tdStyle = { padding: '14px 0', fontSize: '13px', color: '#64748b' }
const tdNameStyle = { ...tdStyle, color: '#111827', fontWeight: 600 }
const footerStyle = { padding: '14px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', textAlign: 'center' }
const footerTextStyle = { fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }

export default HistorySpaceModal