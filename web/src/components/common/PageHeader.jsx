function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '0.35rem',
          color: '#022859',
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            color: '#8A9BB8',
            fontSize: '1rem',
            lineHeight: '1.6',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default PageHeader