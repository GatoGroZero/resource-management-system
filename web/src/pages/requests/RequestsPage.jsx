import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getMyReservations, getMyReservationById, updateMyReservation, cancelMyReservation } from '../../api/reservationApi'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../utils/alertUtils'

function RequestsPage() {
  const { user } = useAuth()
  const [dataPage, setDataPage] = useState(null)
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [cancelItem, setCancelItem] = useState(null)
  const [rejectionItem, setRejectionItem] = useState(null)
  const [editForm, setEditForm] = useState({ startDate: '', startTime: '', endDate: '', endTime: '', reason: '' })
  const [editErrors, setEditErrors] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  const fetchData = async (p = page, f = statusFilter) => {
    try { setDataPage(await getMyReservations({ userId: user.userId, page: p, size: 10, filter: f })) }
    catch { showToast('error', 'Error al cargar historial') }
  }

  useEffect(() => { if (user?.userId) fetchData(page, statusFilter) }, [page, statusFilter])

  const handleView = async (id) => {
    try { setViewItem(await getMyReservationById(id, user.userId)) } catch { showToast('error', 'Error') }
  }

  const handleOpenEdit = async (id) => {
    try {
      const d = await getMyReservationById(id, user.userId)
      setEditItem(d)
      setEditForm({ startDate: d.reservationDate, startTime: d.startTime, endDate: d.endDate || d.reservationDate, endTime: d.endTime, reason: d.purpose })
      setEditErrors({})
    } catch { showToast('error', 'Error') }
  }

  const validateEdit = () => {
    const e = {}
    const today = new Date().toISOString().split('T')[0]
    if (!editForm.startDate) e.startDate = 'Obligatorio'
    else if (editForm.startDate < today) e.startDate = 'No puede ser pasada'
    if (!editForm.startTime) e.startTime = 'Obligatorio'
    if (!editForm.endDate) e.endDate = 'Obligatorio'
    else if (editForm.endDate < editForm.startDate) e.endDate = 'No puede ser antes del inicio'
    if (!editForm.endTime) e.endTime = 'Obligatorio'
    if (editForm.startDate === editForm.endDate && editForm.startTime && editForm.endTime && editForm.endTime <= editForm.startTime) e.endTime = 'Debe ser después del inicio'
    if (!editForm.reason.trim()) e.reason = 'Obligatorio'
    else if (editForm.reason.trim().length < 10) e.reason = 'Mínimo 10 caracteres'
    setEditErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSaveEdit = async () => {
    if (!validateEdit()) return
    setEditLoading(true)
    try {
      await updateMyReservation(editItem.id, user.userId, {
        requesterId: user.userId, resourceType: editItem.resourceType, resourceId: null,
        reservationDate: editForm.startDate, startTime: editForm.startTime,
        endDate: editForm.endDate, endTime: editForm.endTime,
        purpose: editForm.reason.trim(), observations: null,
      })
      showToast('success', 'Solicitud actualizada')
      setEditItem(null); fetchData()
    } catch (err) { showToast('error', err?.response?.data?.message || 'Error') }
    finally { setEditLoading(false) }
  }

  const handleConfirmCancel = async () => {
    setCancelLoading(true)
    try { await cancelMyReservation(cancelItem.id, user.userId); showToast('success', 'Solicitud cancelada'); setCancelItem(null); fetchData() }
    catch (err) { showToast('error', err?.response?.data?.message || 'Error') }
    finally { setCancelLoading(false) }
  }

  return (
    <DashboardLayout>
      <div style={headerStyle}><h1 style={titleStyle}>Mi Historial</h1><p style={subtitleStyle}>Consulta y da seguimiento a tus solicitudes realizadas.</p></div>

      <div style={filterBarStyle}>
        <select value={statusFilter} onChange={(e) => { setPage(0); setStatusFilter(e.target.value) }} style={filterSelectStyle}>
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="APROBADA">Aprobada</option>
          <option value="RECHAZADA">Rechazada</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="DEVUELTA">Devuelta</option>
        </select>
        <button type="button" onClick={() => { setPage(0); setStatusFilter('') }} style={clearBtnStyle}>↺</button>
      </div>

      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead><tr>
            <th style={thStyle}>ID</th><th style={thStyle}>RECURSO</th><th style={thStyle}>TIPO</th>
            <th style={thStyle}>FECHA INICIO</th><th style={thStyle}>FECHA FIN</th><th style={thStyle}>HORARIO</th>
            <th style={thStyle}>ESTADO</th><th style={thStyle}>ACCIONES</th>
          </tr></thead>
          <tbody>
            {dataPage?.content?.length > 0 ? dataPage.content.map((item, idx) => (
              <tr key={item.id} style={idx % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdCodeStyle}>#{item.id}</td>
                <td style={tdNameStyle}>{item.resourceName}</td>
                <td style={tdMutedStyle}>{item.resourceType === 'SPACE' ? 'Espacio' : 'Equipo'}</td>
                <td style={tdMutedStyle}>{item.reservationDate}</td>
                <td style={tdMutedStyle}>{item.endDate || item.reservationDate}</td>
                <td style={tdMutedStyle}>{item.schedule}</td>
                <td style={tdStyle}><span style={statusBadge(item.status)}>{fmtStatus(item.status)}</span></td>
                <td style={tdStyle}>
                  <div style={actionsStyle}>
                    <button type="button" onClick={() => handleView(item.id)} style={aBtn('#eef6ff', '#2563eb', '#bfdbfe')} title="Ver">👁</button>
                    <button type="button" onClick={() => item.status === 'PENDIENTE' && handleOpenEdit(item.id)} disabled={item.status !== 'PENDIENTE'} style={item.status === 'PENDIENTE' ? aBtn('#f5f3ff', '#7c3aed', '#ddd6fe') : disBtn} title="Editar">✏</button>
                    <button type="button" onClick={() => item.status === 'PENDIENTE' && setCancelItem(item)} disabled={item.status !== 'PENDIENTE'} style={item.status === 'PENDIENTE' ? aBtn('#fef2f2', '#dc2626', '#fecaca') : disBtn} title="Cancelar">⏻</button>
                    <button type="button" onClick={() => item.status === 'RECHAZADA' && handleView(item.id)} disabled={item.status !== 'RECHAZADA'} style={item.status === 'RECHAZADA' ? aBtn('#fef2f2', '#dc2626', '#fecaca') : disBtn} title="Ver motivo">⚠</button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={8} style={emptyTdStyle}>No tienes solicitudes registradas.</td></tr>}
          </tbody>
        </table>
        <div style={footerRowStyle}>
          <span style={pageTextStyle}>Página {dataPage ? dataPage.number + 1 : 1} de {dataPage ? Math.max(dataPage.totalPages, 1) : 1}</span>
          <div style={pagerStyle}>
            <button type="button" onClick={() => page > 0 && setPage(page - 1)} disabled={page === 0} style={pgBtn(page === 0)}>‹</button>
            <button type="button" onClick={() => !dataPage?.last && setPage(page + 1)} disabled={dataPage?.last} style={pgBtn(Boolean(dataPage?.last))}>›</button>
          </div>
        </div>
      </div>

      <div style={infoBannerStyle}><strong>Gestión de Solicitudes:</strong> Puedes modificar o cancelar mientras estén en Pendiente. Una vez aprobadas, rechazadas o devueltas, se deshabilitan.</div>

      {/* MODAL VER */}
      {viewItem && (
        <div style={ovStyle}><div style={mdStyle}>
          <div style={mdHead}><h3 style={mdTitle}>Detalles de la Solicitud</h3><button type="button" onClick={() => setViewItem(null)} style={clBtn}>×</button></div>
          <div style={mdBody}>
            <div style={dGrid}>
              <Det l="ID" v={`#${viewItem.id}`} /><Det l="Estado" v={fmtStatus(viewItem.status)} />
              <Det l="Recurso" v={viewItem.resourceName} /><Det l="Tipo" v={viewItem.resourceType === 'SPACE' ? 'Espacio' : 'Equipo'} />
              <Det l="Fecha inicio" v={viewItem.reservationDate} /><Det l="Hora inicio" v={viewItem.startTime} />
              <Det l="Fecha devolución" v={viewItem.endDate || viewItem.reservationDate} /><Det l="Hora devolución" v={viewItem.endTime} />
            </div>
            <div style={dFull}><span style={dLabel}>Propósito</span><p style={dVal}>{viewItem.purpose || 'Sin descripción'}</p></div>
            {viewItem.adminComment && <div style={{ ...dFull, background: viewItem.status === 'RECHAZADA' ? '#fef2f2' : '#f0fdf4', border: viewItem.status === 'RECHAZADA' ? '1px solid #fecaca' : '1px solid #bbf7d0' }}><span style={dLabel}>{viewItem.status === 'RECHAZADA' ? 'Motivo del rechazo' : 'Comentario del admin'}</span><p style={dVal}>{viewItem.adminComment}</p></div>}
            {viewItem.returnCondition && <div style={dFull}><span style={dLabel}>Estado de devolución</span><p style={dVal}>{viewItem.returnCondition}{viewItem.returnDescription ? ` — ${viewItem.returnDescription}` : ''}</p></div>}
          </div>
          <div style={mdFoot}><button type="button" onClick={() => setViewItem(null)} style={mdClBtn}>Cerrar</button></div>
        </div></div>
      )}

      {/* MODAL EDITAR */}
      {editItem && (
        <div style={ovStyle}><div style={mdStyle}>
          <div style={mdHead}><h3 style={mdTitle}>Modificar Solicitud</h3><button type="button" onClick={() => setEditItem(null)} style={clBtn}>×</button></div>
          <div style={mdBody}>
            <div style={dGrid}><Det l="Recurso" v={editItem.resourceName} /><Det l="Tipo" v={editItem.resourceType === 'SPACE' ? 'Espacio' : 'Equipo'} /></div>
            <div style={efStyle}>
              <div style={eRow}>
                <div style={fld}><label style={fl}>Fecha inicio</label><input type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} style={fi} />{editErrors.startDate && <span style={fe}>{editErrors.startDate}</span>}</div>
                <div style={fld}><label style={fl}>Hora inicio</label><input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} style={fi} />{editErrors.startTime && <span style={fe}>{editErrors.startTime}</span>}</div>
              </div>
              <div style={eRow}>
                <div style={fld}><label style={fl}>Fecha devolución</label><input type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} style={fi} />{editErrors.endDate && <span style={fe}>{editErrors.endDate}</span>}</div>
                <div style={fld}><label style={fl}>Hora devolución</label><input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} style={fi} />{editErrors.endTime && <span style={fe}>{editErrors.endTime}</span>}</div>
              </div>
              <div style={fld}><label style={fl}>Motivo</label><textarea rows={3} value={editForm.reason} onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })} style={ft} />{editErrors.reason && <span style={fe}>{editErrors.reason}</span>}</div>
            </div>
          </div>
          <div style={mdFoot}><button type="button" onClick={() => setEditItem(null)} style={mdCanBtn}>Cancelar</button><button type="button" onClick={handleSaveEdit} disabled={editLoading} style={mdSvBtn}>{editLoading ? 'Guardando...' : 'Guardar Cambios'}</button></div>
        </div></div>
      )}

      {/* MODAL CANCELAR */}
      {cancelItem && (
        <div style={ovStyle}><div style={{ ...mdStyle, maxWidth: '440px' }}>
          <div style={canBody}>
            <div style={canIcon}>⚠</div>
            <h3 style={canTitle}>Cancelar Solicitud</h3>
            <p style={canText}>¿Estás seguro que deseas cancelar <strong>{cancelItem.resourceName}</strong>?</p>
            <p style={canWarn}>Esta acción no se puede deshacer.</p>
            <div style={canActs}>
              <button type="button" onClick={() => setCancelItem(null)} style={canKeep}>No, mantener</button>
              <button type="button" onClick={handleConfirmCancel} disabled={cancelLoading} style={canConf}>{cancelLoading ? 'Cancelando...' : 'Sí, cancelar'}</button>
            </div>
          </div>
        </div></div>
      )}
    </DashboardLayout>
  )
}

