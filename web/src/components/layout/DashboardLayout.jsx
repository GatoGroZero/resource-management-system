import Sidebar from './Sidebar'
import Topbar from './Topbar'

function DashboardLayout({ children }) {
  return (
    <div style={pageStyle}>
      <Sidebar />

      <div style={contentAreaStyle}>
        <Topbar />

        <main style={mainStyle}>
          {children}
        </main>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  background: '#f3f4f6',
}

const contentAreaStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
}

const mainStyle = {
  padding: '28px 36px',
}

export default DashboardLayout