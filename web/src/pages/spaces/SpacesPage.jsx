import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import CreateSpaceModal from './CreateSpaceModal'
import ViewSpaceModal from './ViewSpaceModal'
import EditSpaceModal from './EditSpaceModal'
import { getSpaceById, getSpaces, toggleSpaceStatus } from '../../api/spaceApi'
import { showToast } from '../../utils/alertUtils'

function SpacesPage() {
  const [spacesPage, setSpacesPage] = useState(null)
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)

  const fetchSpaces = async (customPage = page, customFilter = activeFilter, customSearch = '') => {
    try {
      const data = await getSpaces({
        page: customPage,
        size: 10,
        filter: customFilter,
        search: customSearch,
      })
      setSpacesPage(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  useEffect(() => {
    fetchSpaces(page, activeFilter, '')
  }, [page, activeFilter])

  const handleSearch = () => {
    setActiveFilter('')
    setPage(0)
    fetchSpaces(0, '', searchInput.trim())
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
    if (spacesPage && !spacesPage.last) setPage(page + 1)
  }

  const handleView = async (id) => {
    try {
      const data = await getSpaceById(id)
      setSelectedSpace(data)
      setOpenViewModal(true)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleEdit = async (id) => {
    try {
      const data = await getSpaceById(id)
      setSelectedSpace(data)
      setOpenEditModal(true)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await toggleSpaceStatus(id)
      showToast('success', 'Estado actualizado correctamente')
      fetchSpaces()
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Gestión de Espacios</h1>
          <p style={subtitleStyle}>Control de aulas, laboratorios y áreas comunes institucionales.</p>
        </div>

        <button type="button" onClick={() => setOpenCreateModal(true)} style={addButtonStyle}>
          + Registrar Nuevo Espacio
        </button>
      </div>

      <div style={toolbarStyle}>
        <input
          type="text"
          placeholder="Buscar por nombre o ubicación"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={searchInputStyle}
        />

        <button type="button" onClick={handleSearch} style={searchButtonStyle}>
          Buscar
        </button>
      </div>

      <div style={filtersRowStyle}>
        <button type="button" onClick={() => handleFilter('AULAS')} style={chipStyle(activeFilter === 'AULAS')}>
          Aulas
        </button>
        <button type="button" onClick={() => handleFilter('LABORATORIOS')} style={chipStyle(activeFilter === 'LABORATORIOS')}>
          Laboratorios
        </button>
        <button type="button" onClick={() => handleFilter('AUDITORIOS')} style={chipStyle(activeFilter === 'AUDITORIOS')}>
          Auditorios
        </button>
        <button type="button" onClick={() => handleFilter('SALAS')} style={chipStyle(activeFilter === 'SALAS')}>
          Salas
        </button>
        <button type="button" onClick={() => handleFilter('DISPONIBLE')} style={chipStyle(activeFilter === 'DISPONIBLE')}>
          Disponible
        </button>
        <button type="button" onClick={() => handleFilter('OCUPADO')} style={chipStyle(activeFilter === 'OCUPADO')}>
          Ocupado
        </button>
        <button type="button" onClick={() => handleFilter('MANTENIMIENTO')} style={chipStyle(activeFilter === 'MANTENIMIENTO')}>
          Mantenimiento
        </button>
      </div>

      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Ubicación</th>
              <th style={thStyle}>Capacidad</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Disponibilidad</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {spacesPage?.content?.map((space, index) => (
              <tr key={space.id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdNameStyle}>{space.name}</td>
                <td style={tdMutedStyle}>{formatCategory(space.category)}</td>
                <td style={tdMutedStyle}>{space.location}</td>
                <td style={tdMutedStyle}>{space.capacity}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(space.active)}>
                    {space.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={availabilityStyle(space.availability)}>
                    {formatAvailability(space.availability)}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={actionsIconsStyle}>
                    <button type="button" onClick={() => handleView(space.id)} style={viewButtonStyle}>👁</button>
                    <button type="button" onClick={() => handleEdit(space.id)} style={editButtonStyle}>✏</button>
                    <button type="button" onClick={() => handleToggleStatus(space.id)} style={toggleButtonStyle(space.active)}>⏻</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={footerRowStyle}>
          <span style={pageTextStyle}>
            Página {spacesPage ? spacesPage.number + 1 : 1} de {spacesPage ? Math.max(spacesPage.totalPages, 1) : 1}
          </span>

          <div style={pagerButtonsStyle}>
            <button type="button" onClick={handlePrev} disabled={page === 0} style={pagerButtonStyle(page === 0)}>
              ‹
            </button>
            <button type="button" onClick={handleNext} disabled={spacesPage?.last} style={pagerButtonStyle(Boolean(spacesPage?.last))}>
              ›
            </button>
          </div>
        </div>
      </div>

      {openCreateModal && (
        <CreateSpaceModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => fetchSpaces()}
        />
      )}

      {openViewModal && (
        <ViewSpaceModal
          space={selectedSpace}
          onClose={() => setOpenViewModal(false)}
        />
      )}

      {openEditModal && (
        <EditSpaceModal
          space={selectedSpace}
          onClose={() => setOpenEditModal(false)}
          onSuccess={() => fetchSpaces()}
        />
      )}
    </DashboardLayout>
  )
}

function formatCategory(category) {
  if (category === 'AULA') return 'Aula'
  if (category === 'LABORATORIO') return 'Laboratorio'
  if (category === 'AUDITORIO') return 'Auditorio'
  return 'Sala'
}

function formatAvailability(value) {
  if (value === 'DISPONIBLE') return 'Disponible'
  if (value === 'OCUPADO') return 'Ocupado'
  return 'Mantenimiento'
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

const availabilityStyle = (availability) => {
  if (availability === 'DISPONIBLE') {
    return {
      background: '#dcfce7',
      color: '#15803d',
      padding: '5px 11px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      display: 'inline-block',
    }
  }

  if (availability === 'OCUPADO') {
    return {
      background: '#fef3c7',
      color: '#d97706',
      padding: '5px 11px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      display: 'inline-block',
    }
  }

  return {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '5px 11px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    display: 'inline-block',
  }
}

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

export default SpacesPage