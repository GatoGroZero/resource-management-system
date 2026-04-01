import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import AppCard from '../../components/common/AppCard'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/profileApi'
import { showToast } from '../../utils/alertUtils'

function ProfilePage() {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.lastName.trim()) {
      showToast('error', 'Nombre y apellidos son obligatorios')
      return
    }

    setLoading(true)

    try {
      await updateProfile(user.userId, {
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      })

      // Actualizar datos en localStorage y contexto
      const updatedUser = {
        ...user,
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      }
      login(updatedUser)

      showToast('success', 'Perfil actualizado correctamente')
      setEditing(false)
    } catch (error) {
      const message = error?.response?.data?.message || 'Error al actualizar perfil'
      showToast('error', message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    })
    setEditing(false)
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Perfil"
        subtitle="Consulta y edita la información de tu cuenta"
      />

      <div style={wrapperStyle}>
        <AppCard style={profileCardStyle}>
          <div style={avatarStyle}>
            {(user?.name?.[0] || 'U').toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={nameStyle}>
              {user?.name} {user?.lastName}
            </h2>
            <p style={roleStyle}>{user?.role}</p>
            <p style={emailDisplayStyle}>{user?.email}</p>
          </div>

          {!editing && (
            <button type="button" onClick={() => setEditing(true)} style={editBtnStyle}>
              ✏ Editar
            </button>
          )}
        </AppCard>

        {!editing ? (
          <div style={gridStyle}>
            <AppCard>
              <span style={labelStyle}>Nombre</span>
              <p style={valueStyle}>{user?.name || '—'}</p>
            </AppCard>

            <AppCard>
              <span style={labelStyle}>Apellidos</span>
              <p style={valueStyle}>{user?.lastName || '—'}</p>
            </AppCard>

            <AppCard>
              <span style={labelStyle}>Correo</span>
              <p style={valueStyle}>{user?.email || '—'}</p>
            </AppCard>

            <AppCard>
              <span style={labelStyle}>Teléfono</span>
              <p style={valueStyle}>{user?.phone || '—'}</p>
            </AppCard>

            <AppCard>
              <span style={labelStyle}>Rol</span>
              <p style={valueStyle}>{user?.role || '—'}</p>
            </AppCard>
          </div>
        ) : (
          <div style={formCardStyle}>
            <div style={formGridStyle}>
              <div style={fieldStyle}>
                <label style={formLabelStyle}>Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={formLabelStyle}>Apellidos</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={formLabelStyle}>Teléfono</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={formLabelStyle}>Correo</label>
                <input
                  type="text"
                  value={user?.email || ''}
                  disabled
                  style={{ ...inputStyle, background: '#f1f5f9', color: '#94a3b8' }}
                />
              </div>
            </div>

            <div style={formActionsStyle}>
              <button type="button" onClick={handleCancel} style={cancelBtnStyle}>
                Cancelar
              </button>
              <button type="button" onClick={handleSave} disabled={loading} style={saveBtnStyle}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

const wrapperStyle = { display: 'grid', gap: '1rem' }

const profileCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.5rem',
}

const avatarStyle = {
  width: '72px',
  height: '72px',
  borderRadius: '18px',
  background: '#00843D',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.8rem',
  fontWeight: 800,
}

const nameStyle = {
  color: '#022859',
  fontSize: '1.35rem',
  marginBottom: '0.25rem',
}

const roleStyle = {
  color: '#8A9BB8',
  fontSize: '0.95rem',
}

const emailDisplayStyle = {
  color: '#94a3b8',
  fontSize: '0.85rem',
  marginTop: '2px',
}

const editBtnStyle = {
  border: '1px solid #e5e7eb',
  background: '#ffffff',
  color: '#334155',
  padding: '10px 16px',
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '13px',
  cursor: 'pointer',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1rem',
}

const labelStyle = {
  display: 'block',
  color: '#8A9BB8',
  fontSize: '0.9rem',
  marginBottom: '0.5rem',
}

const valueStyle = {
  color: '#022859',
  fontSize: '1.05rem',
  fontWeight: 700,
  lineHeight: '1.5',
}

const formCardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
}

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '18px',
  marginBottom: '20px',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const formLabelStyle = {
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

const formActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  borderTop: '1px solid #f1f5f9',
  paddingTop: '16px',
}

const cancelBtnStyle = {
  border: 'none',
  background: 'transparent',
  color: '#64748b',
  padding: '10px 14px',
  borderRadius: '12px',
  fontWeight: 600,
  cursor: 'pointer',
}

const saveBtnStyle = {
  border: 'none',
  background: '#00843D',
  color: '#ffffff',
  padding: '10px 18px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
}

export default ProfilePage