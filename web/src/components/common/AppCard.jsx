function AppCard({ children, style = {} }) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 8px 24px rgba(2, 40, 89, 0.06)',
          padding: '1.25rem',
          ...style,
        }}
      >
        {children}
      </div>
    )
  }
  
  export default AppCard