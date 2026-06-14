import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  email: string;
  dailyCapacityMinutes: number;
  timezone: string;
}

export const USER_QUERY_KEY = ['users', 'me'] as const;

export function useUser() {
  return useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/users/me');
        return data;
      } catch (error) {
        // If 401 Unauthorized, return null safely instead of breaking the app
        return null;
      }
    },
    retry: false, // Don't spam the server on auth failures
    staleTime: 1000 * 60 * 5, // Consider session fresh for 5 minutes
  });
}