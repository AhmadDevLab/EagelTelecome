import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
})

export function authHeaders() {
  const token = localStorage.getItem('eagle_admin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default api
