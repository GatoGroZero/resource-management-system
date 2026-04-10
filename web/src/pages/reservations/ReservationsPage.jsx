import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getReservationById, getReservations, approveReservation, rejectReservation, cancelReservation, returnReservation } from '../../api/reservationApi'
import { showToast } from '../../utils/alertUtils'

function ReservationsPage() {
  const [reservationsPage, setReservationsPage] = useState(null)
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [requesterSearch, setRequesterSearch] = useState('')
  const [backendFilter, setBackendFilter] = useState('')

  // Modales
  const [viewItem, setViewItem] = useState(null)
  const [approveItem, setApproveItem] = useState(null)
  const [rejectItem, setRejectItem] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')
  const [returnItem, setReturnItem] = useState(null)
  const [returnForm, setReturnForm] = useState({ condition: '', description: '' })
  const [returnErrors, setReturnErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchReservations = async (p = page, f = backendFilter) => {
    try { setReservationsPage(await getReservations({ page: p, size: 10, filter: f })) }
    catch { showToast('error', 'Error al cargar reservas') }
  }

  useEffect(() => { fetchReservations(page, backendFilter) }, [page, backendFilter])

  const applyStatusFilter = (v) => { setPage(0); setStatusFilter(v); setResourceFilter(''); setRequesterSearch(''); setBackendFilter(v) }
  const applyResourceFilter = (v) => { setPage(0); setStatusFilter(''); setResourceFilter(v); setRequesterSearch(''); setBackendFilter(v) }
  const clearFilters = () => { setPage(0); setStatusFilter(''); setResourceFilter(''); setRequesterSearch(''); setBackendFilter('') }

  const handleView = async (id) => {
    try { setViewItem(await getReservationById(id)) } catch { showToast('error', 'Error') }
  }

  // Aprobar
  const handleConfirmApprove = async () => {
    setLoading(true)
    try { await approveReservation(approveItem.id, ''); showToast('success', 'Reserva aprobada'); setApproveItem(null); fetchReservations() }
    catch (e) { showToast('error', e?.response?.data?.message || 'Error') }
    finally { setLoading(false) }
  }

  // Rechazar
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) { setRejectError('Debe proporcionar un motivo de rechazo'); return }
    if (rejectReason.trim().length < 10) { setRejectError('Mínimo 10 caracteres'); return }
    setLoading(true)
    try { await rejectReservation(rejectItem.id, rejectReason.trim()); showToast('success', 'Reserva rechazada'); setRejectItem(null); setRejectReason(''); fetchReservations() }
    catch (e) { showToast('error', e?.response?.data?.message || 'Error') }
    finally { setLoading(false) }
  }

  // Devolver
  const handleConfirmReturn = async () => {
    const errs = {}
    if (!returnForm.condition) errs.condition = 'Debe seleccionar el estado de devolución'
    if (returnForm.condition === 'DAÑADO' && !returnForm.description.trim()) errs.description = 'Debe describir el daño'
    if (returnForm.condition === 'DAÑADO' && returnForm.description.trim().length < 10) errs.description = 'Mínimo 10 caracteres'
    setReturnErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      await returnReservation(returnItem.id, { returnCondition: returnForm.condition, returnDescription: returnForm.condition === 'DAÑADO' ? returnForm.description.trim() : null })
      showToast('success', 'Devolución registrada')
      setReturnItem(null); setReturnForm({ condition: '', description: '' }); fetchReservations()
    } catch (e) { showToast('error', e?.response?.data?.message || 'Error') }
    finally { setLoading(false) }
  }

  const filteredRows = reservationsPage?.content?.filter((i) => i.requesterName.toLowerCase().includes(requesterSearch.toLowerCase().trim())) || []

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Reservas</h1>
          <p style={subtitleStyle}>Control de solicitudes de espacios físicos y equipamiento institucional.</p>
        </div>
      </div>

      {/* Filtros */}
      <div style={filtersPanelStyle}>
        <div style={filtersGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>ESTATUS DE SOLICITUD</label>
            <select value={statusFilter} onChange={(e) => applyStatusFilter(e.target.value)} style={selectStyle}>
              <option value="">Todos los Estatus</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="APROBADA">Aprobada (En préstamo)</option>
              <option value="RECHAZADA">Rechazada</option>
              <option value="DEVUELTA">Devuelta</option>
              <option value="CANCELADA">Cancelada</option>
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
            <input type="text" value={requesterSearch} onChange={(e) => setRequesterSearch(e.target.value)} placeholder="Nombre del usuario..." style={inputStyle} />
          </div>
          <div style={clearWrapStyle}><button type="button" onClick={clearFilters} style={refreshBtnStyle}>↺</button></div>
        </div>
      </div>

      {/* Tabla */}
      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead><tr>
            <th style={thStyle}>SOLICITANTE</th>
            <th style={thStyle}>CATEGORÍA</th>
            <th style={thStyle}>ESTADO</th>
            <th style={thStyle}>ESTATUS DE SOLICITUD</th>
            <th style={thStyle}>ACCIONES</th>
          </tr></thead>
          <tbody>
            {filteredRows.length > 0 ? filteredRows.map((r, idx) => (
              <tr key={r.id} style={idx % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdReqStyle}>
                  <div style={{ fontWeight: 700 }}>{r.requesterName}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>{r.resourceName}</div>
                </td>
                <td style={tdStyle}><span style={catBadge(r.resourceType)}>{r.resourceType === 'SPACE' ? 'ESPACIO' : 'EQUIPO'}</span></td>
                <td style={tdStyle}><span style={activeBadge}>Activo</span></td>
                <td style={tdStyle}><span style={statusBadge(r.status)}>{fmtStatus(r.status)}</span></td>
                <td style={tdStyle}>
                  <div style={actionsStyle}>
                    {/* Ojo - siempre activo */}
                    <button type="button" onClick={() => handleView(r.id)} style={aBtn('#eef6ff', '#2563eb', '#bfdbfe')} title="Ver detalle">👁</button>
                    {/* Palomita - solo PENDIENTE */}
                    <button type="button" onClick={() => r.status === 'PENDIENTE' && setApproveItem(r)} disabled={r.status !== 'PENDIENTE'} style={r.status === 'PENDIENTE' ? aBtn('#ecfdf5', '#15803d', '#bbf7d0') : disBtn} title="Aprobar">✓</button>
                    {/* Devolver - solo APROBADA */}
                    <button type="button" onClick={() => r.status === 'APROBADA' && setReturnItem(r)} disabled={r.status !== 'APROBADA'} style={r.status === 'APROBADA' ? aBtn('#eff6ff', '#2563eb', '#bfdbfe') : disBtn} title="Devolver">↩</button>
                    {/* Rechazar - solo PENDIENTE */}
                    <button type="button" onClick={() => r.status === 'PENDIENTE' && setRejectItem(r)} disabled={r.status !== 'PENDIENTE'} style={r.status === 'PENDIENTE' ? aBtn('#fef2f2', '#dc2626', '#fecaca') : disBtn} title="Rechazar">✖</button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={5} style={emptyStyle}>No hay reservas registradas</td></tr>}
          </tbody>
        </table>
        <div style={footerRowStyle}>
          <span style={pageTextStyle}>Página {reservationsPage ? reservationsPage.number + 1 : 1} de {reservationsPage ? Math.max(reservationsPage.totalPages, 1) : 1}</span>
          <div style={pagerStyle}>
            <button type="button" onClick={() => page > 0 && setPage(page - 1)} disabled={page === 0} style={pgBtn(page === 0)}>‹</button>
            <button type="button" onClick={() => !reservationsPage?.last && setPage(page + 1)} disabled={reservationsPage?.last} style={pgBtn(Boolean(reservationsPage?.last))}>›</button>
          </div>
        </div>
      </div>

      {/* ========== MODAL: VER DETALLE ========== */}
      {viewItem && (
        <div style={ovStyle}><div style={mdStyle}>
          <div style={mdHead}>
            <div><h3 style={mdTitle}>Detalle de Reserva</h3><p style={mdSub}>Información registrada de la reserva</p></div>
            <button type="button" onClick={() => setViewItem(null)} style={clBtn}>×</button>
          </div>
          <div style={mdBody}>
            <Section t="Solicitante">
              <div style={dGrid}>
                <Det l="Solicitante" v={viewItem.requesterName} />
                <Det l="Correo" v={viewItem.requesterEmail} />
                <Det l="Tipo de solicitante" v={viewItem.requesterType || '—'} />
              </div>
            </Section>

            <Section t="Reserva">
              <div style={dGrid}>
                <Det l="Tipo de recurso" v={viewItem.resourceType === 'SPACE' ? 'Espacio' : 'Equipo'} />
                <Det l="Recurso" v={viewItem.resourceName} />
                <Det l="Fecha inicio" v={viewItem.reservationDate} />
                <Det l="Hora inicio" v={viewItem.startTime} />
                <Det l="Fecha devolución" v={viewItem.endDate || viewItem.reservationDate} />
                <Det l="Hora fin" v={viewItem.endTime} />
                <Det l="Estado" v={fmtStatus(viewItem.status)} />
              </div>
            </Section>

            <Section t="Notas">
              <Det l="Motivo" v={viewItem.purpose || '—'} fw />
              <Det l="Observaciones" v={viewItem.observations || '—'} fw />
              <Det l="Comentario administrativo" v={viewItem.adminComment || '—'} fw />
            </Section>

            {(viewItem.returnCondition || viewItem.returnDescription || viewItem.returnedAt) && (
              <Section t="Devolución">
                <div style={dGrid}>
                  {viewItem.returnCondition && <Det l="Estado devolución" v={viewItem.returnCondition} />}
                  {viewItem.returnedAt && <Det l="Devuelto el" v={viewItem.returnedAt} />}
                </div>
                {viewItem.returnDescription && <Det l="Descripción devolución" v={viewItem.returnDescription} fw />}
              </Section>
            )}
          </div>
          <div style={mdFoot}><button type="button" onClick={() => setViewItem(null)} style={mdClBtn}>Cerrar</button></div>
        </div></div>
      )}

      {/* ========== MODAL: APROBAR ========== */}
      {approveItem && (
        <div style={ovStyle}><div style={{ ...mdStyle, maxWidth: '440px' }}>
          <div style={confirmBody}>
            <div style={confirmIcon('ecfdf5')}>✓</div>
            <h3 style={confirmTitle}>Aprobar Reserva</h3>
            <p style={confirmText}>¿Estás seguro que deseas aprobar la solicitud de <strong>{approveItem.requesterName}</strong> para <strong>{approveItem.resourceName}</strong>?</p>
            <div style={confirmActions}>
              <button type="button" onClick={() => setApproveItem(null)} style={confirmCancelBtn}>Cancelar</button>
              <button type="button" onClick={handleConfirmApprove} disabled={loading} style={confirmOkBtn('#00843D')}>{loading ? 'Procesando...' : 'Sí, aprobar'}</button>
            </div>
          </div>
        </div></div>
      )}

      {/* ========== MODAL: RECHAZAR CON MOTIVO ========== */}
      {rejectItem && (
        <div style={ovStyle}><div style={{ ...mdStyle, maxWidth: '500px' }}>
          <div style={mdHead}>
            <div><h3 style={mdTitle}>Rechazar Reserva</h3><p style={mdSub}>Proporciona un motivo para el rechazo</p></div>
            <button type="button" onClick={() => { setRejectItem(null); setRejectReason(''); setRejectError('') }} style={clBtn}>×</button>
          </div>
          <div style={mdBody}>
            <div style={rejectInfoBox}>
              <span style={rejectInfoLabel}>Solicitante</span>
              <p style={rejectInfoValue}>{rejectItem.requesterName}</p>
              <span style={{ ...rejectInfoLabel, marginTop: '8px' }}>Recurso</span>
              <p style={rejectInfoValue}>{rejectItem.resourceName}</p>
            </div>
            <div style={fldStyle}>
              <label style={fLabel}>Motivo del rechazo *</label>
              <textarea rows={4} placeholder="Explica al solicitante por qué se rechaza su solicitud..." value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); setRejectError('') }} style={fTextarea} />
              {rejectError && <span style={fError}>{rejectError}</span>}
              <span style={charCount}>{rejectReason.length}/500</span>
            </div>
            <div style={rejectWarning}>El solicitante podrá ver este motivo desde su historial de solicitudes.</div>
          </div>
          <div style={mdFoot}>
            <button type="button" onClick={() => { setRejectItem(null); setRejectReason(''); setRejectError('') }} style={mdCanBtn}>Cancelar</button>
            <button type="button" onClick={handleConfirmReject} disabled={loading} style={mdRejectBtn}>{loading ? 'Procesando...' : 'Confirmar Rechazo'}</button>
          </div>
        </div></div>
      )}

      {/* ========== MODAL: DEVOLVER ========== */}
      {returnItem && (
        <div style={ovStyle}><div style={{ ...mdStyle, maxWidth: '520px' }}>
          <div style={mdHead}>
            <div><h3 style={mdTitle}>Registrar Devolución</h3><p style={mdSub}>Indica el estado en que se recibe el recurso</p></div>
            <button type="button" onClick={() => { setReturnItem(null); setReturnForm({ condition: '', description: '' }); setReturnErrors({}) }} style={clBtn}>×</button>
          </div>
          <div style={mdBody}>
            <div style={rejectInfoBox}>
              <span style={rejectInfoLabel}>Solicitante</span>
              <p style={rejectInfoValue}>{returnItem.requesterName}</p>
              <span style={{ ...rejectInfoLabel, marginTop: '8px' }}>Recurso</span>
              <p style={rejectInfoValue}>{returnItem.resourceName}</p>
            </div>
            <div style={fldStyle}>
              <label style={fLabel}>Estado de devolución *</label>
              <div style={radioGroupStyle}>
                <label style={radioLabelStyle(returnForm.condition === 'BUEN_ESTADO')}>
                  <input type="radio" name="condition" value="BUEN_ESTADO" checked={returnForm.condition === 'BUEN_ESTADO'} onChange={() => setReturnForm({ ...returnForm, condition: 'BUEN_ESTADO', description: '' })} style={radioStyle} />
                  ✅ Buen estado
                </label>
                <label style={radioLabelStyle(returnForm.condition === 'DAÑADO')}>
                  <input type="radio" name="condition" value="DAÑADO" checked={returnForm.condition === 'DAÑADO'} onChange={() => setReturnForm({ ...returnForm, condition: 'DAÑADO' })} style={radioStyle} />
                  ⚠ Dañado
                </label>
              </div>
              {returnErrors.condition && <span style={fError}>{returnErrors.condition}</span>}
            </div>
            {returnForm.condition === 'DAÑADO' && (
              <div style={fldStyle}>
                <label style={fLabel}>Descripción del daño *</label>
                <textarea rows={3} placeholder="Describe el estado del recurso y los daños encontrados..." value={returnForm.description} onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })} style={fTextarea} />
                {returnErrors.description && <span style={fError}>{returnErrors.description}</span>}
              </div>
            )}
          </div>
          <div style={mdFoot}>
            <button type="button" onClick={() => { setReturnItem(null); setReturnForm({ condition: '', description: '' }); setReturnErrors({}) }} style={mdCanBtn}>Cancelar</button>
            <button type="button" onClick={handleConfirmReturn} disabled={loading} style={confirmOkBtn('#2563eb')}>{loading ? 'Procesando...' : 'Registrar Devolución'}</button>
          </div>
        </div></div>
      )}
    </DashboardLayout>
  )
}

