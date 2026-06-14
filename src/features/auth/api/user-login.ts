import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { User, USER_QUERY_KEY } from './use-user';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data : { user?: User }) => {
    if (!data || typeof data !== 'object') {
      console.warn('Login response is not an object:', data);
      return;
    }
      // 1. Manually prime or invalidate the user cache instantly
      queryClient.setQueryData(USER_QUERY_KEY, data.user || data);
      
      // 2. Perform clean client-side routing change
      router.push('/dashboard');
    },
  });
}