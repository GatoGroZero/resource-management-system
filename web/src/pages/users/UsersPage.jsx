import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import CreateUserModal from './CreateUserModal'
import { getUsers } from '../../api/userApi'
import { showToast } from '../../utils/alertUtils'

function UsersPage() {
  const [usersPage, setUsersPage] = useState(null)
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [openModal, setOpenModal] = useState(false)

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
      showToast('error', 'No se pudieron cargar los usuarios')
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

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Gestión de Usuarios</h1>
        </div>

        <button type="button" onClick={() => setOpenModal(true)} style={addButtonStyle}>
          ＋ Agregar Usuario
        </button>
      </div>

      <div style={toolbarStyle}>
        <div style={searchWrapStyle}>
          <input
            type="text"
            placeholder="Buscar por nombre o matrícula/ID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={searchInputStyle}
          />
        </div>

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
          Estado: Activo
        </button>
        <button type="button" onClick={() => handleFilter('INACTIVE')} style={chipStyle(activeFilter === 'INACTIVE')}>
          Estado: Inactivo
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
            {usersPage?.content?.map((user) => (
              <tr key={user.id}>
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
                  <div style={actionsIconsStyle}>👁 ✏ ⏻</div>
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
            <button type="button" onClick={handlePrev} disabled={page === 0} style={pagerButtonStyle}>
              ‹
            </button>
            <button type="button" onClick={handleNext} disabled={usersPage?.last} style={pagerButtonStyle}>
              ›
            </button>
          </div>
        </div>
      </div>

      {openModal && (
        <CreateUserModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => fetchUsers()}
        />
      )}
    </DashboardLayout>
  )
}

function formatRole(role) {
  if (role === 'ADMIN') return 'Administrador'
  if (role === 'STAFF') return 'Personal Académico'
  return 'Estudiante'
}

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '18px',
}

const titleStyle = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#0b2f63',
}

const addButtonStyle = {
  border: 'none',
  background: '#c9f0cf',
  color: '#006c2f',
  padding: '12px 16px',
  borderRadius: '10px',
  fontWeight: 700,
  cursor: 'pointer',
}

const toolbarStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '12px',
  marginBottom: '14px',
}

const searchWrapStyle = {
  background: '#f8fafc',
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  overflow: 'hidden',
}

const searchInputStyle = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  padding: '12px 14px',
  outline: 'none',
  color: '#111827',
}

const searchButtonStyle = {
  border: 'none',
  background: '#e2e8f0',
  color: '#0b2f63',
  padding: '12px 16px',
  borderRadius: '10px',
  fontWeight: 700,
  cursor: 'pointer',
}

const filtersRowStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '12px',
}

const chipStyle = (active) => ({
  border: 'none',
  background: active ? '#e8f5e9' : '#f3f4f6',
  color: active ? '#166534' : '#94a3b8',
  padding: '10px 14px',
  borderRadius: '10px',
  fontWeight: 600,
  cursor: 'pointer',
})

const tableCardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  overflow: 'hidden',
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
  fontWeight: 700,
  textTransform: 'uppercase',
}

const tdStyle = {
  padding: '16px 18px',
  borderBottom: '1px solid #eef2f7',
  color: '#0f172a',
  fontSize: '14px',
}

const tdNameStyle = {
  ...tdStyle,
  color: '#0b2f63',
  fontWeight: 700,
}

const tdMutedStyle = {
  ...tdStyle,
  color: '#94a3b8',
}

const statusStyle = (active) => ({
  background: active ? '#dcfce7' : '#fee2e2',
  color: active ? '#15803d' : '#dc2626',
  padding: '4px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 700,
})

const actionsIconsStyle = {
  display: 'flex',
  gap: '12px',
  color: '#94a3b8',
}

const footerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 18px',
}

const pageTextStyle = {
  color: '#64748b',
  fontSize: '14px',
}

const pagerButtonsStyle = {
  display: 'flex',
  gap: '8px',
}

const pagerButtonStyle = {
  width: '36px',
  height: '36px',
  border: '1px solid #e5e7eb',
  background: '#f8fafc',
  borderRadius: '10px',
  color: '#64748b',
  cursor: 'pointer',
}

export default UsersPage