function Det({ l, v }) { return <div><span style={dLabel}>{l}</span><p style={dVal}>{v}</p></div> }
function fmtStatus(s) { return { PENDIENTE: 'Pendiente', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada', CANCELADA: 'Cancelada', DEVUELTA: 'Devuelta' }[s] || s }
function statusBadge(s) { const c = { PENDIENTE: { bg: '#fef3c7', c: '#92400e' }, APROBADA: { bg: '#dcfce7', c: '#15803d' }, RECHAZADA: { bg: '#fee2e2', c: '#dc2626' }, CANCELADA: { bg: '#f1f5f9', c: '#64748b' }, DEVUELTA: { bg: '#dbeafe', c: '#2563eb' } }; const x = c[s] || c.CANCELADA; return { background: x.bg, color: x.c, padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' } }
function aBtn(bg, color, border) { return { width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' } }
const disBtn = { width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#cbd5e1', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }

const headerStyle = { marginBottom: '20px' }
const titleStyle = { fontSize: '22px', fontWeight: 800, color: '#0b2f63' }
const subtitleStyle = { color: '#64748b', fontSize: '14px', marginTop: '4px' }
const filterBarStyle = { display: 'flex', gap: '10px', marginBottom: '18px' }
const filterSelectStyle = { border: '1px solid #d7dde5', background: '#fff', borderRadius: '12px', padding: '12px 14px', outline: 'none', color: '#334155', fontSize: '14px', minWidth: '200px' }
const clearBtnStyle = { width: '44px', height: '44px', border: '1px solid #d7dde5', background: '#fff', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }
const tableCardStyle = { background: '#fff', border: '1px solid #dfe6ee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', marginBottom: '18px' }
const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const thStyle = { textAlign: 'left', padding: '14px 16px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', color: '#64748b', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }
const rowEvenStyle = { background: '#fff' }
const rowOddStyle = { background: '#fcfdff' }
const tdStyle = { padding: '14px 16px', borderBottom: '1px solid #eef2f7', fontSize: '13px', verticalAlign: 'middle' }
const tdNameStyle = { ...tdStyle, color: '#0b2f63', fontWeight: 700 }
const tdCodeStyle = { ...tdStyle, color: '#00843D', fontWeight: 700, fontFamily: 'monospace' }
const tdMutedStyle = { ...tdStyle, color: '#64748b' }
const emptyTdStyle = { padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }
const actionsStyle = { display: 'flex', gap: '6px' }
const footerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }
const pageTextStyle = { color: '#64748b', fontSize: '14px' }
const pagerStyle = { display: 'flex', gap: '8px' }
const pgBtn = (d) => ({ width: '36px', height: '36px', border: '1px solid #e5e7eb', background: d ? '#f8fafc' : '#fff', borderRadius: '10px', color: d ? '#cbd5e1' : '#475569', cursor: d ? 'not-allowed' : 'pointer', fontWeight: 700 })
const infoBannerStyle = { background: '#1e293b', color: '#fff', borderRadius: '16px', padding: '20px 24px', fontSize: '13px', lineHeight: '1.5' }

const ovStyle = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 120 }
const mdStyle = { width: '100%', maxWidth: '640px', background: '#fff', borderRadius: '18px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)', overflow: 'hidden' }
const mdHead = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }
const mdTitle = { fontSize: '17px', fontWeight: 800, color: '#111827' }
const clBtn = { border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }
const mdBody = { padding: '20px 24px' }
const mdFoot = { padding: '14px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }
const mdClBtn = { border: 'none', background: '#e2e8f0', color: '#0f172a', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }
const mdCanBtn = { border: 'none', background: 'transparent', color: '#64748b', padding: '10px 14px', fontWeight: 600, cursor: 'pointer' }
const mdSvBtn = { border: 'none', background: '#00843D', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

const dGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }
const dFull = { background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 14px', marginTop: '12px' }
const dLabel = { display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }
const dVal = { color: '#111827', fontSize: '14px', fontWeight: 600 }

const efStyle = { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }
const eRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
const fld = { display: 'flex', flexDirection: 'column', gap: '6px' }
const fl = { fontWeight: 700, color: '#374151', fontSize: '13px' }
const fi = { border: '1px solid #e5e7eb', background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', outline: 'none', color: '#111827' }
const ft = { ...fi, resize: 'vertical', fontFamily: 'inherit' }
const fe = { color: '#dc2626', fontSize: '11px', fontWeight: 600 }

const canBody = { padding: '32px 24px', textAlign: 'center' }
const canIcon = { width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }
const canTitle = { fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '8px' }
const canText = { color: '#64748b', fontSize: '14px', marginBottom: '4px' }
const canWarn = { color: '#dc2626', fontSize: '12px', fontWeight: 600, marginBottom: '20px' }
const canActs = { display: 'flex', gap: '12px' }
const canKeep = { flex: 1, border: 'none', background: '#f1f5f9', color: '#334155', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }
const canConf = { flex: 1, border: 'none', background: '#dc2626', color: '#fff', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

export default RequestsPage