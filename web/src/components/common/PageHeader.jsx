function PageHeader({ title, subtitle }) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{title}</h1>
        {subtitle && <p style={{ color: '#6b7280' }}>{subtitle}</p>}
      </div>
    )
  }
  
  export default PageHeader