import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getSpaces } from '../../api/spaceApi'
import { getEquipments, getEquipmentsBySpace } from '../../api/equipmentApi'
import { createReservation } from '../../api/reservationApi'
import { useAuth } from '../../context/AuthContext'
import { showToast } from '../../utils/alertUtils'

function NewRequestPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'

  const [step, setStep] = useState(1)
  const [tab, setTab] = useState('SPACE')
  const [searchTerm, setSearchTerm] = useState('')

  const [spacesPage, setSpacesPage] = useState(null)
  const [spacePage, setSpacePage] = useState(0)
  const [spaceLoading, setSpaceLoading] = useState(false)

  const [equipPage, setEquipPage] = useState(null)
  const [equipPageNum, setEquipPageNum] = useState(0)
  const [equipLoading, setEquipLoading] = useState(false)

  const [selectedResource, setSelectedResource] = useState(null)
  const [spaceEquipments, setSpaceEquipments] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    reason: '',
  })
  const [errors, setErrors] = useState({})

  const fetchSpaces = async (pg = spacePage, search = searchTerm) => {
    setSpaceLoading(true)
    try {
      const data = await getSpaces({ page: pg, size: 10, search })
      const filtered = (data.content || [])
        .filter((s) => s.active)
        .filter((s) => !isStudent || s.allowStudents)
        .sort((a, b) => a.name.localeCompare(b.name))
      setSpacesPage({ ...data, content: filtered })
    } catch { setSpacesPage(null) }
    finally { setSpaceLoading(false) }
  }

  const fetchEquipments = async (pg = equipPageNum, search = searchTerm) => {
    setEquipLoading(true)
    try {
      const data = await getEquipments({ page: pg, size: 10, search })
      const filtered = (data.content || [])
        .filter((e) => e.active)
        .filter((e) => !isStudent || e.allowStudents)
        .sort((a, b) => a.name.localeCompare(b.name))
      setEquipPage({ ...data, content: filtered })
    } catch { setEquipPage(null) }
    finally { setEquipLoading(false) }
  }

  useEffect(() => {
    if (tab === 'SPACE') fetchSpaces(spacePage, searchTerm)
    else fetchEquipments(equipPageNum, searchTerm)
  }, [tab, spacePage, equipPageNum])

  const handleSearch = (val) => {
    setSearchTerm(val)
    if (tab === 'SPACE') { setSpacePage(0); fetchSpaces(0, val) }
    else { setEquipPageNum(0); fetchEquipments(0, val) }
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setSearchTerm('')
    setSelectedResource(null)
    if (newTab === 'SPACE') { setSpacePage(0); fetchSpaces(0, '') }
    else { setEquipPageNum(0); fetchEquipments(0, '') }
  }

  useEffect(() => {
    if (selectedResource?.resourceType === 'SPACE' && selectedResource?.id) {
      getEquipmentsBySpace(selectedResource.id).then(setSpaceEquipments).catch(() => setSpaceEquipments([]))
    } else { setSpaceEquipments([]) }
  }, [selectedResource])

  const currentData = tab === 'SPACE' ? spacesPage : equipPage
  const currentLoading = tab === 'SPACE' ? spaceLoading : equipLoading
  const currentPageNum = tab === 'SPACE' ? spacePage : equipPageNum

  const handlePrev = () => {
    if (tab === 'SPACE' && spacePage > 0) setSpacePage(spacePage - 1)
    if (tab === 'EQUIPMENT' && equipPageNum > 0) setEquipPageNum(equipPageNum - 1)
  }
  const handleNext = () => {
    if (tab === 'SPACE' && spacesPage && !spacesPage.last) setSpacePage(spacePage + 1)
    if (tab === 'EQUIPMENT' && equipPage && !equipPage.last) setEquipPageNum(equipPageNum + 1)
  }

  const handleSelectResource = (res) => {
    setSelectedResource({
      id: res.id, name: res.name, resourceType: tab,
      location: res.location || res.category || '',
      description: res.description || '',
    })
  }

  const validateStep2 = () => {
    const e = {}
    const today = new Date().toISOString().split('T')[0]
    const max = new Date(); max.setDate(max.getDate() + 60)
    const maxStr = max.toISOString().split('T')[0]

    if (!formData.startDate) e.startDate = 'La fecha de inicio es obligatoria'
    else if (formData.startDate < today) e.startDate = 'No puede ser fecha pasada'
    else if (formData.startDate > maxStr) e.startDate = 'Máximo 60 días en el futuro'

    if (!formData.startTime) e.startTime = 'Obligatorio'
    else if (formData.startTime < '07:00' || formData.startTime > '21:00') e.startTime = 'Horario: 07:00 - 21:00'

    if (!formData.endDate) e.endDate = 'La fecha de devolución es obligatoria'
    else if (formData.endDate < formData.startDate) e.endDate = 'No puede ser antes de la fecha de inicio'
    else if (formData.endDate > maxStr) e.endDate = 'Máximo 60 días en el futuro'

    if (!formData.endTime) e.endTime = 'Obligatorio'
    else if (formData.endTime < '07:00' || formData.endTime > '22:00') e.endTime = 'Horario: 07:00 - 22:00'

    if (formData.startDate && formData.endDate && formData.startDate === formData.endDate) {
      if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
        e.endTime = 'Debe ser después de la hora de inicio'
      }
    }

    if (!formData.reason.trim()) e.reason = 'El motivo es obligatorio'
    else if (formData.reason.trim().length < 10) e.reason = 'Mínimo 10 caracteres'
    else if (formData.reason.trim().length > 500) e.reason = 'Máximo 500 caracteres'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    setSubmitting(true)
    try {
      await createReservation({
        requesterId: user.userId,
        resourceType: selectedResource.resourceType,
        resourceId: selectedResource.id,
        reservationDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        purpose: formData.reason.trim(),
        observations: null,
      })
      showToast('success', 'Solicitud enviada correctamente')
      setTimeout(() => navigate('/requests'), 1500)
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'Error al enviar solicitud')
    } finally { setSubmitting(false) }
  }

  return (
    <DashboardLayout>
      <div style={containerStyle}>
        <div style={headerRowStyle}>
          <div>
            <h1 style={titleStyle}>Nueva Solicitud</h1>
            <p style={subtitleStyle}>Completa los pasos para reservar un recurso.</p>
          </div>
          <div style={stepsStyle}>
            <div style={step >= 1 ? stepActiveStyle : stepInactiveStyle} />
            <div style={step >= 2 ? stepActiveStyle : stepInactiveStyle} />
          </div>
        </div>

        {/* ========== PASO 1 ========== */}
        {step === 1 && (
          <div>
            <div style={tabsCardStyle}>
              <div style={tabsRowStyle}>
                <button type="button" onClick={() => handleTabChange('SPACE')} style={tab === 'SPACE' ? tabActiveStyle : tabInactiveStyle}>🏢 Espacios</button>
                <button type="button" onClick={() => handleTabChange('EQUIPMENT')} style={tab === 'EQUIPMENT' ? tabActiveStyle : tabInactiveStyle}>📦 Equipos</button>
              </div>
              <input type="text" placeholder={tab === 'SPACE' ? 'Buscar espacio...' : 'Buscar equipo...'} value={searchTerm} onChange={(e) => handleSearch(e.target.value)} style={searchInputStyle} />
              {isStudent && <div style={studentNoticeStyle}>ℹ Mostrando solo recursos autorizados para estudiantes.</div>}
            </div>

            {currentLoading ? <p style={emptyMsgStyle}>Cargando...</p>
            : !currentData?.content?.length ? <div style={emptyBlockStyle}><p style={emptyMsgStyle}>No se encontraron {tab === 'SPACE' ? 'espacios' : 'equipos'} disponibles.</p></div>
            : (
              <>
                <div style={resourceGridStyle}>
                  {currentData.content.map((res) => {
                    const isSel = selectedResource?.id === res.id && selectedResource?.resourceType === tab
                    return (
                      <div key={res.id} onClick={() => handleSelectResource(res)} style={{ ...resourceCardStyle, ...(isSel ? selectedCardStyle : {}) }}>
                        <div style={cardTopRowStyle}>
                          <div style={cardLeftStyle}>
                            <span style={tab === 'SPACE' ? iconSpaceStyle : iconEquipStyle}>{tab === 'SPACE' ? '🏢' : '📦'}</span>
                            <div>
                              <h4 style={cardNameStyle}>{res.name}</h4>
                              <p style={cardLocStyle}>{tab === 'SPACE' ? res.location : res.inventoryNumber || res.category}</p>
                            </div>
                          </div>
                          {isSel && <span style={checkStyle}>✓</span>}
                        </div>
                        <p style={cardDescStyle}>{res.description || ''}</p>
                        <div style={cardMetaRowStyle}>
                          {tab === 'SPACE' && <><span style={metaBadgeStyle}>📍 {res.location}</span><span style={metaBadgeStyle}>👥 {res.capacity}</span></>}
                          {tab === 'EQUIPMENT' && <><span style={metaBadgeStyle}>{res.category}</span>{res.spaceName && <span style={metaBadgeStyle}>📍 {res.spaceName}</span>}</>}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={paginationRowStyle}>
                  <span style={pageTextStyle}>Página {currentPageNum + 1} de {Math.max(currentData.totalPages, 1)}</span>
                  <div style={pagerStyle}>
                    <button type="button" onClick={handlePrev} disabled={currentPageNum === 0} style={pagerBtnStyle(currentPageNum === 0)}>‹</button>
                    <button type="button" onClick={handleNext} disabled={currentData.last} style={pagerBtnStyle(currentData.last)}>›</button>
                  </div>
                </div>
              </>
            )}

            <div style={step1FooterStyle}>
              <button type="button" disabled={!selectedResource} onClick={() => setStep(2)} style={{ ...continueButtonStyle, ...(!selectedResource ? disabledBtnStyle : {}) }}>Continuar →</button>
            </div>
          </div>
        )}

        {/* ========== PASO 2 ========== */}
        {step === 2 && (
          <div>
            <div style={bannerStyle}>
              <div style={bannerLeftStyle}>
                <span style={bannerIconStyle}>{selectedResource.resourceType === 'SPACE' ? '🏢' : '📦'}</span>
                <div>
                  <h2 style={bannerTitleStyle}>{selectedResource.name}</h2>
                  <p style={bannerSubStyle}>{selectedResource.location} • {selectedResource.resourceType === 'SPACE' ? 'Espacio' : 'Equipo'}</p>
                </div>
              </div>
              <button type="button" onClick={() => { setStep(1); setFormData({ startDate: '', startTime: '', endDate: '', endTime: '', reason: '' }); setErrors({}) }} style={changeBtnStyle}>✕ Cambiar</button>
            </div>

            {selectedResource.resourceType === 'SPACE' && spaceEquipments.length > 0 && (
              <div style={assocCardStyle}>
                <h4 style={assocTitleStyle}>📦 Equipos en este espacio</h4>
                <div style={assocListStyle}>
                  {spaceEquipments.map((eq) => (
                    <div key={eq.id} style={assocItemStyle}>
                      <span style={assocNameStyle}>{eq.name}</span>
                      <span style={assocMetaStyle}>{eq.inventoryNumber} • {eq.condition === 'DISPONIBLE' ? '✅ Disponible' : eq.condition === 'EN_USO' ? '🔵 En uso' : '🔧 Mantenimiento'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={formCardStyle}>
              {/* Fila 1: Fecha inicio + Hora inicio */}
              <div style={formRow2Style}>
                <div style={fieldStyle}>
                  <label style={fLabelStyle}>📅 Fecha de inicio</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} style={fInputStyle} />
                  {errors.startDate && <span style={fErrorStyle}>{errors.startDate}</span>}
                </div>
                <div style={fieldStyle}>
                  <label style={fLabelStyle}>🕐 Hora de inicio</label>
                  <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} style={fInputStyle} />
                  {errors.startTime && <span style={fErrorStyle}>{errors.startTime}</span>}
                </div>
              </div>

              {/* Fila 2: Fecha fin + Hora fin */}
              <div style={{ ...formRow2Style, marginTop: '18px' }}>
                <div style={fieldStyle}>
                  <label style={fLabelStyle}>📅 Fecha de devolución</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} style={fInputStyle} />
                  {errors.endDate && <span style={fErrorStyle}>{errors.endDate}</span>}
                </div>
                <div style={fieldStyle}>
                  <label style={fLabelStyle}>🕐 Hora de devolución</label>
                  <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} style={fInputStyle} />
                  {errors.endTime && <span style={fErrorStyle}>{errors.endTime}</span>}
                </div>
              </div>

              {/* Motivo */}
              <div style={{ ...fieldStyle, marginTop: '18px' }}>
                <label style={fLabelStyle}>Motivo de la solicitud</label>
                <textarea rows={4} placeholder="Describe brevemente la actividad o uso que le darás al recurso..." value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} style={fTextareaStyle} />
                {errors.reason && <span style={fErrorStyle}>{errors.reason}</span>}
                <span style={charCountStyle}>{formData.reason.length}/500</span>
              </div>

              <div style={warningStyle}>
                <strong>Nota importante:</strong> Todas las solicitudes se registran en estado Pendiente y no podrán ser editadas una vez aprobadas o rechazadas.
              </div>
            </div>

            <div style={step2FooterStyle}>
              <button type="button" onClick={() => setStep(1)} style={backBtnStyle}>← Atrás</button>
              <button type="button" onClick={handleSubmit} disabled={submitting} style={submitBtnStyle}>{submitting ? 'Enviando...' : 'Confirmar Solicitud ✓'}</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

const containerStyle = { maxWidth: '920px', margin: '0 auto' }
const headerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }
const titleStyle = { fontSize: '22px', fontWeight: 800, color: '#0b2f63' }
const subtitleStyle = { color: '#64748b', fontSize: '14px', marginTop: '4px' }
const stepsStyle = { display: 'flex', gap: '8px' }
const stepActiveStyle = { width: '48px', height: '8px', borderRadius: '99px', background: '#00843D' }
const stepInactiveStyle = { width: '40px', height: '8px', borderRadius: '99px', background: '#e2e8f0' }
const tabsCardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '18px', marginBottom: '16px' }
const tabsRowStyle = { display: 'flex', gap: '0', marginBottom: '14px', background: '#f1f5f9', borderRadius: '12px', padding: '4px' }
const tabActiveStyle = { flex: 1, padding: '10px', border: 'none', borderRadius: '10px', background: '#00843D', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', textAlign: 'center' }
const tabInactiveStyle = { flex: 1, padding: '10px', border: 'none', borderRadius: '10px', background: 'transparent', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer', textAlign: 'center' }
const searchInputStyle = { width: '100%', border: '1px solid #e5e7eb', background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', color: '#111827', boxSizing: 'border-box' }
const studentNoticeStyle = { marginTop: '12px', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#15803d', fontWeight: 600 }
const resourceGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }
const resourceCardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }
const selectedCardStyle = { borderColor: '#00843D', background: '#f0fdf4', boxShadow: '0 0 0 2px #00843D' }
const cardTopRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }
const cardLeftStyle = { display: 'flex', alignItems: 'center', gap: '10px' }
const iconSpaceStyle = { width: '34px', height: '34px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }
const iconEquipStyle = { width: '34px', height: '34px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }
const checkStyle = { width: '22px', height: '22px', borderRadius: '50%', background: '#00843D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }
const cardNameStyle = { fontWeight: 700, color: '#111827', fontSize: '14px' }
const cardLocStyle = { fontSize: '11px', color: '#94a3b8' }
const cardDescStyle = { fontSize: '12px', color: '#64748b', lineHeight: '1.4', marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
const cardMetaRowStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap' }
const metaBadgeStyle = { fontSize: '11px', color: '#64748b', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '6px', padding: '2px 8px' }
const paginationRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', marginBottom: '4px' }
const pageTextStyle = { color: '#64748b', fontSize: '13px' }
const pagerStyle = { display: 'flex', gap: '8px' }
const pagerBtnStyle = (d) => ({ width: '34px', height: '34px', border: '1px solid #e5e7eb', background: d ? '#f8fafc' : '#fff', borderRadius: '10px', color: d ? '#cbd5e1' : '#475569', cursor: d ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '14px' })
const emptyBlockStyle = { textAlign: 'center', padding: '40px 0' }
const emptyMsgStyle = { color: '#94a3b8', fontSize: '14px', textAlign: 'center' }
const step1FooterStyle = { display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }
const continueButtonStyle = { border: 'none', background: '#00843D', color: '#fff', padding: '13px 30px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }
const disabledBtnStyle = { opacity: 0.5, cursor: 'not-allowed' }
const bannerStyle = { background: '#1e293b', borderRadius: '16px', padding: '18px 22px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const bannerLeftStyle = { display: 'flex', alignItems: 'center', gap: '14px' }
const bannerIconStyle = { width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }
const bannerTitleStyle = { color: '#fff', fontWeight: 700, fontSize: '16px' }
const bannerSubStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }
const changeBtnStyle = { border: 'none', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }
const assocCardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '16px', marginBottom: '16px' }
const assocTitleStyle = { fontWeight: 700, color: '#111827', fontSize: '14px', marginBottom: '10px' }
const assocListStyle = { display: 'flex', flexDirection: 'column', gap: '6px' }
const assocItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '10px 14px' }
const assocNameStyle = { fontWeight: 600, color: '#334155', fontSize: '13px' }
const assocMetaStyle = { color: '#94a3b8', fontSize: '11px' }
const formCardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '16px' }
const formRow2Style = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' }
const fLabelStyle = { fontWeight: 700, color: '#374151', fontSize: '14px' }
const fInputStyle = { border: '1px solid #e5e7eb', background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', outline: 'none', color: '#111827' }
const fTextareaStyle = { border: '1px solid #e5e7eb', background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', outline: 'none', color: '#111827', resize: 'vertical', fontFamily: 'inherit' }
const fErrorStyle = { color: '#dc2626', fontSize: '12px', fontWeight: 600 }
const charCountStyle = { color: '#94a3b8', fontSize: '12px', textAlign: 'right' }
const warningStyle = { marginTop: '18px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 16px', fontSize: '13px', color: '#92400e', lineHeight: '1.5' }
const step2FooterStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const backBtnStyle = { border: 'none', background: 'transparent', color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '14px', padding: '13px 16px' }
const submitBtnStyle = { border: 'none', background: '#00843D', color: '#fff', padding: '13px 30px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }

export default NewRequestPage