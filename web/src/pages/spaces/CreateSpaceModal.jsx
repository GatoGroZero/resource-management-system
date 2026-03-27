import { useState } from 'react'
import { createSpace } from '../../api/spaceApi'
import { showToast } from '../../utils/alertUtils'

function CreateSpaceModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    location: '',
    capacity: '',
    description: '',
    allowStudents: false,
    availability: 'DISPONIBLE',
    active: true,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    if (field === 'capacity') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 5)
      setForm((prev) => ({ ...prev, [field]: onlyDigits }))
      return
    }

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.category ||
      !form.location.trim() ||
      !form.capacity ||
      !form.description.trim() ||
      !form.availability
    ) {
      showToast('error', 'Datos inválidos')
      return false
    }

    const cap = Number(form.capacity)
    if (Number.isNaN(cap) || cap < 1 || cap > 10000) {
      showToast('error', 'Capacidad no válida')
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
      await createSpace({
        name: form.name.trim().replace(/\s{2,}/g, ' '),
        category: form.category,
        location: form.location.trim().replace(/\s{2,}/g, ' '),
        capacity: Number(form.capacity),
        description: form.description.trim().replace(/\s{2,}/g, ' '),
        allowStudents: form.allowStudents,
        availability: form.availability,
        active: form.active,
      })

      showToast('success', 'Espacio registrado correctamente')
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
          <div>
            <h2 style={titleStyle}>Registrar Nuevo Espacio</h2>
            <p style={subtitleStyle}>Completa la información del espacio institucional.</p>
          </div>

          <button type="button" onClick={onClose} style={backButtonStyle}>
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <section style={sectionStyle}>
            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nombre*</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Categoría*</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Selecciona categoría</option>
                  <option value="AULA">Aula</option>
                  <option value="LABORATORIO">Laboratorio</option>
                  <option value="AUDITORIO">Auditorio</option>
                  <option value="SALA">Sala</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Ubicación*</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Capacidad*</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción*</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  style={textareaStyle}
                  rows={4}
                  required
                />
              </div>

              <div style={checkboxRowStyle}>
                <input
                  id="allowStudentsCreate"
                  type="checkbox"
                  checked={form.allowStudents}
                  onChange={(e) => handleChange('allowStudents', e.target.checked)}
                  style={checkboxStyle}
                />
                <label htmlFor="allowStudentsCreate" style={checkboxLabelStyle}>
                  Permitir para alumnos
                </label>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Disponibilidad*</label>
                <select
                  value={form.availability}
                  onChange={(e) => handleChange('availability', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="OCUPADO">Ocupado</option>
                  <option value="MANTENIMIENTO">Mantenimiento</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Estado*</label>
                <select
                  value={String(form.active)}
                  onChange={(e) => handleChange('active', e.target.value === 'true')}
                  style={inputStyle}
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
          </section>

          <div style={footerActionsStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancelar
            </button>

            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'Registrando...' : 'Registrar Espacio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '18px',
  zIndex: 100,
}

const modalStyle = {
  width: '100%',
  maxWidth: '820px',
  background: '#ffffff',
  borderRadius: '18px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
  overflow: 'hidden',
}

const topRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '20px 22px 12px 22px',
}

const titleStyle = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#111827',
  marginBottom: '6px',
}

const subtitleStyle = {
  color: '#64748b',
  fontSize: '14px',
}

const backButtonStyle = {
  border: 'none',
  background: 'transparent',
  color: '#64748b',
  fontWeight: 600,
  cursor: 'pointer',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const sectionStyle = {
  borderTop: '1px solid #eef2f7',
  padding: '18px 22px',
}

const grid2Style = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '18px',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const labelStyle = {
  color: '#374151',
  fontSize: '14px',
  fontWeight: 600,
}

const inputStyle = {
  border: '1px solid #d1d5db',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#111827',
  outline: 'none',
}

const textareaStyle = {
  border: '1px solid #d1d5db',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#111827',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
}

const checkboxRowStyle = {
  gridColumn: '1 / -1',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const checkboxStyle = {
  width: '18px',
  height: '18px',
  cursor: 'pointer',
}

const checkboxLabelStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
  cursor: 'pointer',
}

const footerActionsStyle = {
  borderTop: '1px solid #eef2f7',
  padding: '18px 22px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
}

const cancelButtonStyle = {
  border: 'none',
  background: 'transparent',
  color: '#374151',
  padding: '12px 16px',
  borderRadius: '12px',
  fontWeight: 600,
  cursor: 'pointer',
}

const submitButtonStyle = {
  border: 'none',
  background: '#00843D',
  color: '#ffffff',
  padding: '12px 18px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
}

export default CreateSpaceModal