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
        description: space.description || '',
        allowStudents: Boolean(space.allowStudents),
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

  const getNormalizedForm = () => ({
    name: form.name.trim().replace(/\s{2,}/g, ' '),
    location: form.location.trim().replace(/\s{2,}/g, ' '),
    description: form.description.trim().replace(/\s{2,}/g, ' '),
  })

  const validateForm = () => {
    const normalizedForm = getNormalizedForm()

    if (!normalizedForm.name) {
      showToast('error', 'Ingresa el nombre del espacio.')
      return false
    }

    if (normalizedForm.name.length < 3 || normalizedForm.name.length > 100) {
      showToast('error', 'El nombre del espacio debe tener entre 3 y 100 caracteres.')
      return false
    }

    if (!form.category) {
      showToast('error', 'Selecciona la categoria del espacio.')
      return false
    }

    if (!normalizedForm.location) {
      showToast('error', 'Ingresa la ubicacion del espacio.')
      return false
    }

    if (normalizedForm.location.length < 3 || normalizedForm.location.length > 150) {
      showToast('error', 'La ubicacion debe tener entre 3 y 150 caracteres.')
      return false
    }

    if (!form.capacity) {
      showToast('error', 'Ingresa la capacidad del espacio.')
      return false
    }

    const cap = Number(form.capacity)
    if (Number.isNaN(cap) || cap < 1 || cap > 10000) {
      showToast('error', 'La capacidad debe ser un numero entre 1 y 10000.')
      return false
    }

    if (!normalizedForm.description) {
      showToast('error', 'Ingresa una descripcion para el espacio.')
      return false
    }

    if (normalizedForm.description.length < 10 || normalizedForm.description.length > 500) {
      showToast('error', 'La descripcion debe tener entre 10 y 500 caracteres.')
      return false
    }

    if (!form.availability) {
      showToast('error', 'Selecciona la disponibilidad del espacio.')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    const normalizedForm = getNormalizedForm()

    try {
      await updateSpace(space.id, {
        name: normalizedForm.name,
        category: form.category,
        location: normalizedForm.location,
        capacity: Number(form.capacity),
        description: normalizedForm.description,
        allowStudents: form.allowStudents,
        availability: form.availability,
        active: form.active,
      })

      showToast('success', 'Espacio actualizado correctamente')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo actualizar el espacio. Revisa los campos e intenta nuevamente.'
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
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Categoría</label>
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
                <label style={labelStyle}>Ubicación</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Capacidad</label>
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
                <label style={labelStyle}>Descripción </label>
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
                  id="allowStudentsEdit"
                  type="checkbox"
                  checked={form.allowStudents}
                  onChange={(e) => handleChange('allowStudents', e.target.checked)}
                  style={checkboxStyle}
                />
                <label htmlFor="allowStudentsEdit" style={checkboxLabelStyle}>
                  Permitir para alumnos
                </label>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Disponibilidad</label>
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
                <label style={labelStyle}>Estado</label>
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

export default EditSpaceModal