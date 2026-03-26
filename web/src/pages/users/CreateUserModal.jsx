import { useEffect, useState } from 'react'
import { createUser } from '../../api/userApi'
import { showToast } from '../../utils/alertUtils'

function CreateUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    birthDate: '',
    roleSelection: '',
    userType: '',
    identifier: '',
    email: '',
    phone: '',
    password: '',
    active: true,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (form.roleSelection === 'ADMINISTRADOR') {
      setForm((prev) => ({
        ...prev,
        userType: 'Administrativo',
      }))
    }

    if (form.roleSelection === 'SOLICITANTE' && form.userType === 'Administrativo') {
      setForm((prev) => ({
        ...prev,
        userType: '',
      }))
    }
  }, [form.roleSelection, form.userType])

  const handleChange = (field, value) => {
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

    return age >= 17
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
      name: form.name.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate,
      role: backendRole,
      userType: form.userType,
      identifier: form.identifier.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      active: form.active,
    }
  }

  const validateForm = () => {
    if (!form.roleSelection) {
      showToast('error', 'Selecciona un rol')
      return false
    }

    if (form.roleSelection === 'SOLICITANTE' && !form.userType) {
      showToast('error', 'Selecciona un tipo de usuario')
      return false
    }

    if (form.roleSelection === 'ADMINISTRADOR' && form.userType !== 'Administrativo') {
      showToast('error', 'El tipo de usuario del administrador debe ser Administrativo')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateAge(form.birthDate)) {
      showToast('error', 'El usuario debe tener mínimo 17 años')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = mapToBackendPayload()
      await createUser(payload)
      showToast('success', 'Usuario registrado correctamente')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo registrar el usuario'
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
            <h2 style={titleStyle}>Registrar Nuevo Usuario</h2>
            <p style={subtitleStyle}>Completa la información para dar de alta a un nuevo integrante.</p>
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
                <label style={labelStyle}>Nombre *</label>
                <input
                  type="text"
                  placeholder="Ej. Juan"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Apellidos *</label>
                <input
                  type="text"
                  placeholder="Ej. Pérez García"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Fecha de Nacimiento *</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  style={inputStyle}
                  required
                />
                <span style={helperStyle}>Mínimo 17 años.</span>
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>DATOS INSTITUCIONALES</div>

            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Rol *</label>
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
                <label style={labelStyle}>Tipo de Usuario *</label>
                <select
                  value={form.userType}
                  onChange={(e) => handleChange('userType', e.target.value)}
                  style={{
                    ...inputStyle,
                    background: typeDisabled ? '#f3f4f6' : '#ffffff',
                    color: typeDisabled ? '#64748b' : '#111827',
                    cursor: typeDisabled ? 'not-allowed' : 'pointer',
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
                <label style={labelStyle}>Matrícula o Número de Empleado *</label>
                <input
                  type="text"
                  placeholder="Ej. 2023TI001"
                  value={form.identifier}
                  onChange={(e) => handleChange('identifier', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Correo Institucional *</label>
                <input
                  type="email"
                  placeholder="usuario@utez.edu.mx"
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
                <label style={labelStyle}>Teléfono *</label>
                <input
                  type="text"
                  placeholder="7771234567"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Contraseña *</label>
                <input
                  type="password"
                  placeholder="Ingresa una contraseña"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </section>

          <div style={footerActionsStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancelar
            </button>

            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'Registrando...' : 'Registrar Usuario'}
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

const helperStyle = {
  color: '#94a3b8',
  fontSize: '12px',
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

export default CreateUserModal