function Section({ t, children }) { return <section style={detailSectionStyle}><h4 style={detailSectionTitleStyle}>{t}</h4>{children}</section> }
function Det({ l, v, fw = false }) { return <div style={fw ? detBoxFull : detBox}><span style={detLabel}>{l}</span><p style={detValue}>{v}</p></div> }
function fmtStatus(s) { return { PENDIENTE: 'Pendiente', APROBADA: 'En préstamo', RECHAZADA: 'Rechazada', CANCELADA: 'Cancelada', DEVUELTA: 'Devuelta' }[s] || s }
function statusBadge(s) {
  const c = { PENDIENTE: { bg: '#fef3c7', c: '#92400e' }, APROBADA: { bg: '#dbeafe', c: '#2563eb' }, RECHAZADA: { bg: '#fee2e2', c: '#dc2626' }, CANCELADA: { bg: '#f1f5f9', c: '#64748b' }, DEVUELTA: { bg: '#dcfce7', c: '#15803d' } }
  const x = c[s] || c.CANCELADA; return { background: x.bg, color: x.c, padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }
}
function catBadge(t) { return { background: t === 'SPACE' ? '#f3e8ff' : '#dbeafe', color: t === 'SPACE' ? '#7c3aed' : '#2563eb', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' } }
function aBtn(bg, color, border) { return { width: '34px', height: '34px', borderRadius: '10px', border: `1px solid ${border}`, background: bg, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' } }
const disBtn = { width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#cbd5e1', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }
const activeBadge = { background: '#dcfce7', color: '#15803d', padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }

const headerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }
const titleStyle = { fontSize: '22px', fontWeight: 800, color: '#0b2f63', marginBottom: '6px' }
const subtitleStyle = { color: '#64748b', fontSize: '14px' }
const filtersPanelStyle = { background: '#fff', border: '1px solid #dfe6ee', borderRadius: '16px', padding: '14px', marginBottom: '18px', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }
const filtersGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' }
const labelStyle = { fontSize: '12px', fontWeight: 800, color: '#94a3b8' }
const selectStyle = { border: '1px solid #d7dde5', background: '#fff', borderRadius: '12px', padding: '12px 14px', outline: 'none', color: '#334155', fontSize: '14px' }
const inputStyle = { border: '1px solid #d7dde5', background: '#fff', borderRadius: '12px', padding: '12px 14px', outline: 'none', color: '#334155', fontSize: '14px' }
const clearWrapStyle = { display: 'flex', alignItems: 'end' }
const refreshBtnStyle = { width: '44px', height: '44px', border: '1px solid #d7dde5', background: '#fff', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }
const tableCardStyle = { background: '#fff', border: '1px solid #dfe6ee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }
const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const thStyle = { textAlign: 'left', padding: '16px 18px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', color: '#64748b', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }
const rowEvenStyle = { background: '#fff' }
const rowOddStyle = { background: '#fcfdff' }
const tdStyle = { padding: '16px 18px', borderBottom: '1px solid #eef2f7', fontSize: '14px', verticalAlign: 'middle' }
const tdReqStyle = { ...tdStyle, color: '#0b2f63' }
const emptyStyle = { padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }
const actionsStyle = { display: 'flex', gap: '8px', alignItems: 'center' }
const footerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px' }
const pageTextStyle = { color: '#64748b', fontSize: '14px' }
const pagerStyle = { display: 'flex', gap: '8px' }
const pgBtn = (d) => ({ width: '36px', height: '36px', border: '1px solid #e5e7eb', background: d ? '#f8fafc' : '#fff', borderRadius: '10px', color: d ? '#cbd5e1' : '#475569', cursor: d ? 'not-allowed' : 'pointer', fontWeight: 700 })

// Modales
const ovStyle = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 120 }
const mdStyle = { width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: '18px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)', overflow: 'hidden' }
const mdHead = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }
const mdTitle = { fontSize: '17px', fontWeight: 800, color: '#111827' }
const mdSub = { fontSize: '13px', color: '#94a3b8', marginTop: '2px' }
const clBtn = { border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }
const mdBody = { padding: '20px 24px' }
const mdFoot = { padding: '14px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }
const mdClBtn = { border: 'none', background: '#e2e8f0', color: '#0f172a', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }
const mdCanBtn = { border: 'none', background: 'transparent', color: '#64748b', padding: '10px 14px', fontWeight: 600, cursor: 'pointer' }
const mdRejectBtn = { border: 'none', background: '#dc2626', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

// Detalle
const dGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
const detailSectionStyle = { border: '1px solid #e5e7eb', borderRadius: '14px', padding: '14px', background: '#fff', marginBottom: '14px' }
const detailSectionTitleStyle = { marginBottom: '10px', color: '#1f2937', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }
const detBox = { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px' }
const detBoxFull = { ...detBox, marginTop: '10px' }
const detLabel = { display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }
const detValue = { color: '#111827', fontSize: '14px', fontWeight: 600 }

// Confirm
const confirmBody = { padding: '32px 24px', textAlign: 'center' }
const confirmIcon = (bg) => ({ width: '56px', height: '56px', borderRadius: '50%', background: `#${bg}`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' })
const confirmTitle = { fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '8px' }
const confirmText = { color: '#64748b', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }
const confirmActions = { display: 'flex', gap: '12px' }
const confirmCancelBtn = { flex: 1, border: 'none', background: '#f1f5f9', color: '#334155', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }
const confirmOkBtn = (bg) => ({ flex: 1, border: 'none', background: bg, color: '#fff', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' })

// Rechazar form
const rejectInfoBox = { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '14px', marginBottom: '16px' }
const rejectInfoLabel = { color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', display: 'block' }
const rejectInfoValue = { color: '#111827', fontSize: '14px', fontWeight: 700, marginTop: '2px' }
const rejectWarning = { marginTop: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: '#92400e', lineHeight: '1.4' }
const fldStyle = { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }
const fLabel = { fontWeight: 700, color: '#374151', fontSize: '14px' }
const fTextarea = { border: '1px solid #e5e7eb', background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', outline: 'none', color: '#111827', resize: 'vertical', fontFamily: 'inherit' }
const fError = { color: '#dc2626', fontSize: '12px', fontWeight: 600 }
const charCount = { color: '#94a3b8', fontSize: '12px', textAlign: 'right' }

// Return form
const radioGroupStyle = { display: 'flex', gap: '12px' }
const radioLabelStyle = (active) => ({
  flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
  border: active ? '2px solid #00843D' : '1px solid #e5e7eb', background: active ? '#f0fdf4' : '#fff', color: active ? '#15803d' : '#334155',
})
const radioStyle = { display: 'none' }

export default ReservationsPage