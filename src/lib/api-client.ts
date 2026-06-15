// src/lib/api-client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends httpOnly cookies automatically
})

// Track if a refresh is already in flight to avoid parallel refresh calls
let isRefreshing = false
let queue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  config: InternalAxiosRequestConfig
}> = []

function processQueue(error: unknown) {
  queue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error)
    } else {
      resolve(apiClient(config))
    }
  })
  queue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Only handle 401s, and never retry the refresh call itself
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject, config: original })
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      await apiClient.post('/auth/refresh')
      // Refresh succeeded — drain the queue and retry the original
      processQueue(null)
      return apiClient(original)
    } catch (refreshError) {
      // Refresh failed — clear queue and send everyone to login
      processQueue(refreshError)
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)