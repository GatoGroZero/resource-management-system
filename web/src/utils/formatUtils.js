export function formatRole(role) {
    if (role === 'ADMIN') return 'Administrador'
    if (role === 'STAFF') return 'Personal UTEZ'
    if (role === 'STUDENT') return 'Estudiante'
    return role
  }