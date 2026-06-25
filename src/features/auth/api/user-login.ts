import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { User, USER_QUERY_KEY } from './use-user';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      await apiClient.post('/auth/login', credentials);
    },
    onSuccess: () => {
      router.replace('/dashboard');
    },
  });
}