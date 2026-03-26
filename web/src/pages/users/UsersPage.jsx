import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import AppCard from '../../components/common/AppCard'
import { getUsers } from '../../api/userApi'
import { showToast } from '../../utils/alertUtils'

function UsersPage() {
  const [usersPage, setUsersPage] = useState(null)
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('')

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
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema"
      />

      <AppCard style={{ padding: '1.5rem' }}>
        <div style={searchRow}>
          <input
            type="text"
            placeholder="Buscar por nombre o matrícula/ID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={searchInputStyle}
          />

          <button onClick={handleSearch} style={searchButtonStyle}>
            Buscar
          </button>

          <button style={addButtonStyle}>
            Agregar Usuario
          </button>
        </div>

        <div style={filtersRow}>
          <button style={chipStyle(activeFilter === 'STUDENTS')} onClick={() => handleFilter('STUDENTS')}>
            Estudiantes
          </button>
          <button style={chipStyle(activeFilter === 'STAFF')} onClick={() => handleFilter('STAFF')}>
            Personal
          </button>
          <button style={chipStyle(activeFilter === 'ACTIVE')} onClick={() => handleFilter('ACTIVE')}>
            Estado: Activo
          </button>
          <button style={chipStyle(activeFilter === 'INACTIVE')} onClick={() => handleFilter('INACTIVE')}>
            Estado: Inactivo
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
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
                  <td style={tdStyle}>{user.fullName}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.identifier || '—'}</td>
                  <td style={tdStyle}>{formatRole(user.role)}</td>
                  <td style={tdStyle}>
                    <span style={statusStyle(user.active)}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={tdStyle}>👁 ✏ ⏻</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={paginationRow}>
          <button onClick={handlePrev} disabled={page === 0} style={pageButtonStyle}>
            ‹
          </button>

          <span style={{ color: '#8A9BB8' }}>
            Página {usersPage ? usersPage.number + 1 : 1} de {usersPage ? usersPage.totalPages : 1}
          </span>

          <button onClick={handleNext} disabled={usersPage?.last} style={pageButtonStyle}>
            ›
          </button>
        </div>
      </AppCard>
    </DashboardLayout>
  )
}

function formatRole(role) {
  if (role === 'ADMIN') return 'Administrador'
  if (role === 'STAFF') return 'Personal Académico'
  return 'Estudiante'
}

const searchRow = {
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  gap: '0.75rem',
  marginBottom: '1rem',
}

const searchInputStyle = {
  padding: '0.9rem 1rem',
  borderRadius: '12px',
  border: '1px solid #E5E7EB',
  background: '#F5F7FA',
  color: '#022859',
}

const searchButtonStyle = {
  border: 'none',
  borderRadius: '12px',
  padding: '0.9rem 1rem',
  background: '#D1D9E6',
  color: '#022859',
  fontWeight: '700',
  cursor: 'pointer',
}

const addButtonStyle = {
  border: 'none',
  borderRadius: '12px',
  padding: '0.9rem 1rem',
  background: '#C8E6C9',
  color: '#01402E',
  fontWeight: '700',
  cursor: 'pointer',
}

const filtersRow = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  marginBottom: '1.2rem',
}

const chipStyle = (active) => ({
  border: 'none',
  borderRadius: '10px',
  padding: '0.7rem 1rem',
  background: active ? '#C8E6C9' : '#F3F4F6',
  color: active ? '#01402E' : '#8A9BB8',
  fontWeight: '600',
  cursor: 'pointer',
})

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
}

const thStyle = {
  textAlign: 'left',
  padding: '1rem 0.8rem',
  borderBottom: '1px solid #E5E7EB',
  color: '#022859',
  fontSize: '0.95rem',
}

const tdStyle = {
  padding: '1rem 0.8rem',
  borderBottom: '1px solid #EEF2F7',
  color: '#022859',
  fontSize: '0.95rem',
}

const statusStyle = (active) => ({
  background: active ? '#C8E6C9' : '#FFE5CC',
  color: active ? '#01402E' : '#8B4500',
  padding: '0.25rem 0.65rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: '700',
})

const paginationRow = {
  marginTop: '1.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
}

const pageButtonStyle = {
  border: 'none',
  background: '#F3F4F6',
  color: '#022859',
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: '700',
}

export default UsersPage