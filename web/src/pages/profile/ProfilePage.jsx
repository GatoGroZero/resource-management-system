import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import AppCard from '../../components/common/AppCard'
import { useAuth } from '../../context/AuthContext'
import { updateProfile, changePassword } from '../../api/profileApi'
import { showToast } from '../../utils/alertUtils'
import { formatRole } from '../../utils/formatUtils'

function ProfilePage() {
  const { user, login } = useAuth()

  // Teléfono
  const [editingPhone, setEditingPhone] = useState(false)
  const [phone, setPhone] = useState(user?.phone || '')
  const [phoneError, setPhoneError] = useState('')
  const [phoneLoading, setPhoneLoading] = useState(false)

  // Contraseña
  const [editingPass, setEditingPass] = useState(false)
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })
  const [passErrors, setPassErrors] = useState({})
  const [passLoading, setPassLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSavePhone = async () => {
    const cleaned = phone.replace(/\s/g, '')
    if (!cleaned) { setPhoneError('El teléfono es obligatorio'); return }
    if (!/^\d{10}$/.test(cleaned)) { setPhoneError('Debe ser un número de 10 dígitos'); return }
    setPhoneError('')
    setPhoneLoading(true)
    try {
      await updateProfile(user.userId, { phone: cleaned })
      const updated = { ...user, phone: cleaned }
      login(updated)
      showToast('success', 'Teléfono actualizado correctamente')
      setEditingPhone(false)
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Error al actualizar teléfono')
    } finally { setPhoneLoading(false) }
  }

  const handleCancelPhone = () => { setPhone(user?.phone || ''); setPhoneError(''); setEditingPhone(false) }

  const validatePassword = () => {
    const e = {}
    if (!passForm.current) e.current = 'Debes ingresar tu contraseña actual'
    if (!passForm.newPass) e.newPass = 'La nueva contraseña es obligatoria'
    else if (passForm.newPass.length < 8) e.newPass = 'Mínimo 8 caracteres'
    if (!passForm.confirm) e.confirm = 'Debes confirmar la nueva contraseña'
    else if (passForm.newPass !== passForm.confirm) e.confirm = 'Las contraseñas no coinciden'
    if (passForm.current && passForm.newPass && passForm.current === passForm.newPass) e.newPass = 'Debe ser diferente a la actual'
    setPassErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSavePassword = async () => {
    if (!validatePassword()) return
    setPassLoading(true)
    try {
      await changePassword(user.userId, {
        currentPassword: passForm.current,
        newPassword: passForm.newPass,
        confirmPassword: passForm.confirm,
      })
      showToast('success', 'Contraseña actualizada correctamente')
      setPassForm({ current: '', newPass: '', confirm: '' })
      setEditingPass(false)
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Error al cambiar contraseña')
    } finally { setPassLoading(false) }
  }

  const handleCancelPass = () => { setPassForm({ current: '', newPass: '', confirm: '' }); setPassErrors({}); setEditingPass(false) }

  return (
    <DashboardLayout>
      <PageHeader title="Perfil" subtitle="Consulta y edita la información de tu cuenta" />

      <div style={wrapperStyle}>
        {/* Card principal */}
        <AppCard style={profileCardStyle}>
          <div style={avatarStyle}>{(user?.name?.[0] || 'U').toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <h2 style={nameStyle}>{user?.name} {user?.lastName}</h2>
            <p style={roleStyle}>{formatRole(user?.role)}</p>
            <p style={emailDisplayStyle}>{user?.email}</p>
          </div>
        </AppCard>

        {/* Datos de solo lectura */}
        <div style={gridStyle}>
          <AppCard><span style={labelStyle}>Nombre</span><p style={valueStyle}>{user?.name || '—'}</p></AppCard>
          <AppCard><span style={labelStyle}>Apellidos</span><p style={valueStyle}>{user?.lastName || '—'}</p></AppCard>
          <AppCard><span style={labelStyle}>Correo institucional</span><p style={valueStyle}>{user?.email || '—'}</p></AppCard>
          <AppCard><span style={labelStyle}>Rol</span><p style={valueStyle}>{formatRole(user?.role)}</p></AppCard>
        </div>

        {/* Sección: Teléfono */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>📱 Teléfono</h3>
            {!editingPhone && (
              <button type="button" onClick={() => setEditingPhone(true)} style={editBtnStyle}>✏ Editar</button>
            )}
          </div>

          {!editingPhone ? (
            <p style={sectionValueStyle}>{user?.phone || 'Sin teléfono registrado'}</p>
          ) : (
            <div style={editBlockStyle}>
              <div style={fldStyle}>
                <label style={fLabel}>Teléfono (10 dígitos)</label>
                <input type="text" value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError('') }} maxLength={10} placeholder="7771234567" style={fInput} />
                {phoneError && <span style={fError}>{phoneError}</span>}
              </div>
              <div style={editActionsStyle}>
                <button type="button" onClick={handleCancelPhone} style={cancelBtnStyle}>Cancelar</button>
                <button type="button" onClick={handleSavePhone} disabled={phoneLoading} style={saveBtnStyle}>{phoneLoading ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </div>
          )}
        </div>

        {/* Sección: Contraseña */}
        <div style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>🔒 Contraseña</h3>
            {!editingPass && (
              <button type="button" onClick={() => setEditingPass(true)} style={editBtnStyle}>✏ Cambiar contraseña</button>
            )}
          </div>

          {!editingPass ? (
            <p style={sectionValueStyle}>••••••••</p>
          ) : (
            <div style={editBlockStyle}>
              <div style={fldStyle}>
                <label style={fLabel}>Contraseña actual</label>
                <div style={passWrapStyle}>
                  <input type={showCurrent ? 'text' : 'password'} value={passForm.current} onChange={(e) => setPassForm({ ...passForm, current: e.target.value })} placeholder="Ingresa tu contraseña actual" style={fInputPass} />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={eyeStyle}>{showCurrent ? '🙈' : '👁'}</button>
                </div>
                {passErrors.current && <span style={fError}>{passErrors.current}</span>}
              </div>

              <div style={passGridStyle}>
                <div style={fldStyle}>
                  <label style={fLabel}>Nueva contraseña</label>
                  <div style={passWrapStyle}>
                    <input type={showNew ? 'text' : 'password'} value={passForm.newPass} onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })} placeholder="Mínimo 8 caracteres" style={fInputPass} />
                    <button type="button" onClick={() => setShowNew(!showNew)} style={eyeStyle}>{showNew ? '🙈' : '👁'}</button>
                  </div>
                  {passErrors.newPass && <span style={fError}>{passErrors.newPass}</span>}
                </div>

                <div style={fldStyle}>
                  <label style={fLabel}>Confirmar nueva contraseña</label>
                  <div style={passWrapStyle}>
                    <input type={showConfirm ? 'text' : 'password'} value={passForm.confirm} onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })} placeholder="Repite la nueva contraseña" style={fInputPass} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeStyle}>{showConfirm ? '🙈' : '👁'}</button>
                  </div>
                  {passErrors.confirm && <span style={fError}>{passErrors.confirm}</span>}
                </div>
              </div>

              <div style={editActionsStyle}>
                <button type="button" onClick={handleCancelPass} style={cancelBtnStyle}>Cancelar</button>
                <button type="button" onClick={handleSavePassword} disabled={passLoading} style={saveBtnStyle}>{passLoading ? 'Guardando...' : 'Cambiar Contraseña'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

const wrapperStyle = { display: 'grid', gap: '1rem' }
const profileCardStyle = { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }
const avatarStyle = { width: '72px', height: '72px', borderRadius: '18px', background: '#00843D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, flexShrink: 0 }
const nameStyle = { color: '#022859', fontSize: '1.35rem', marginBottom: '0.25rem' }
const roleStyle = { color: '#00843D', fontSize: '0.95rem', fontWeight: 600 }
const emailDisplayStyle = { color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }
const labelStyle = { display: 'block', color: '#8A9BB8', fontSize: '0.9rem', marginBottom: '0.5rem' }
const valueStyle = { color: '#022859', fontSize: '1.05rem', fontWeight: 700, lineHeight: '1.5' }

const sectionCardStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
const sectionHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
const sectionTitleStyle = { fontSize: '16px', fontWeight: 700, color: '#111827' }
const sectionValueStyle = { color: '#64748b', fontSize: '14px' }
const editBtnStyle = { border: '1px solid #e5e7eb', background: '#fff', color: '#334155', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }

const editBlockStyle = { display: 'flex', flexDirection: 'column', gap: '14px' }
const fldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' }
const fLabel = { fontWeight: 700, color: '#374151', fontSize: '14px' }
const fInput = { border: '1px solid #d1d5db', background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: '#111827', outline: 'none' }
const fError = { color: '#dc2626', fontSize: '12px', fontWeight: 600 }

const passGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
const passWrapStyle = { position: 'relative' }
const fInputPass = { width: '100%', border: '1px solid #d1d5db', background: '#f8fafc', borderRadius: '12px', padding: '12px 42px 12px 14px', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box' }
const eyeStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }

const editActionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }
const cancelBtnStyle = { border: 'none', background: 'transparent', color: '#64748b', padding: '10px 14px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }
const saveBtnStyle = { border: 'none', background: '#00843D', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }

export default ProfilePage