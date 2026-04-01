import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getDashboardStats } from '../../api/dashboardApi'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const userRaw = localStorage.getItem('user')
  let user = null
  try {
    user = JSON.parse(userRaw)
  } catch {
    /* ignore */
  }

  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) {
      getDashboardStats()
        .then((data) => setStats(data))
        .catch(() => setStats(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <DashboardLayout>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          Bienvenido, {user?.name || 'Usuario'}
        </h1>
        <p style={subtitleStyle}>
          {isAdmin
            ? 'Aquí tienes el resumen del sistema de recursos.'
            : 'Aquí puedes gestionar tus solicitudes de recursos.'}
        </p>
      </div>

      {isAdmin && !loading && stats && (
        <>
          {/* Stats principales */}
          <div style={statsGridStyle}>
            <StatCard label="Usuarios Activos" value={stats.activeUsers} total={stats.totalUsers} color="#00843D" bg="#ecfdf5" />
            <StatCard label="Espacios" value={stats.totalSpaces} color="#2563eb" bg="#eff6ff" />
            <StatCard label="Equipos" value={stats.totalEquipments} color="#7c3aed" bg="#f5f3ff" />
            <StatCard label="Reservas Pendientes" value={stats.pendingReservations} total={stats.totalReservations} color="#d97706" bg="#fffbeb" />
          </div>

          {/* Cards secundarios */}
          <div style={secondaryGridStyle}>
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Reservaciones</h3>
              <div style={cardStatsStyle}>
                <StatRow label="Pendientes" value={stats.pendingReservations} color="#d97706" />
                <StatRow label="Aprobadas" value={stats.approvedReservations} color="#15803d" />
                <StatRow label="Rechazadas" value={stats.rejectedReservations} color="#dc2626" />
                <StatRow label="Total" value={stats.totalReservations} color="#334155" />
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Solicitudes</h3>
              <div style={cardStatsStyle}>
                <StatRow label="Pendientes" value={stats.pendingRequests} color="#d97706" />
                <StatRow label="Total" value={stats.totalRequests} color="#334155" />
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Recursos</h3>
              <div style={cardStatsStyle}>
                <StatRow label="Espacios registrados" value={stats.totalSpaces} color="#2563eb" />
                <StatRow label="Equipos registrados" value={stats.totalEquipments} color="#7c3aed" />
                <StatRow label="Usuarios totales" value={stats.totalUsers} color="#334155" />
              </div>
            </div>
          </div>
        </>
      )}

      {isAdmin && loading && (
        <p style={loadingStyle}>Cargando estadísticas...</p>
      )}

      {!isAdmin && (
        <div style={userWelcomeStyle}>
          <div style={welcomeCardStyle}>
            <span style={welcomeIconStyle}>📩</span>
            <h2 style={welcomeCardTitle}>Nueva Solicitud</h2>
            <p style={welcomeCardText}>Solicita un espacio o equipo para tus actividades.</p>
            <a href="/new-request" style={welcomeLinkStyle}>Crear solicitud →</a>
          </div>
          <div style={welcomeCardStyle}>
            <span style={welcomeIconStyle}>📋</span>
            <h2 style={welcomeCardTitle}>Mis Solicitudes</h2>
            <p style={welcomeCardText}>Revisa el estado de tus solicitudes anteriores.</p>
            <a href="/requests" style={welcomeLinkStyle}>Ver solicitudes →</a>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function StatCard({ label, value, total, color, bg }) {
  return (
    <div style={{ ...statCardStyle, background: bg }}>
      <p style={statCardLabelStyle}>{label}</p>
      <div style={statCardValueRowStyle}>
        <span style={{ ...statCardValueStyle, color }}>{value}</span>
        {total !== undefined && (
          <span style={statCardTotalStyle}>/ {total}</span>
        )}
      </div>
    </div>
  )
}

function StatRow({ label, value, color }) {
  return (
    <div style={statRowStyle}>
      <span style={statRowLabelStyle}>{label}</span>
      <span style={{ ...statRowValueStyle, color }}>{value}</span>
    </div>
  )
}

const headerStyle = { marginBottom: '24px' }
const titleStyle = { fontSize: '22px', fontWeight: 800, color: '#0b2f63', marginBottom: '6px' }
const subtitleStyle = { color: '#64748b', fontSize: '14px' }
const loadingStyle = { color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '40px 0' }

const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }
const statCardStyle = { padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb' }
const statCardLabelStyle = { fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }
const statCardValueRowStyle = { display: 'flex', alignItems: 'baseline', gap: '4px' }
const statCardValueStyle = { fontSize: '28px', fontWeight: 800 }
const statCardTotalStyle = { fontSize: '14px', color: '#94a3b8', fontWeight: 600 }

const secondaryGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }
const cardStyle = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
const cardTitleStyle = { fontSize: '16px', fontWeight: 700, color: '#0b2f63', marginBottom: '16px' }
const cardStatsStyle = { display: 'flex', flexDirection: 'column', gap: '12px' }
const statRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const statRowLabelStyle = { fontSize: '14px', color: '#64748b' }
const statRowValueStyle = { fontSize: '16px', fontWeight: 700 }

const userWelcomeStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '12px' }
const welcomeCardStyle = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
const welcomeIconStyle = { fontSize: '28px', display: 'block', marginBottom: '12px' }
const welcomeCardTitle = { fontSize: '17px', fontWeight: 700, color: '#0b2f63', marginBottom: '8px' }
const welcomeCardText = { fontSize: '14px', color: '#64748b', marginBottom: '16px' }
const welcomeLinkStyle = { fontSize: '14px', fontWeight: 700, color: '#00843D', textDecoration: 'none' }

export default DashboardPage