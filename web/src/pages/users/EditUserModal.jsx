import { useEffect, useState } from 'react'
import { updateUser } from '../../api/userApi'
import { showToast, showConfirm } from '../../utils/alertUtils'
function EditUserModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      const roleSelection = user.role === 'ADMIN' ? 'ADMINISTRADOR' : 'SOLICITANTE'
      const userType = user.role === 'ADMIN' ? 'Administrativo' : (user.userType || '')

      setForm({
        name: user.name || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate || '',
        roleSelection,
        userType,
        identifier: user.identifier || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        active: user.active,
      })
    }
  }, [user])

  useEffect(() => {
    if (!form) return

    if (form.roleSelection === 'ADMINISTRADOR' && form.userType !== 'Administrativo') {
      setForm((prev) => ({ ...prev, userType: 'Administrativo' }))
    }

    if (form.roleSelection === 'SOLICITANTE' && form.userType === 'Administrativo') {
      setForm((prev) => ({ ...prev, userType: '' }))
    }
  }, [form?.roleSelection])

  if (!form) return null

  const handleChange = (field, value) => {
    if (field === 'phone') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 10)
      setForm((prev) => ({ ...prev, [field]: onlyDigits }))
      return
    }

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validateAge = (birthDate) => {
    if (!birthDate) return false

    const today = new Date()
    const born = new Date(birthDate)
    let age = today.getFullYear() - born.getFullYear()
    const monthDiff = today.getMonth() - born.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
      age--
    }

    return age >= 18 && age <= 100
  }

  const isUtezEmail = (email) => {
    return /^[A-Za-z0-9._%+-]+@utez\.edu\.mx$/i.test(email.trim())
  }

  const normalizeHumanName = (value) => value.trim().replace(/\s{2,}/g, ' ')
  const normalizeCompact = (value) => value.replace(/\s+/g, '')

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.lastName.trim() ||
      !form.birthDate ||
      !form.roleSelection ||
      !form.userType ||
      !form.identifier.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      showToast('error', 'Datos inválidos')
      return false
    }

    const cleanName = normalizeHumanName(form.name)
    const cleanLastName = normalizeHumanName(form.lastName)

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+( [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)?$/.test(cleanName)) {
      showToast('error', 'Datos de nombres no validos')
      return false
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+( [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)?$/.test(cleanLastName)) {
      showToast('error', 'Dato inválido en información personal')
      return false
    }

    if (!validateAge(form.birthDate)) {
      showToast('error', 'Año de nacimiento no válido')
      return false
    }

    if (!/^\d{10}$/.test(normalizeCompact(form.phone))) {
      showToast('error', 'Teléfono no válido')
      return false
    }

    if (!isUtezEmail(normalizeCompact(form.email))) {
      showToast('error', 'Correo no válido')
      return false
    }

    if (/\s/.test(normalizeCompact(form.identifier)) === false && !form.identifier.trim()) {
      showToast('error', 'Matrícula o número de empleado no válido')
      return false
    }

    if (form.roleSelection === 'ADMINISTRADOR' && form.userType !== 'Administrativo') {
      showToast('error', 'Datos institucionales están mal')
      return false
    }

    if (
      form.roleSelection === 'SOLICITANTE' &&
      !['Personal Académico', 'Estudiante'].includes(form.userType)
    ) {
      showToast('error', 'Datos institucionales están mal')
      return false
    }

    return true
  }

  const mapToBackendPayload = () => {
    let backendRole = ''

    if (form.roleSelection === 'ADMINISTRADOR') {
      backendRole = 'ADMIN'
    } else if (form.roleSelection === 'SOLICITANTE' && form.userType === 'Estudiante') {
      backendRole = 'STUDENT'
    } else if (form.roleSelection === 'SOLICITANTE' && form.userType === 'Personal Académico') {
      backendRole = 'STAFF'
    }

    return {
      name: normalizeHumanName(form.name),
      lastName: normalizeHumanName(form.lastName),
      birthDate: form.birthDate,
      role: backendRole,
      userType: form.userType,
      identifier: normalizeCompact(form.identifier),
      email: normalizeCompact(form.email).toLowerCase(),
      phone: normalizeCompact(form.phone),
      password: form.password,
      active: form.active,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    const confirmed = await showConfirm('¿Guardar cambios?', 'Se actualizarán los datos del usuario. ¿Deseas continuar?', 'Sí, guardar')
    if (!confirmed) return

    try {
      await updateUser(user.id, mapToBackendPayload())
      showToast('success', 'Usuario actualizado correctamente')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error?.response?.data?.message || 'Datos inválidos'
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  const typeDisabled = form.roleSelection === 'ADMINISTRADOR'

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={topRowStyle}>
          <div>
            <h2 style={titleStyle}>Editar Usuario</h2>
            <p style={subtitleStyle}>Actualiza la información del integrante.</p>
          </div>
    
          <button type="button" onClick={onClose} style={backButtonStyle}>
            ← Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>INFORMACIÓN PERSONAL</div>

            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nombre </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Apellidos </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Fecha de Nacimiento </label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>DATOS INSTITUCIONALES</div>

            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Rol </label>
                <select
                  value={form.roleSelection}
                  onChange={(e) => handleChange('roleSelection', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="SOLICITANTE">Solicitante</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Tipo de Usuario </label>
                <select
                  value={form.userType}
                  onChange={(e) => handleChange('userType', e.target.value)}
                  style={{
                    ...inputStyle,
                    background: typeDisabled ? '#f3f4f6' : '#ffffff',
                    color: typeDisabled ? '#64748b' : '#111827',
                  }}
                  disabled={typeDisabled}
                  required
                >
                  <option value="">
                    {typeDisabled ? 'Administrativo' : 'Selecciona tipo'}
                  </option>
                  {!typeDisabled && <option value="Personal Académico">Personal Académico</option>}
                  {!typeDisabled && <option value="Estudiante">Estudiante</option>}
                  {typeDisabled && <option value="Administrativo">Administrativo</option>}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Matrícula o Número de Empleado </label>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={(e) => handleChange('identifier', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Correo Institucional </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>CONTACTO Y SEGURIDAD</div>

            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Teléfono </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="10"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    style={{ ...inputStyle, paddingRight: '46px' }}
                    placeholder="Opcional"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeButtonStyle}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
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
  maxWidth: '780px',
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

const sectionHeaderStyle = {
  color: '#111827',
  fontSize: '14px',
  fontWeight: 800,
  marginBottom: '16px',
  letterSpacing: '0.2px',
}

const grid2Style = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '18px 18px',
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

const eyeButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'transparent',
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

export default EditUserModal