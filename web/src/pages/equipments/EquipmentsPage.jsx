import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import CreateEquipmentModal from './CreateEquipmentModal'
import ViewEquipmentModal from './ViewEquipmentModal'
import EditEquipmentModal from './EditEquipmentModal'
import HistoryEquipmentModal from './HistoryEquipmentModal'
import { getEquipmentById, getEquipments, toggleEquipmentStatus } from '../../api/equipmentApi'
import { showToast } from '../../utils/alertUtils'

function EquipmentsPage() {
  const [equipmentsPage, setEquipmentsPage] = useState(null)
  const [page, setPage] = useState(0)

  const [conditionFilter, setConditionFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [accessFilter, setAccessFilter] = useState('')

  const [backendFilter, setBackendFilter] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [historyEquipment, setHistoryEquipment] = useState(null)

  const fetchEquipments = async (customPage = page, customFilter = backendFilter) => {
    try {
      const data = await getEquipments({
        page: customPage,
        size: 10,
        filter: customFilter,
        search: '',
      })
      setEquipmentsPage(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  useEffect(() => {
    fetchEquipments(page, backendFilter)
  }, [page, backendFilter])

  const applyConditionFilter = (value) => {
    setPage(0)
    setConditionFilter(value)
    setCategoryFilter('')
    setAccessFilter('')

    if (value === 'DISPONIBLE') setBackendFilter('DISPONIBLE')
    else if (value === 'EN_USO') setBackendFilter('EN_USO')
    else if (value === 'MANTENIMIENTO') setBackendFilter('MANTENIMIENTO')
    else setBackendFilter('')
  }

  const applyCategoryFilter = (value) => {
    setPage(0)
    setConditionFilter('')
    setCategoryFilter(value)
    setAccessFilter('')

    if (value === 'AUDIOVISUAL') setBackendFilter('AUDIOVISUAL')
    else if (value === 'COMPUTO') setBackendFilter('COMPUTO')
    else if (value === 'LABORATORIO') setBackendFilter('LABORATORIO')
    else setBackendFilter('')
  }

  const applyAccessFilter = (value) => {
    setPage(0)
    setConditionFilter('')
    setCategoryFilter('')
    setAccessFilter(value)

    if (value === 'ALUMNOS') setBackendFilter('ALUMNOS')
    else if (value === 'RESTRINGIDO') setBackendFilter('RESTRINGIDO')
    else setBackendFilter('')
  }

  const clearFilters = () => {
    setPage(0)
    setConditionFilter('')
    setCategoryFilter('')
    setAccessFilter('')
    setBackendFilter('')
  }

  const handlePrev = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (equipmentsPage && !equipmentsPage.last) setPage(page + 1)
  }

  const handleView = async (id) => {
    try {
      const data = await getEquipmentById(id)
      setSelectedEquipment(data)
      setOpenViewModal(true)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleEdit = async (id) => {
    try {
      const data = await getEquipmentById(id)
      setSelectedEquipment(data)
      setOpenEditModal(true)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await toggleEquipmentStatus(id)
      showToast('success', 'Estado actualizado correctamente')
      fetchEquipments()
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  const handleHistory = async (id) => {
    try {
      const data = await getEquipmentById(id)
      setHistoryEquipment(data)
    } catch {
      showToast('error', 'Datos inválidos')
    }
  }

  return (
    <DashboardLayout>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Gestión de equipos</h1>
          <p style={subtitleStyle}>Control de equipos, materiales y recursos institucionales.</p>
        </div>

        <button type="button" onClick={() => setOpenCreateModal(true)} style={addButtonStyle}>
          + Registrar Nuevo Equipo
        </button>
      </div>

      <div style={filtersPanelStyle}>
        <div style={filtersGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>CONDICIÓN</label>
            <select value={conditionFilter} onChange={(e) => applyConditionFilter(e.target.value)} style={selectStyle}>
              <option value="">Todas las Condiciones</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="EN_USO">En uso</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>CATEGORÍA</label>
            <select value={categoryFilter} onChange={(e) => applyCategoryFilter(e.target.value)} style={selectStyle}>
              <option value="">Todas las Categorías</option>
              <option value="AUDIOVISUAL">Audiovisual</option>
              <option value="COMPUTO">Cómputo</option>
              <option value="LABORATORIO">Laboratorio</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>ACCESO</label>
            <select value={accessFilter} onChange={(e) => applyAccessFilter(e.target.value)} style={selectStyle}>
              <option value="">Cualquier Acceso</option>
              <option value="ALUMNOS">Permite alumnos</option>
              <option value="RESTRINGIDO">Restringido</option>
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
              <th style={thStyle}>NÚMERO DE INVENTARIO</th>
              <th style={thStyle}>NOMBRE</th>
              <th style={thStyle}>TIPO</th>
              <th style={thStyle}>ESPACIO</th>
              <th style={thStyle}>ACCESO</th>
              <th style={thStyle}>ESTADO</th>
              <th style={thStyle}>CONDICIÓN</th>
              <th style={thStyle}>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {equipmentsPage?.content?.map((equipment, index) => (
              <tr key={equipment.id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                <td style={tdCodeStyle}>{equipment.inventoryNumber}</td>
                <td style={tdNameStyle}>{equipment.name}</td>
                <td style={tdMutedStyle}>{equipment.category}</td>
                <td style={tdMutedStyle}>{equipment.spaceName || '—'}</td>
                <td style={tdMutedStyle}>{equipment.allowStudents ? 'Alumnos' : 'Restringido'}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(equipment.active)}>
                    {equipment.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={conditionBadgeStyle(equipment.condition)}>
                    {formatCondition(equipment.condition)}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={actionsIconsStyle}>
                    <button type="button" onClick={() => handleView(equipment.id)} style={viewButtonStyle} title="Ver detalle">👁</button>
                    <button type="button" onClick={() => handleEdit(equipment.id)} style={editButtonStyle} title="Editar">✏</button>
                    <button type="button" onClick={() => handleHistory(equipment.id)} style={historyButtonStyle} title="Historial">🕒</button>
                    <button type="button" onClick={() => handleToggleStatus(equipment.id)} style={toggleButtonStyle(equipment.active)} title={equipment.active ? 'Desactivar' : 'Activar'}>⏻</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={footerRowStyle}>
          <span style={pageTextStyle}>
            Página {equipmentsPage ? equipmentsPage.number + 1 : 1} de {equipmentsPage ? Math.max(equipmentsPage.totalPages, 1) : 1}
          </span>

          <div style={pagerButtonsStyle}>
            <button type="button" onClick={handlePrev} disabled={page === 0} style={pagerButtonStyle(page === 0)}>‹</button>
            <button type="button" onClick={handleNext} disabled={equipmentsPage?.last} style={pagerButtonStyle(Boolean(equipmentsPage?.last))}>›</button>
          </div>
        </div>
      </div>

      {openCreateModal && (
        <CreateEquipmentModal
          onClose={() => setOpenCreateModal(false)}
          onSuccess={() => fetchEquipments()}
        />
      )}

      {openViewModal && (
        <ViewEquipmentModal
          equipment={selectedEquipment}
          onClose={() => setOpenViewModal(false)}
        />
      )}

      {openEditModal && (
        <EditEquipmentModal
          equipment={selectedEquipment}
          onClose={() => setOpenEditModal(false)}
          onSuccess={() => fetchEquipments()}
        />
      )}

      {historyEquipment && (
        <HistoryEquipmentModal
          equipment={historyEquipment}
          onClose={() => setHistoryEquipment(null)}
        />
      )}
    </DashboardLayout>
  )
}

function formatCondition(value) {
  if (value === 'DISPONIBLE') return 'Disponible'
  if (value === 'EN_USO') return 'En uso'
  return 'Mantenimiento'
}

const headerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }
const titleStyle = { fontSize: '22px', fontWeight: 800, color: '#0b2f63', marginBottom: '6px' }
const subtitleStyle = { color: '#64748b', fontSize: '14px' }
const addButtonStyle = { border: 'none', background: '#00843D', color: '#ffffff', padding: '12px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }
const filtersPanelStyle = { background: '#ffffff', border: '1px solid #dfe6ee', borderRadius: '16px', padding: '14px', marginBottom: '18px', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }
const filtersGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px' }
const labelStyle = { fontSize: '12px', fontWeight: 800, color: '#94a3b8' }
const selectStyle = { border: '1px solid #d7dde5', background: '#ffffff', borderRadius: '12px', padding: '12px 14px', outline: 'none', color: '#334155', fontSize: '14px' }
const clearWrapStyle = { display: 'flex', alignItems: 'end' }
const refreshButtonStyle = { width: '44px', height: '44px', border: '1px solid #d7dde5', background: '#ffffff', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }
const tableCardStyle = { background: '#ffffff', border: '1px solid #dfe6ee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }
const tableStyle = { width: '100%', borderCollapse: 'collapse' }
const thStyle = { textAlign: 'left', padding: '16px 18px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', color: '#64748b', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase' }
const rowEvenStyle = { background: '#ffffff' }
const rowOddStyle = { background: '#fcfdff' }
const tdStyle = { padding: '16px 18px', borderBottom: '1px solid #eef2f7', fontSize: '14px', verticalAlign: 'middle' }
const tdNameStyle = { ...tdStyle, color: '#0b2f63', fontWeight: 700 }
const tdCodeStyle = { ...tdStyle, color: '#1e293b', fontWeight: 700 }
const tdMutedStyle = { ...tdStyle, color: '#64748b' }
const statusStyle = (active) => ({ background: active ? '#dcfce7' : '#fee2e2', color: active ? '#15803d' : '#dc2626', padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' })
const conditionBadgeStyle = (condition) => {
  if (condition === 'DISPONIBLE') return { background: '#dcfce7', color: '#15803d', padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }
  if (condition === 'EN_USO') return { background: '#dbeafe', color: '#2563eb', padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }
  return { background: '#fee2e2', color: '#ea580c', padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }
}
const actionsIconsStyle = { display: 'flex', gap: '8px', alignItems: 'center' }
const baseIconButtonStyle = { width: '34px', height: '34px', borderRadius: '10px', border: '1px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }
const viewButtonStyle = { ...baseIconButtonStyle, background: '#eef6ff', color: '#2563eb', borderColor: '#bfdbfe' }
const editButtonStyle = { ...baseIconButtonStyle, background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }
const historyButtonStyle = { ...baseIconButtonStyle, background: '#eff6ff', color: '#3b82f6', borderColor: '#bfdbfe' }
const toggleButtonStyle = (active) => ({ ...baseIconButtonStyle, background: active ? '#fef2f2' : '#ecfdf3', color: active ? '#dc2626' : '#16a34a', borderColor: active ? '#fecaca' : '#bbf7d0' })
const footerRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: '#ffffff' }
const pageTextStyle = { color: '#64748b', fontSize: '14px', fontWeight: 500 }
const pagerButtonsStyle = { display: 'flex', gap: '8px' }
const pagerButtonStyle = (disabled) => ({ width: '36px', height: '36px', border: '1px solid #e5e7eb', background: disabled ? '#f8fafc' : '#ffffff', borderRadius: '10px', color: disabled ? '#cbd5e1' : '#475569', cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 700 })

export default EquipmentsPage