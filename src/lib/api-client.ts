// src/lib/api-client.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

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
      resolve(apiClient(config));
    }
  });

  queue = [];
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as RetryConfig;

    // Ignore requests without a config
    if (!original) {
      return Promise.reject(error);
    }

    // Only handle 401 responses
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Never attempt to refresh the refresh endpoint itself
    if (original.url?.includes('/auth/refresh')) {
      // Refresh itself failed → user is definitely logged out
      window.location.replace('/login');
      return Promise.reject(error);
    }

    // Prevent infinite retry loops
    if (original._retry) {
      return Promise.reject(error);
    }

    // Queue concurrent requests while refresh is in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve,
          reject,
          config: original,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // Refresh the access token/cookie
      await apiClient.post('/auth/refresh');

      // Retry queued requests
      processQueue();

      // Retry the original request
      return apiClient(original);
    } catch (refreshError) {
      // Reject everything waiting
      processQueue(refreshError);

      // IMPORTANT:
      // Do NOT redirect here.
      // Let React Query / useUser() handle the unauthenticated state.
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);