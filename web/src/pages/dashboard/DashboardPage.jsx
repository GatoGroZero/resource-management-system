import DashboardLayout from '../../components/layout/DashboardLayout'
import PageHeader from '../../components/common/PageHeader'
import InfoCard from '../../components/common/InfoCard'
import AppCard from '../../components/common/AppCard'
import { useAuth } from '../../context/AuthContext'

function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general del sistema"
      />

      <div style={statsGrid}>
        <InfoCard
          title="Usuario activo"
          value={`${user?.name || ''} ${user?.lastName || ''}`.trim() || '—'}
          subtitle="Cuenta autenticada actualmente"
        />

        <InfoCard
          title="Correo"
          value={user?.email || '—'}
          subtitle="Identificador principal del usuario"
        />

        <InfoCard
          title="Rol"
          value={user?.role || '—'}
          subtitle={isAdmin ? 'Acceso de administración' : 'Acceso de solicitante'}
        />
      </div>

      <div style={contentGrid}>
        <AppCard style={{ minHeight: '220px' }}>
          <h3 style={sectionTitle}>Resumen del módulo</h3>
          <p style={paragraph}>
            Desde aquí podrás navegar entre solicitudes, espacios, equipos, historial y perfil.
            La información se irá poblando conforme completemos cada módulo y su integración.
          </p>

          <div style={miniGrid}>
            <div style={miniBox}>
              <span style={miniLabel}>Estado</span>
              <strong style={miniValue}>Operativo</strong>
            </div>

            <div style={miniBox}>
              <span style={miniLabel}>Acceso</span>
              <strong style={miniValue}>{isAdmin ? 'Administrador' : 'Solicitante'}</strong>
            </div>
          </div>
        </AppCard>

        <AppCard style={{ minHeight: '220px' }}>
          <h3 style={sectionTitle}>Próximos ajustes</h3>
          <ul style={listStyle}>
            <li>Conectar más vistas al backend real</li>
            <li>Replicar layout exacto del Figma</li>
            <li>Completar gestión de espacios y equipos</li>
            <li>Activar notificaciones por correo real</li>
          </ul>
        </AppCard>
      </div>
    </DashboardLayout>
  )
}

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1rem',
  marginBottom: '1.25rem',
}

const contentGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1rem',
}

const sectionTitle = {
  color: '#022859',
  fontSize: '1.1rem',
  marginBottom: '0.85rem',
}

const paragraph = {
  color: '#6B7280',
  lineHeight: '1.65',
  marginBottom: '1rem',
}

const miniGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))',
  gap: '0.75rem',
}

const miniBox = {
  background: '#F8FAFC',
  border: '1px solid #E5E7EB',
  borderRadius: '14px',
  padding: '0.9rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
}

const miniLabel = {
  color: '#8A9BB8',
  fontSize: '0.85rem',
}

const miniValue = {
  color: '#01402E',
  fontSize: '1rem',
}

const listStyle = {
  color: '#6B7280',
  lineHeight: '1.8',
  paddingLeft: '1.1rem',
}

export default DashboardPage