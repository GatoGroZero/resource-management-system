function AppButton({ children, type = 'button', onClick, disabled = false, style = {} }) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: '0.9rem 1rem',
          border: 'none',
          borderRadius: '10px',
          background: disabled ? '#B0D8B0' : '#01402E',
          color: '#FFFFFF',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: '700',
          ...style,
        }}
      >
        {children}
      </button>
    )
  }
  
  export default AppButton