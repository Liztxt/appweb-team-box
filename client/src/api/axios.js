import axios from 'axios'

let activeRequests = 0
const listeners = new Set()

export const subscribeToLoading = (fn) => listeners.add(fn)
export const unsubscribeFromLoading = (fn) => listeners.delete(fn)

const notify = () => listeners.forEach(fn => fn(activeRequests > 0))

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  activeRequests++
  notify()
  return config
})

api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1)
    notify()
    return response
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1)
    notify()
    return Promise.reject(error)
  }
)

export default api