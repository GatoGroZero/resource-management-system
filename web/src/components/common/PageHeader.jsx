function PageHeader({ title, subtitle }) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem', color: '#022859' }}>
          {title}
        </h1>
        {subtitle && <p style={{ color: '#8A9BB8' }}>{subtitle}</p>}
      </div>
    )
  }
  
  export default PageHeader