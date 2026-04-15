import { useEffect, useState } from 'react'
import { createUser } from '../../api/userApi'
import { showToast, showConfirm } from '../../utils/alertUtils'
function CreateUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', lastName: '', birthDate: '', roleSelection: '', userType: '',
    identifier: '', email: '', phone: '', password: '', active: true,
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (form.roleSelection === 'ADMINISTRADOR') {
      setForm((prev) => ({ ...prev, userType: 'Administrativo' }))
    }
    if (form.roleSelection === 'SOLICITANTE' && form.userType === 'Administrativo') {
      setForm((prev) => ({ ...prev, userType: '' }))
    }
  }, [form.roleSelection])

  const handleChange = (field, value) => {
    if (field === 'phone') {
      setForm((prev) => ({ ...prev, [field]: value.replace(/\D/g, '').slice(0, 10) }))
    } else {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateAge = (birthDate) => {
    if (!birthDate) return false
    const today = new Date()
    const born = new Date(birthDate)
    let age = today.getFullYear() - born.getFullYear()
    const m = today.getMonth() - born.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--
    return age >= 18 && age <= 100
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'El nombre es obligatorio'
    if (!form.lastName.trim()) e.lastName = 'Los apellidos son obligatorios'
    if (!form.birthDate) e.birthDate = 'La fecha de nacimiento es obligatoria'
    else if (!validateAge(form.birthDate)) e.birthDate = 'El usuario debe tener entre 18 y 100 años'
    if (!form.roleSelection) e.roleSelection = 'Selecciona un rol'
    if (!form.userType) e.userType = 'Selecciona el tipo de usuario'
    if (!form.identifier.trim()) e.identifier = getIdentifierLabel() + ' es obligatorio'
    else if (/\s/.test(form.identifier.trim())) e.identifier = 'No debe contener espacios'
    if (!form.email.trim()) e.email = 'El correo es obligatorio'
    else if (!/^[A-Za-z0-9._%+-]+@utez\.edu\.mx$/i.test(form.email.trim())) e.email = 'Debe ser un correo institucional'
    if (!form.phone.trim()) e.phone = 'El teléfono es obligatorio'
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Debe ser un número de 10 dígitos'
    if (!form.password) e.password = 'La contraseña es obligatoria'
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const getIdentifierLabel = () => {
    if (form.userType === 'Estudiante') return 'Matrícula'
    if (form.userType === 'Personal Académico' || form.userType === 'Administrativo') return 'Número de Empleado'
    return 'Matrícula o Número de Empleado'
  }

  const getIdentifierPlaceholder = () => {
    if (form.userType === 'Estudiante') return ''//matricula
    if (form.userType === 'Personal Académico' || form.userType === 'Administrativo') return ''//numero de empleado
    return 'Selecciona primero el tipo de usuario'
  }

  const mapToBackendPayload = () => {
    let backendRole = ''
    if (form.roleSelection === 'ADMINISTRADOR') backendRole = 'ADMIN'
    else if (form.userType === 'Estudiante') backendRole = 'STUDENT'
    else if (form.userType === 'Personal Académico') backendRole = 'STAFF'

    return {
      name: form.name.trim(), lastName: form.lastName.trim(), birthDate: form.birthDate,
      role: backendRole, userType: form.userType, identifier: form.identifier.trim(),
      email: form.email.trim().toLowerCase(), phone: form.phone.trim(),
      password: form.password, active: form.active,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    const confirmed = await showConfirm('¿Registrar usuario?', 'Se creará un nuevo usuario en el sistema. ¿Deseas continuar?', 'Sí, registrar')
    if (!confirmed) return
    try {
      await createUser(mapToBackendPayload())
      showToast('success', 'Usuario registrado correctamente')
      onSuccess()
      onClose()
    } catch (error) {
      const msg = error?.response?.data?.message || ''
      if (msg.includes('Correo')) showToast('error', 'El correo ingresado ya está registrado')
      else if (msg.includes('Matrícula') || msg.includes('empleado')) showToast('error', getIdentifierLabel() + ' ya está registrado')
      else showToast('error', 'No se pudo registrar el usuario. Revisa los datos ingresados.')
    } finally { setLoading(false) }
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
          <button type="button" onClick={onClose} style={backButtonStyle}>← Volver</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>INFORMACIÓN PERSONAL</div>
            <div style={grid2Style}>
              <Field label="Nombre *" value={form.name} onChange={(v) => handleChange('name', v)} error={errors.name} placeholder="Ej: Nombre(s)" />
              <Field label="Apellidos *" value={form.lastName} onChange={(v) => handleChange('lastName', v)} error={errors.lastName} placeholder="Ej: Apellido(s)" />
              <div style={fieldStyle}>
                <label style={labelStyle}>Fecha de Nacimiento *</label>
                <input type="date" value={form.birthDate} onChange={(e) => handleChange('birthDate', e.target.value)} style={{ ...inputStyle, ...(errors.birthDate ? errInputStyle : {}) }} />
                {errors.birthDate && <span style={errStyle}>{errors.birthDate}</span>}
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>DATOS INSTITUCIONALES</div>
            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Rol *</label>
                <select value={form.roleSelection} onChange={(e) => handleChange('roleSelection', e.target.value)} style={{ ...inputStyle, ...(errors.roleSelection ? errInputStyle : {}) }}>
                  <option value="">Selecciona un rol</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="SOLICITANTE">Solicitante</option>
                </select>
                {errors.roleSelection && <span style={errStyle}>{errors.roleSelection}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Tipo de Usuario *</label>
                <select value={form.userType} onChange={(e) => handleChange('userType', e.target.value)} disabled={typeDisabled}
                  style={{ ...inputStyle, ...(typeDisabled ? disabledInputStyle : {}), ...(errors.userType ? errInputStyle : {}) }}>
                  <option value="">{typeDisabled ? 'Administrativo' : 'Selecciona tipo'}</option>
                  {!typeDisabled && <option value="Personal Académico">Personal Académico</option>}
                  {!typeDisabled && <option value="Estudiante">Estudiante</option>}
                  {typeDisabled && <option value="Administrativo">Administrativo</option>}
                </select>
                {errors.userType && <span style={errStyle}>{errors.userType}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>{getIdentifierLabel()} *</label>
                <input type="text" value={form.identifier} onChange={(e) => handleChange('identifier', e.target.value)}
                  placeholder={getIdentifierPlaceholder()} style={{ ...inputStyle, ...(errors.identifier ? errInputStyle : {}) }} />
                {errors.identifier && <span style={errStyle}>{errors.identifier}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Correo Institucional *</label>
                <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="correo" style={{ ...inputStyle, ...(errors.email ? errInputStyle : {}) }} />
                {errors.email && <span style={errStyle}>{errors.email}</span>}
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>CONTACTO Y SEGURIDAD</div>
            <div style={grid2Style}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Teléfono (10 dígitos) *</label>
                <input type="text" inputMode="numeric" maxLength="10" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="7771234567" style={{ ...inputStyle, ...(errors.phone ? errInputStyle : {}) }} />
                {errors.phone && <span style={errStyle}>{errors.phone}</span>}
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Contraseña *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres" style={{ ...inputStyle, paddingRight: '46px', ...(errors.password ? errInputStyle : {}) }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password && <span style={errStyle}>{errors.password}</span>}
              </div>
            </div>
          </section>

          <div style={footerActionsStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancelar</button>
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'Registrando...' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, error, placeholder }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || ''}
        style={{ ...inputStyle, ...(error ? errInputStyle : {}) }} />
      {error && <span style={errStyle}>{error}</span>}
    </div>
  )
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', zIndex: 100 }
const modalStyle = { width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', borderRadius: '18px', border: '1px solid #e5e7eb', boxShadow: '0 18px 40px rgba(0,0,0,0.12)' }
const topRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 22px 12px 22px' }
const titleStyle = { fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '6px' }
const subtitleStyle = { color: '#64748b', fontSize: '14px' }
const backButtonStyle = { border: 'none', background: 'transparent', color: '#64748b', fontWeight: 600, cursor: 'pointer' }
const formStyle = { display: 'flex', flexDirection: 'column' }
const sectionStyle = { borderTop: '1px solid #eef2f7', padding: '18px 22px' }
const sectionHeaderStyle = { color: '#111827', fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.2px' }
const grid2Style = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }
const labelStyle = { color: '#374151', fontSize: '14px', fontWeight: 600 }
const inputStyle = { border: '1px solid #d1d5db', background: '#fff', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box' }
const errInputStyle = { borderColor: '#fca5a5', background: '#fef2f2' }
const disabledInputStyle = { background: '#f3f4f6', color: '#64748b', cursor: 'not-allowed' }
const errStyle = { color: '#dc2626', fontSize: '12px', fontWeight: 600 }
const eyeButtonStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer' }
const footerActionsStyle = { borderTop: '1px solid #eef2f7', padding: '18px 22px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }
const cancelButtonStyle = { border: 'none', background: 'transparent', color: '#374151', padding: '12px 16px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }
const submitButtonStyle = { border: 'none', background: '#00843D', color: '#fff', padding: '12px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

export default CreateUserModal