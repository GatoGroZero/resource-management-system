import { useEffect, useState } from 'react'
import { updateSpace } from '../../api/spaceApi'
import { showToast } from '../../utils/alertUtils'

function EditSpaceModal({ space, onClose, onSuccess }) {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (space) {
      setForm({
        name: space.name || '',
        category: space.category || '',
        location: space.location || '',
        capacity: String(space.capacity || ''),
        availability: space.availability || 'DISPONIBLE',
        active: space.active,
      })
    }
  }, [space])

  if (!form) return null

  const handleChange = (field, value) => {
    if (field === 'capacity') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 5)
      setForm((prev) => ({ ...prev, [field]: onlyDigits }))
      return
    }

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!form.name.trim() || !form.category || !form.location.trim() || !form.capacity || !form.availability) {
      showToast('error', 'Datos inválidos')
      return false
    }

    const cap = Number(form.capacity)
    if (Number.isNaN(cap) || cap < 1 || cap > 10000) {
      showToast('error', 'Capacidad no válida')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      await updateSpace(space.id, {
        name: form.name.trim().replace(/\s{2,}/g, ' '),
        category: form.category,
        location: form.location.trim().replace(/\s{2,}/g, ' '),
        capacity: Number(form.capacity),
        availability: form.availability,
        active: form.active,
      })

      showToast('success', 'Espacio actualizado correctamente')
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
            <h2 style={titleStyle}>Editar Espacio</h2>
            <p style={subtitleStyle}>Actualiza la información del espacio institucional.</p>
          </div>

          <button type="button" onClick={onClose} style={backButtonStyle}>
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <section style={sectionStyle}>
            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Categoría *</label>
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
                <label style={labelStyle}>Ubicación *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Capacidad *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Disponibilidad *</label>
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
                <label style={labelStyle}>Estado *</label>
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
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
  maxWidth: '760px',
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

export default EditSpaceModal