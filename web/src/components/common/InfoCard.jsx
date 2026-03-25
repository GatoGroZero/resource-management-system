import AppCard from './AppCard'

function InfoCard({ title, value, subtitle }) {
  return (
    <AppCard>
      <p style={{ color: '#8A9BB8', fontSize: '0.92rem', marginBottom: '0.5rem' }}>
        {title}
      </p>

      <h3 style={{ color: '#022859', fontSize: '1.2rem', marginBottom: subtitle ? '0.45rem' : 0 }}>
        {value}
      </h3>

      {subtitle && (
        <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {subtitle}
        </p>
      )}
    </AppCard>
  )
}

export default InfoCard