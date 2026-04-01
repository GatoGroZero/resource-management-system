import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import { getAuditRecords } from '../../api/auditApi'
import { showToast } from '../../utils/alertUtils'

function HistoryPage() {
  const [auditPage, setAuditPage] = useState(null)
  const [page, setPage] = useState(0)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [backendFilter, setBackendFilter] = useState('')

  const fetchAudit = async (customPage = page, customFilter = backendFilter) => {
    try {
      const data = await getAuditRecords({
        page: customPage,
        size: 10,
        filter: customFilter,
      })
      setAuditPage(data)
    } catch {
      showToast('error', 'Error al cargar historial')
    }
  }

  useEffect(() => {
    fetchAudit(page, backendFilter)
  }, [page, backendFilter])

  const applyTypeFilter = (value) => {
    setPage(0)
    setTypeFilter(value)
    setStatusFilter('')
    setBackendFilter(value)
  }

  const applyStatusFilter = (value) => {
    setPage(0)
    setTypeFilter('')
    setStatusFilter(value)
    setBackendFilter(value)
  }

  const clearFilters = () => {
    setPage(0)
    setTypeFilter('')
    setStatusFilter('')
    setBackendFilter('')
  }

  const handlePrev = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (auditPage && !auditPage.last) setPage(page + 1)
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Historial"
        subtitle="Consulta y análisis de registros históricos de recursos."
      />

      {/* Filtros */}
      <div style={filtersPanelStyle}>
        <div style={filtersGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>DISPONIBILIDAD</label>
            <select
              value={typeFilter}
              onChange={(e) => applyTypeFilter(e.target.value)}
              style={selectStyle}
              disabled={statusFilter !== ''}
            >
              <option value="">Todos los Tipos</option>
              <option value="SPACE">Espacio</option>
              <option value="EQUIPMENT">Equipo</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>ESTATUS FINAL</label>
            <select
              value={statusFilter}
              onChange={(e) => applyStatusFilter(e.target.value)}
              style={selectStyle}
              disabled={typeFilter !== ''}
            >
              <option value="">Todos los Estatus</option>
              <option value="APROBADA">Aprobada</option>
              <option value="RECHAZADA">Rechazada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <div style={clearWrapStyle}>
            <button type="button" onClick={clearFilters} style={refreshButtonStyle}>
              ↺
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>RECURSO / SOLICITANTE</th>
              <th style={thStyle}>CATEGORÍA</th>
              <th style={thStyle}>FECHA</th>
              <th style={thStyle}>HORARIO</th>
              <th style={thStyle}>ESTATUS FINAL</th>
            </tr>
          </thead>

          <tbody>
            {auditPage?.content?.length > 0 ? (
              auditPage.content.map((record, index) => (
                <tr key={record.id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                  <td style={tdStyle}>
                    <div>
                      <div style={resourceNameStyle}>{record.resourceName}</div>
                      <div style={requesterStyle}>{record.requesterName}</div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={categoryBadge(record.resourceType)}>
                      {record.resourceType === 'SPACE' ? '🏢 Espacio' : '📦 Equipo'}
                    </span>
                  </td>
                  <td style={tdMutedStyle}>{record.reservationDate}</td>
                  <td style={tdMutedStyle}>{record.schedule}</td>
                  <td style={tdStyle}>
                    <span style={statusBadge(record.status)}>
                      {formatStatus(record.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={emptyStyle}>
                  No hay registros de auditoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={footerRowStyle}>
          <span style={pageTextStyle}>
            Página {auditPage ? auditPage.number + 1 : 1} de {auditPage ? Math.max(auditPage.totalPages, 1) : 1}
          </span>

          <div style={pagerButtonsStyle}>
            <button type="button" onClick={handlePrev} disabled={page === 0} style={pagerButtonStyle(page === 0)}>‹</button>
            <button type="button" onClick={handleNext} disabled={auditPage?.last} style={pagerButtonStyle(Boolean(auditPage?.last))}>›</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function formatStatus(value) {
  if (value === 'APROBADA') return 'Aprobada'
  if (value === 'RECHAZADA') return 'Rechazada'
  if (value === 'CANCELADA') return 'Cancelada'
  return value
}

function categoryBadge(type) {
  const isSpace = type === 'SPACE'
  return {
    background: isSpace ? '#f3e8ff' : '#dbeafe',
    color: isSpace ? '#7c3aed' : '#2563eb',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 700,
    display: 'inline-block',
  }
}

function statusBadge(status) {
  const colors = {
    APROBADA: { bg: '#dcfce7', color: '#15803d' },
    RECHAZADA: { bg: '#fee2e2', color: '#dc2626' },
    CANCELADA: { bg: '#f1f5f9', color: '#64748b' },
  }
  const c = colors[status] || colors.CANCELADA
  return {
    background: c.bg,
    color: c.color,
    padding: '5px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    display: 'inline-block',
  }
}

const filtersPanelStyle = { background: '#ffffff', border: '1px solid #dfe6ee', borderRadius: '16px', padding: '14px', marginBottom: '18px', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }
const filtersGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' }
const labelStyle = { fontSize: '12px', fontWeight: 800, color: '#94a3b8' }
const selectStyle = { border: '1px solid #d7dde5', background: '#ffffff', borderRadius: '12px', padding: '12px 14px', outline: 'none', color: '#334155', fontSize: '14px' }
const clearWrapStyle = { display: 'flex', alignItems: 'end' }
const refreshButtonStyle = { width: '44px', height: '44px', border: '1px solid #d7dde5', background: '#ffffff', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }
const tableCardStyle = { background: '#ffffff', border: '1px solid #dfe6ee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }
const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const thStyle = { textAlign: 'left', padding: '16px 18px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', color: '#64748b', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }
const rowEvenStyle = { background: '#ffffff' }
const rowOddStyle = { background: '#fcfdff' }
const tdStyle = { padding: '16px 18px', borderBottom: '1px solid #eef2f7', fontSize: '14px', verticalAlign: 'middle' }
const tdMutedStyle = { ...tdStyle, color: '#64748b' }
const resourceNameStyle = { color: '#111827', fontWeight: 700, fontSize: '14px' }
const requesterStyle = { color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }
const emptyStyle = { padding: '48px 18px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }
const footerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: '#ffffff' }
const pageTextStyle = { color: '#64748b', fontSize: '14px', fontWeight: 500 }
const pagerButtonsStyle = { display: 'flex', gap: '8px' }
const pagerButtonStyle = (disabled) => ({ width: '36px', height: '36px', border: '1px solid #e5e7eb', background: disabled ? '#f8fafc' : '#ffffff', borderRadius: '10px', color: disabled ? '#cbd5e1' : '#475569', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 700 })

export default HistoryPage