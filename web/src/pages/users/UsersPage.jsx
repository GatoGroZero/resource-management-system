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
  const [searchInput, setSearchInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const fetchUsers = async (customPage = page, customFilter = activeFilter, customSearch = '') => {
    try {
      const data = await getUsers({
        page: customPage,
        size: 10,
        filter: customFilter,
        search: customSearch,
      })
      setUsersPage(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  useEffect(() => {
    fetchUsers(page, activeFilter, '')
  }, [page, activeFilter])

  const handleSearch = () => {
    setActiveFilter('')
    setPage(0)
    fetchUsers(0, '', searchInput.trim())
  }

  const handleFilter = (filter) => {
    setSearchInput('')
    setPage(0)
    setActiveFilter(filter)
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

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(id)
      showToast('success', 'Estado actualizado correctamente')
      fetchUsers()
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Gestión de Usuarios</h1>
        </div>

        <button type="button" onClick={() => setOpenCreateModal(true)} style={addButtonStyle}>
          + Agregar Usuario
        </button>
      </div>

      <div style={toolbarStyle}>
        <input
          type="text"
          placeholder="Buscar por nombre o matrícula/ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={searchInputStyle}
        />

        <button type="button" onClick={handleSearch} style={searchButtonStyle}>
          Buscar
        </button>
      </div>

      <div style={filtersRowStyle}>
        <button type="button" onClick={() => handleFilter('STUDENTS')} style={chipStyle(activeFilter === 'STUDENTS')}>
          Estudiantes
        </button>
        <button type="button" onClick={() => handleFilter('STAFF')} style={chipStyle(activeFilter === 'STAFF')}>
          Personal
        </button>
        <button type="button" onClick={() => handleFilter('ACTIVE')} style={chipStyle(activeFilter === 'ACTIVE')}>
          Activos
        </button>
        <button type="button" onClick={() => handleFilter('INACTIVE')} style={chipStyle(activeFilter === 'INACTIVE')}>
          Inactivos
        </button>
      </div>

      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Matrícula/ID</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usersPage?.content?.map((user, index) => (
              <tr key={user.id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdNameStyle}>{user.fullName}</td>
                <td style={tdMutedStyle}>{user.email}</td>
                <td style={tdMutedStyle}>{user.identifier || '—'}</td>
                <td style={tdMutedStyle}>{formatRole(user.role)}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(user.active)}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={actionsIconsStyle}>
                    <button
                      type="button"
                      onClick={() => handleView(user.id)}
                      style={viewButtonStyle}
                      title="Ver"
                    >
                      👁
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(user.id)}
                      style={editButtonStyle}
                      title="Editar"
                    >
                      ✏
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.id)}
                      style={toggleButtonStyle(user.active)}
                      title={user.active ? 'Desactivar' : 'Activar'}
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
            <button
              type="button"
              onClick={handlePrev}
              disabled={page === 0}
              style={pagerButtonStyle(page === 0)}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={usersPage?.last}
              style={pagerButtonStyle(Boolean(usersPage?.last))}
            >
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
  if (role === 'STAFF') return 'Personal'
  return 'Solicitante'
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
}

const addButtonStyle = {
  border: 'none',
  background: '#00843D',
  color: '#ffffff',
  padding: '12px 18px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,132,61,0.18)',
}

const toolbarStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '12px',
  marginBottom: '14px',
}

const searchInputStyle = {
  width: '100%',
  border: '1px solid #d7dde5',
  background: '#ffffff',
  borderRadius: '12px',
  padding: '12px 14px',
  outline: 'none',
  color: '#334155',
  fontSize: '14px',
}

const searchButtonStyle = {
  border: 'none',
  background: '#0b5fa5',
  color: '#ffffff',
  padding: '12px 18px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(11,95,165,0.18)',
}

const filtersRowStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '14px',
}

const chipStyle = (active) => ({
  border: '1px solid',
  borderColor: active ? '#b7dfc0' : '#e2e8f0',
  background: active ? '#e8f5e9' : '#f8fafc',
  color: active ? '#166534' : '#475569',
  padding: '9px 14px',
  borderRadius: '10px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
})

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
  letterSpacing: '0.2px',
}

const rowEvenStyle = {
  background: '#ffffff',
}

const rowOddStyle = {
  background: '#fcfdff',
}

const tdStyle = {
  padding: '16px 18px',
  borderBottom: '1px solid #eef2f7',
  color: '#0f172a',
  fontSize: '14px',
  verticalAlign: 'middle',
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

const statusStyle = (active) => ({
  background: active ? '#dcfce7' : '#fee2e2',
  color: active ? '#15803d' : '#dc2626',
  padding: '5px 11px',
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

const toggleButtonStyle = (active) => ({
  ...baseIconButtonStyle,
  background: active ? '#fef2f2' : '#ecfdf3',
  color: active ? '#dc2626' : '#16a34a',
  borderColor: active ? '#fecaca' : '#bbf7d0',
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