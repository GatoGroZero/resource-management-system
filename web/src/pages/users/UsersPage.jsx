import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import CreateUserModal from './CreateUserModal'
import ViewUserModal from './ViewUserModal'
import EditUserModal from './EditUserModal'
import { getUserById, getUsers, toggleUserStatus } from '../../api/userApi'
import { showToast } from '../../utils/alertUtils'

function UsersPage() {
  const [usersPage, setUsersPage] = useState(null)
  const [page, setPage] = useState(0)

  const [roleFilter, setRoleFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [backendFilter, setBackendFilter] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const fetchUsers = async (customPage = page, customFilter = backendFilter) => {
    try {
      const data = await getUsers({
        page: customPage,
        size: 10,
        filter: customFilter,
        search: '',
      })
      setUsersPage(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  useEffect(() => {
    fetchUsers(page, backendFilter)
  }, [page, backendFilter])

  const applyRoleFilter = (value) => {
    setPage(0)
    setRoleFilter(value)
    setTypeFilter('')
    setStatusFilter('')

    if (value === 'ADMIN') setBackendFilter('ADMIN')
    else if (value === 'SOLICITANTE') setBackendFilter('')
    else setBackendFilter('')
  }

  const applyTypeFilter = (value) => {
    setPage(0)
    setRoleFilter('')
    setTypeFilter(value)
    setStatusFilter('')

    if (value === 'ESTUDIANTE') setBackendFilter('STUDENTS')
    else if (value === 'PERSONAL') setBackendFilter('STAFF')
    else setBackendFilter('')
  }

  const applyStatusFilter = (value) => {
    setPage(0)
    setRoleFilter('')
    setTypeFilter('')
    setStatusFilter(value)

    if (value === 'ACTIVO') setBackendFilter('ACTIVE')
    else if (value === 'INACTIVO') setBackendFilter('INACTIVE')
    else setBackendFilter('')
  }

  const clearFilters = () => {
    setPage(0)
    setRoleFilter('')
    setTypeFilter('')
    setStatusFilter('')
    setBackendFilter('')
  }

  const handlePrev = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (usersPage && !usersPage.last) setPage(page + 1)
  }

  const handleView = async (id) => {
    try {
      const data = await getUserById(id)
      setSelectedUser(data)
      setOpenViewModal(true)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleEdit = async (id) => {
    try {
      const data = await getUserById(id)
      setSelectedUser(data)
      setOpenEditModal(true)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleToggleStatus = async (user) => {
    if (user.role === 'ADMIN') {
      showToast('error', 'No se puede desactivar un administrador')
      return
    }

    try {
      await toggleUserStatus(user.id)
      showToast('success', 'Estado actualizado correctamente')
      fetchUsers()
    } catch (error) {
      const message = error?.response?.data?.message || 'Datos inválidos'
      showToast('error', message)
    }
  }

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Administración de Usuarios</h1>
          <p style={subtitleStyle}>Gestión centralizada de accesos y perfiles universitarios.</p>
        </div>

        <button type="button" onClick={() => setOpenCreateModal(true)} style={addButtonStyle}>
          + Nuevo Usuario
        </button>
      </div>

      <div style={filtersPanelStyle}>
        <div style={filtersGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>FILTRAR POR ROL</label>
            <select
              value={roleFilter}
              onChange={(e) => applyRoleFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Todos los Roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="SOLICITANTE">Usuario solicitante</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>FILTRAR POR TIPO</label>
            <select
              value={typeFilter}
              onChange={(e) => applyTypeFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Todos los Tipos</option>
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="PERSONAL">Personal</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>FILTRAR POR ESTADO</label>
            <select
              value={statusFilter}
              onChange={(e) => applyStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Todos los Estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          <div style={clearWrapStyle}>
            <button type="button" onClick={clearFilters} style={clearButtonStyle}>
              ↻ Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>MATRÍCULA / ID</th>
              <th style={thStyle}>NOMBRE COMPLETO</th>
              <th style={thStyle}>CORREO INSTITUCIONAL</th>
              <th style={thStyle}>ROL</th>
              <th style={thStyle}>TIPO</th>
              <th style={thStyle}>ESTADO</th>
              <th style={thStyle}>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {usersPage?.content?.map((user, index) => (
              <tr key={user.id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdCodeStyle}>{user.identifier || '—'}</td>
                <td style={tdNameStyle}>{user.fullName}</td>
                <td style={tdMutedStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span style={roleBadgeStyle(user.role)}>
                    {formatRole(user.role)}
                  </span>
                </td>
                <td style={tdMutedStyle}>{formatType(user.userType)}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(user.active)}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={actionsIconsStyle}>
                    <button type="button" onClick={() => handleView(user.id)} style={viewButtonStyle}>👁</button>
                    <button type="button" onClick={() => handleEdit(user.id)} style={editButtonStyle}>✏</button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user)}
                      style={toggleButtonStyle(user.active, user.role === 'ADMIN')}
                      disabled={user.role === 'ADMIN'}
                      title={user.role === 'ADMIN' ? 'No disponible para administradores' : ''}
                    >
                      ⏻
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={footerRowStyle}>
          <span style={pageTextStyle}>
            Página {usersPage ? usersPage.number + 1 : 1} de {usersPage ? Math.max(usersPage.totalPages, 1) : 1}
          </span>

          <div style={pagerButtonsStyle}>
            <button type="button" onClick={handlePrev} disabled={page === 0} style={pagerButtonStyle(page === 0)}>
              ‹
            </button>
            <button type="button" onClick={handleNext} disabled={usersPage?.last} style={pagerButtonStyle(Boolean(usersPage?.last))}>
              ›
            </button>
          </div>
        </div>
      </div>

      {openCreateModal && (
        <CreateUserModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => fetchUsers()}
        />
      )}

      {openViewModal && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setOpenViewModal(false)}
        />
      )}

      {openEditModal && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setOpenEditModal(false)}
          onSuccess={() => fetchUsers()}
        />
      )}
    </DashboardLayout>
  )
}

function formatRole(role) {
  if (role === 'ADMIN') return 'Administrador'
  return 'Usuario solicitante'
}

function formatType(userType) {
  if (userType === 'Personal Académico') return 'Personal'
  return userType || '—'
}

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '18px',
}

const titleStyle = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#0b2f63',
  marginBottom: '6px',
}

const subtitleStyle = {
  color: '#64748b',
  fontSize: '14px',
}

const addButtonStyle = {
  border: 'none',
  background: '#00843D',
  color: '#ffffff',
  padding: '12px 18px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
}

const filtersPanelStyle = {
  background: '#ffffff',
  border: '1px solid #dfe6ee',
  borderRadius: '16px',
  padding: '14px',
  marginBottom: '18px',
  boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
}

const filtersGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr auto',
  gap: '12px',
  alignItems: 'end',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const labelStyle = {
  fontSize: '12px',
  fontWeight: 800,
  color: '#94a3b8',
}

const selectStyle = {
  border: '1px solid #d7dde5',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '12px 14px',
  outline: 'none',
  color: '#334155',
  fontSize: '14px',
}

const clearWrapStyle = {
  display: 'flex',
  alignItems: 'end',
}

const clearButtonStyle = {
  border: '1px solid #d7dde5',
  background: '#ffffff',
  color: '#475569',
  padding: '12px 16px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const tableCardStyle = {
  background: '#ffffff',
  border: '1px solid #dfe6ee',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
}

const thStyle = {
  textAlign: 'left',
  padding: '16px 18px',
  background: '#f8fafc',
  borderBottom: '1px solid #e5e7eb',
  color: '#64748b',
  fontSize: '13px',
  fontWeight: 800,
  textTransform: 'uppercase',
}

const rowEvenStyle = { background: '#ffffff' }
const rowOddStyle = { background: '#fcfdff' }

const tdStyle = {
  padding: '16px 18px',
  borderBottom: '1px solid #eef2f7',
  fontSize: '14px',
  verticalAlign: 'middle',
}

const tdCodeStyle = {
  ...tdStyle,
  color: '#36577b',
  fontWeight: 700,
}

const tdNameStyle = {
  ...tdStyle,
  color: '#0b2f63',
  fontWeight: 700,
}

const tdMutedStyle = {
  ...tdStyle,
  color: '#64748b',
}

const roleBadgeStyle = (role) => ({
  background: role === 'ADMIN' ? '#eef2ff' : '#eff6ff',
  color: role === 'ADMIN' ? '#4f46e5' : '#2563eb',
  padding: '5px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 700,
  display: 'inline-block',
})

const statusStyle = (active) => ({
  background: active ? '#dcfce7' : '#e5e7eb',
  color: active ? '#15803d' : '#6b7280',
  padding: '5px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 700,
  display: 'inline-block',
})

const actionsIconsStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}

const baseIconButtonStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  border: '1px solid transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
}

const viewButtonStyle = {
  ...baseIconButtonStyle,
  background: '#eef6ff',
  color: '#2563eb',
  borderColor: '#bfdbfe',
}

const editButtonStyle = {
  ...baseIconButtonStyle,
  background: '#f5f3ff',
  color: '#7c3aed',
  borderColor: '#ddd6fe',
}

const toggleButtonStyle = (active, disabled) => ({
  ...baseIconButtonStyle,
  background: disabled
    ? '#f8fafc'
    : active
      ? '#fef2f2'
      : '#ecfdf3',
  color: disabled
    ? '#cbd5e1'
    : active
      ? '#dc2626'
      : '#16a34a',
  borderColor: disabled
    ? '#e5e7eb'
    : active
      ? '#fecaca'
      : '#bbf7d0',
  cursor: disabled ? 'not-allowed' : 'pointer',
})

const footerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 18px',
  background: '#ffffff',
}

const pageTextStyle = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: 500,
}

const pagerButtonsStyle = {
  display: 'flex',
  gap: '8px',
}

const pagerButtonStyle = (disabled) => ({
  width: '36px',
  height: '36px',
  border: '1px solid #e5e7eb',
  background: disabled ? '#f8fafc' : '#ffffff',
  borderRadius: '10px',
  color: disabled ? '#cbd5e1' : '#475569',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: 700,
})

export default UsersPage