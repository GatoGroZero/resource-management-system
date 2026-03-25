function AppInput({ label, error, ...props }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {label && <label style={{ fontWeight: '600', color: '#022859' }}>{label}</label>}
        <input
          {...props}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
            outline: 'none',
            background: '#F5F5F5',
            color: '#022859',
          }}
        />
        {error && (
          <span style={{ color: '#8B0000', fontSize: '0.85rem' }}>
            {error}
          </span>
        )}
      </div>
    )
  }
  
  export default AppInput