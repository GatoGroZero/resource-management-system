function AppInput({ label, error, ...props }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {label && <label style={{ fontWeight: '600' }}>{label}</label>}
        <input
          {...props}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            outline: 'none',
          }}
        />
        {error && (
          <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>
            {error}
          </span>
        )}
      </div>
    )
  }
  
  export default AppInput