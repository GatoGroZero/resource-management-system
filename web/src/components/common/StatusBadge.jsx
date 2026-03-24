function StatusBadge({ status }) {
    const getStyles = () => {
      switch (status) {
        case 'APPROVED':
          return { background: '#dcfce7', color: '#166534' }
        case 'REJECTED':
          return { background: '#fee2e2', color: '#991b1b' }
        default:
          return { background: '#fef3c7', color: '#92400e' }
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