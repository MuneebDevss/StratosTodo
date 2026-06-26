import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import React, { createContext, useContext, useMemo } from 'react';

export interface User {
  id: string;
  email: string;
  dailyCapacityMinutes: number;
  timezone: string;
  theme?: 'light' | 'dark';
}

export const USER_QUERY_KEY = ['users', 'me'] as const;

export function useUserQuery() {
  return useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/users/me');
        return data;
      } catch (_error: unknown) {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export interface UserContextType {
  data: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<any>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useUserQuery();

  const value = useMemo<UserContextType>(() => ({
    data,
    isLoading,
    isAuthenticated: !!data,
    refetch: async () => {
      const res = await refetch();
      return res.data;
    },
  }), [data, isLoading, refetch]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      const { data } = await apiClient.put('/users/me', updatedData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(USER_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: (_) => {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    }
  });
}