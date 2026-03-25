import Sidebar from './Sidebar'
import Topbar from './Topbar'

function DashboardLayout({ children }) {
  return (
    <div style={layoutStyle}>
      <Sidebar />

      <div style={contentWrapper}>
        <Topbar />

        <main style={mainStyle}>
          {children}
        </main>
      </div>
    </div>
  )
}

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: '#F4F6F9',
}

const contentWrapper = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

const mainStyle = {
  padding: '1.5rem 2rem',
}

export default DashboardLayout