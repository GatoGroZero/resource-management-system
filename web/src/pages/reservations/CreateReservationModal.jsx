import { useEffect, useState } from 'react'
import { createReservation, getReservationOptions } from '../../api/reservationApi'
import { showToast } from '../../utils/alertUtils'

function CreateReservationModal({ onClose, onSuccess }) {
  const [options, setOptions] = useState({ users: [], spaces: [], equipments: [] })
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    requesterId: '',
    resourceType: 'SPACE',
    resourceId: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    observations: '',
  })

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await getReservationOptions()
        setOptions(data)
      } catch {
        showToast('error', 'No se pudieron cargar las opciones')
      } finally {
        setLoadingOptions(false)
      }
    }

    loadOptions()
  }, [])

  useEffect(() => {
    setForm((prev) => ({ ...prev, resourceId: '' }))
  }, [form.resourceType])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (
      !form.requesterId ||
      !form.resourceType ||
      !form.resourceId ||
      !form.reservationDate ||
      !form.startTime ||
      !form.endTime ||
      !form.purpose.trim()
    ) {
      showToast('error', 'Datos inválidos')
      return false
    }

    if (form.endTime <= form.startTime) {
      showToast('error', 'Horario no válido')
      return false
    }

    if (form.purpose.trim().length < 10 || form.purpose.trim().length > 500) {
      showToast('error', 'Motivo no válido')
      return false
    }

    if (form.observations.trim() && form.observations.trim().length > 500) {
      showToast('error', 'Observaciones no válidas')
      return false
    }

    return true
  }

  const currentResources = form.resourceType === 'SPACE' ? options.spaces : options.equipments

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)

    try {
      await createReservation({
        requesterId: Number(form.requesterId),
        resourceType: form.resourceType,
        resourceId: Number(form.resourceId),
        reservationDate: form.reservationDate,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose.trim().replace(/\s{2,}/g, ' '),
        observations: form.observations.trim().replace(/\s{2,}/g, ' '),
      })

      showToast('success', 'Reserva registrada correctamente')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error?.response?.data?.message || 'Datos inválidos'
      showToast('error', message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={topRowStyle}>
          <div>
            <h2 style={titleStyle}>Registrar Nueva Reserva</h2>
            <p style={subtitleStyle}>Completa la información de la reserva institucional.</p>
          </div>
          <button type="button" onClick={onClose} style={backButtonStyle}>← Volver</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <section style={sectionStyle}>
            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Solicitante*</label>
                <select
                  value={form.requesterId}
                  onChange={(e) => handleChange('requesterId', e.target.value)}
                  style={inputStyle}
                  disabled={loadingOptions}
                  required
                >
                  <option value="">Selecciona solicitante</option>
                  {options.users.map((user) => (
                    <option key={user.id} value={user.id}>{user.label}</option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Tipo de recurso*</label>
                <select
                  value={form.resourceType}
                  onChange={(e) => handleChange('resourceType', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="SPACE">Espacio</option>
                  <option value="EQUIPMENT">Equipo</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Recurso*</label>
                <select
                  value={form.resourceId}
                  onChange={(e) => handleChange('resourceId', e.target.value)}
                  style={inputStyle}
                  disabled={loadingOptions}
                  required
                >
                  <option value="">Selecciona recurso</option>
                  {currentResources.map((resource) => (
                    <option key={resource.id} value={resource.id}>{resource.label}</option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Fecha*</label>
                <input
                  type="date"
                  value={form.reservationDate}
                  onChange={(e) => handleChange('reservationDate', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Hora inicio*</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Hora fin*</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Motivo*</label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  style={textareaStyle}
                  rows={4}
                  required
                />
              </div>

              <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Observaciones</label>
                <textarea
                  value={form.observations}
                  onChange={(e) => handleChange('observations', e.target.value)}
                  style={textareaStyle}
                  rows={3}
                />
              </div>
            </div>
          </section>

          <div style={footerActionsStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancelar</button>
            <button type="submit" disabled={saving} style={submitButtonStyle}>
              {saving ? 'Registrando...' : 'Registrar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 100 }
const modalStyle = { width: '100%', maxWidth: '860px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', boxShadow: '0 18px 40px rgba(0,0,0,0.12)', overflow: 'hidden' }
const topRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 22px 12px 22px' }
const titleStyle = { fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '6px' }
const subtitleStyle = { color: '#64748b', fontSize: '14px' }
const backButtonStyle = { border: 'none', background: 'transparent', color: '#64748b', fontWeight: 600, cursor: 'pointer' }
const formStyle = { display: 'flex', flexDirection: 'column' }
const sectionStyle = { borderTop: '1px solid #eef2f7', padding: '18px 22px' }
const grid2Style = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }
const labelStyle = { color: '#374151', fontSize: '14px', fontWeight: 600 }
const inputStyle = { border: '1px solid #d1d5db', background: '#ffffff', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: '#111827', outline: 'none' }
const textareaStyle = { border: '1px solid #d1d5db', background: '#ffffff', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: '#111827', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }
const footerActionsStyle = { borderTop: '1px solid #eef2f7', padding: '18px 22px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }
const cancelButtonStyle = { border: 'none', background: 'transparent', color: '#374151', padding: '12px 16px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }
const submitButtonStyle = { border: 'none', background: '#00843D', color: '#ffffff', padding: '12px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

export default CreateReservationModal