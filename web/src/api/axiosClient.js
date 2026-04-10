import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor: agrega el token JWT a cada request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor: si el backend responde 401, redirigir al login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = error?.config?.url || ''
      const isAuthEndpoint = url.includes('/api/auth/')
      const isAuthPage = typeof window !== 'undefined'
        && ['/login', '/forgot-password', '/verify-otp', '/reset-password'].includes(window.location.pathname)

      // Si es un 401 por credenciales/flujo de auth, NO forzar redirect aquí.
      // Dejamos que la pantalla muestre el mensaje correspondiente.
      if (!isAuthEndpoint && !isAuthPage) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // replace evita que "atrás" regrese a una ruta protegida cacheada
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient