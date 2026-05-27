import axios from 'axios'

// Función para buscar una cookie por su nombre
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Important for session authentication (CSRF tokens)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authentication token if available
api.interceptors.request.use(
  (config) => {
    // For future JWT implementation, check for token in localStorage
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const csrfToken = getCookie('csrftoken')
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url || ''

    if (
      status === 401 &&
      !requestUrl.includes('/accounts/login/') &&
      !requestUrl.includes('/accounts/register/')
    ) {
      // Unauthorized on protected API requests - clear auth and redirect to login
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  logout: () => api.post('/accounts/logout/'),
  getProfile: () => api.get('/accounts/profile/'),
}

// Pokemon endpoints
export const pokemonAPI = {
  search: (query) => api.get('/pokemon/search/', { params: { q: query } }),
}

// Teams endpoints
export const teamsAPI = {
  getAll: () => api.get('/teams/'),
  getDetail: (id) => api.get(`/teams/${id}/`),
  create: (data) => api.post('/teams/', data),
  update: (id, data) => api.put(`/teams/${id}/`, data),
  delete: (id) => api.delete(`/teams/${id}/`),
  analyze: (id) => api.get(`/teams/${id}/analyze/`),
  getStats: (id) => api.get(`/teams/${id}/stats/`),
  assignSlot: (teamId, position, data) => api.post(`/teams/${teamId}/slot/${position}/`, data),
  clearSlot: (teamId, position) => api.delete(`/teams/${teamId}/slot/${position}/`),
}

export default api