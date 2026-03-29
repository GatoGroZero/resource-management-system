import { useState } from 'react'
import { createEquipment } from '../../api/equipmentApi'
import { showToast } from '../../utils/alertUtils'

function CreateEquipmentModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    inventoryNumber: '',
    name: '',
    category: 'Cómputo',
    description: '',
    allowStudents: false,
    condition: 'DISPONIBLE',
    active: true,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    if (field === 'inventoryNumber') {
      setForm((prev) => ({ ...prev, [field]: value.replace(/\s+/g, '') }))
      return
    }

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (
      !form.inventoryNumber.trim() ||
      !form.name.trim() ||
      !form.category.trim() ||
      !form.description.trim() ||
      !form.condition
    ) {
      showToast('error', 'Datos inválidos')
      return false
    }

    if (form.description.trim().length < 10 || form.description.trim().length > 500) {
      showToast('error', 'Descripción no válida')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      await createEquipment({
        inventoryNumber: form.inventoryNumber.trim(),
        name: form.name.trim().replace(/\s{2,}/g, ' '),
        category: form.category.trim().replace(/\s{2,}/g, ' '),
        description: form.description.trim().replace(/\s{2,}/g, ' '),
        allowStudents: form.allowStudents,
        condition: form.condition,
        active: form.active,
      })

      showToast('success', 'Equipo registrado correctamente')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error?.response?.data?.message || 'Datos inválidos'
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={topRowStyle}>
          <h2 style={titleStyle}>Registrar Nuevo Equipo</h2>
          <button type="button" onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={grid2Style}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Número de Inventario</label>
              <input
                type="text"
                value={form.inventoryNumber}
                onChange={(e) => handleChange('inventoryNumber', e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre del Equipo</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                style={inputStyle}
              >
                <option value="Cómputo">Cómputo</option>
                <option value="Audiovisual">Audiovisual</option>
                <option value="Laboratorio">Laboratorio</option>
              </select>
            </div>

            <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                style={textareaStyle}
                rows={4}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                id="allowStudentsEquipmentCreate"
                type="checkbox"
                checked={form.allowStudents}
                onChange={(e) => handleChange('allowStudents', e.target.checked)}
                style={checkboxStyle}
              />
              <label htmlFor="allowStudentsEquipmentCreate" style={checkboxLabelStyle}>
                Permitir acceso a estudiantes
              </label>
            </div>
          </div>

          <div style={footerActionsStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancelar</button>
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'Registrando...' : 'Registrar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 100 }
const modalStyle = { width: '100%', maxWidth: '560px', background: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb', boxShadow: '0 18px 40px rgba(0,0,0,0.12)', overflow: 'hidden' }
const topRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #eef2f7' }
const titleStyle = { fontSize: '18px', fontWeight: 800, color: '#111827' }
const closeButtonStyle = { border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }
const formStyle = { display: 'flex', flexDirection: 'column' }
const grid2Style = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', padding: '20px' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }
const labelStyle = { color: '#374151', fontSize: '14px', fontWeight: 600 }
const inputStyle = { border: '1px solid #d1d5db', background: '#ffffff', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: '#111827', outline: 'none' }
const textareaStyle = { border: '1px solid #d1d5db', background: '#ffffff', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: '#111827', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }
const checkboxStyle = { width: '18px', height: '18px', cursor: 'pointer' }
const checkboxLabelStyle = { fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }
const footerActionsStyle = { borderTop: '1px solid #eef2f7', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }
const cancelButtonStyle = { border: 'none', background: 'transparent', color: '#64748b', padding: '10px 14px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }
const submitButtonStyle = { border: 'none', background: '#00843D', color: '#ffffff', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

export default CreateEquipmentModal