import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import CreateSpaceModal from './CreateSpaceModal'
import ViewSpaceModal from './ViewSpaceModal'
import EditSpaceModal from './EditSpaceModal'
import HistorySpaceModal from './HistorySpaceModal'
import { getSpaceById, getSpaces, toggleSpaceStatus } from '../../api/spaceApi'
import { showToast, showConfirm } from '../../utils/alertUtils'
function SpacesPage() {
  const [spacesPage, setSpacesPage] = useState(null)
  const [page, setPage] = useState(0)

  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')
  const [capacityFilter, setCapacityFilter] = useState('')

  const [backendFilter, setBackendFilter] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [historySpace, setHistorySpace] = useState(null)

  const fetchSpaces = async (customPage = page, customFilter = backendFilter) => {
    try {
      const data = await getSpaces({
        page: customPage,
        size: 10,
        filter: customFilter,
        search: '',
      })
      setSpacesPage(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  useEffect(() => {
    fetchSpaces(page, backendFilter)
  }, [page, backendFilter])

  const applyAvailabilityFilter = (value) => {
    setPage(0)
    setAvailabilityFilter(value)
    setAccessFilter('')
    setCapacityFilter('')

    if (value === 'DISPONIBLE') setBackendFilter('DISPONIBLE')
    else if (value === 'OCUPADO') setBackendFilter('OCUPADO')
    else if (value === 'MANTENIMIENTO') setBackendFilter('MANTENIMIENTO')
    else setBackendFilter('')
  }

  const applyAccessFilter = (value) => {
    setPage(0)
    setAvailabilityFilter('')
    setAccessFilter(value)
    setCapacityFilter('')
    setBackendFilter('')
  }

  const applyCapacityFilter = (value) => {
    setPage(0)
    setAvailabilityFilter('')
    setAccessFilter('')
    setCapacityFilter(value)

    if (value === 'PEQUENA') setBackendFilter('CAP_SMALL')
    else if (value === 'MEDIANA') setBackendFilter('CAP_MEDIUM')
    else if (value === 'GRANDE') setBackendFilter('CAP_LARGE')
    else setBackendFilter('')
  }

  const clearFilters = () => {
    setPage(0)
    setAvailabilityFilter('')
    setAccessFilter('')
    setCapacityFilter('')
    setBackendFilter('')
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
    const confirmed = await showConfirm(
      '¿Cambiar estado del espacio?',
      'Esta acción activará o desactivará el espacio. ¿Deseas continuar?',
      'Sí, cambiar estado'
    )
    if (!confirmed) return

    try {
      await toggleSpaceStatus(id)
      showToast('success', 'Estado actualizado correctamente')
      fetchSpaces()
    } catch (error) {
      showToast('error', error?.response?.data?.message || 'Error al actualizar estado')
    }
  }
  const handleHistory = async (id) => {
    try {
      const data = await getSpaceById(id)
      setHistorySpace(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div style={titleWrapStyle}>
          <button type="button" style={backIconStyle}>←</button>

          <div>
            <h1 style={titleStyle}>Gestión de Espacios</h1>
            <p style={subtitleStyle}>Control de aulas, laboratorios y áreas comunes institucionales.</p>
          </div>
        </div>

        <button type="button" onClick={() => setOpenCreateModal(true)} style={addButtonStyle}>
          + Registrar Nuevo Espacio
        </button>
      </div>

      <div style={filtersPanelStyle}>
        <div style={filtersGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>DISPONIBILIDAD</label>
            <select
              value={availabilityFilter}
              onChange={(e) => applyAvailabilityFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Todos los Estatus</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="OCUPADO">Ocupado</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>ACCESO</label>
            <select
              value={accessFilter}
              onChange={(e) => applyAccessFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Cualquier Acceso</option>
              <option value="ALUMNOS">Permite alumnos</option>
              <option value="RESTRINGIDO">Restringido</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>CAPACIDAD</label>
            <select
              value={capacityFilter}
              onChange={(e) => applyCapacityFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Todas las Capacidades</option>
              <option value="PEQUENA">1 - 30</option>
              <option value="MEDIANA">31 - 100</option>
              <option value="GRANDE">101+</option>
            </select>
          </div>

          <div style={clearWrapStyle}>
            <button type="button" onClick={clearFilters} style={refreshButtonStyle}>
              ↺
            </button>
          </div>
        </div>
      </div>

      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>NOMBRE</th>
              <th style={thStyle}>CATEGORÍA</th>
              <th style={thStyle}>UBICACIÓN</th>
              <th style={thStyle}>CAPACIDAD</th>
              <th style={thStyle}>ESTADO</th>
              <th style={thStyle}>DISPONIBILIDAD</th>
              <th style={thStyle}>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {spacesPage?.content?.map((space, index) => (
              <tr key={space.id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdNameStyle}>{space.name}</td>
                <td style={tdMutedStyle}>{formatCategory(space.category)}</td>
                <td style={tdMutedStyle}>{space.location}</td>
                <td style={tdCodeStyle}>{space.capacity}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(space.active)}>
                    {space.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={availabilityBadgeStyle(space.availability)}>
                    {formatAvailability(space.availability)}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={actionsIconsStyle}>
                    <button type="button" onClick={() => handleView(space.id)} style={viewButtonStyle} title="Ver detalle">👁</button>
                    <button type="button" onClick={() => handleEdit(space.id)} style={editButtonStyle} title="Editar">✏</button>
                    <button type="button" onClick={() => handleHistory(space.id)} style={historyButtonStyle} title="Historial">🕒</button>
                    <button type="button" onClick={() => handleToggleStatus(space.id)} style={toggleButtonStyle(space.active)} title={space.active ? 'Desactivar' : 'Activar'}>⏻</button>
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

      {historySpace && (
        <HistorySpaceModal
          space={historySpace}
          onClose={() => setHistorySpace(null)}
        />
      )}
    </DashboardLayout>
  )
}

function formatCategory(category) {
  if (category === 'AULA') return 'Aula'
  if (category === 'LABORATORIO') return 'Laboratorio'
  if (category === 'AUDITORIO') return 'Auditorio'
  return 'Sala de Juntas'
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

const titleWrapStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
}

const backIconStyle = {
  border: 'none',
  background: 'transparent',
  color: '#94a3b8',
  fontSize: '20px',
  cursor: 'pointer',
  marginTop: '2px',
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

const refreshButtonStyle = {
  width: '44px',
  height: '44px',
  border: '1px solid #d7dde5',
  background: '#ffffff',
  color: '#64748b',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 700,
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

const tdNameStyle = {
  ...tdStyle,
  color: '#0b2f63',
  fontWeight: 700,
}

const tdCodeStyle = {
  ...tdStyle,
  color: '#1e293b',
  fontWeight: 700,
}

const tdMutedStyle = {
  ...tdStyle,
  color: '#64748b',
}

const statusStyle = (active) => ({
  background: active ? '#dcfce7' : '#fee2e2',
  color: active ? '#15803d' : '#dc2626',
  padding: '5px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 700,
  display: 'inline-block',
})

const availabilityBadgeStyle = (availability) => {
  if (availability === 'DISPONIBLE') {
    return {
      background: '#dcfce7',
      color: '#15803d',
      padding: '5px 10px',
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
      padding: '5px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      display: 'inline-block',
    }
  }

  return {
    background: '#fee2e2',
    color: '#ea580c',
    padding: '5px 10px',
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

const historyButtonStyle = {
  ...baseIconButtonStyle,
  background: '#eff6ff',
  color: '#3b82f6',
  borderColor: '#bfdbfe',
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