function StatusBadge({ status }) {
    const getStyles = () => {
      switch (status) {
        case 'APPROVED':
          return { background: '#C8E6C9', color: '#01402E' }
        case 'REJECTED':
          return { background: '#FFE0E0', color: '#8B0000' }
        default:
          return { background: '#FFE5CC', color: '#8B4500' }
      }
    }
  
    const styles = getStyles()
  
    return (
      <span
        style={{
          padding: '0.35rem 0.7rem',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: '700',
          ...styles,
        }}
      >
        {status}
      </span>
    )
  }
  
  export default StatusBadge