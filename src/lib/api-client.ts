import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Helper utilities for local token management
export const getAccessToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

export const getRefreshToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Request Interceptor: Attach bearer token automatically
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

const PUBLIC_ROUTES = ['/', '/landing', '/login', '/register', '/docs', '/support', '/review', '/privacy'];

let queue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: RetryConfig;
}> = [];

function processQueue(error?: unknown) {
  queue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(apiClient(config));
    }
  });

  queue = [];
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as RetryConfig;

    if (!original || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Refresh route failed -> user must log in again
    if (original.url?.includes('/auth/refresh')) {
      clearTokens();
      const isPublic = typeof window !== 'undefined' && PUBLIC_ROUTES.includes(window.location.pathname);
      if (!isPublic && typeof window !== 'undefined') {
        window.location.replace('/login');
      }
      return Promise.reject(error);
    }

    if (original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject, config: original });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh route using dedicated axios instance without interceptors
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      setTokens(data.accessToken, data.refreshToken);

      if (original.headers) {
        original.headers.Authorization = `Bearer ${data.accessToken}`;
      }

      processQueue();
      return apiClient(original);
    } catch (refreshError) {
      clearTokens();
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);