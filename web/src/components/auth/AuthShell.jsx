function AuthShell({ title, subtitle, children }) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card-single">
          <h2 className="auth-title">{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    )
  }
  
  export default AuthShell