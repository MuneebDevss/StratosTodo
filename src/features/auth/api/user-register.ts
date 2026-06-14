import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { USER_QUERY_KEY } from './use-user';

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (registrationData: Record<string, string>) => {
      const { data } = await apiClient.post('/auth/register', registrationData);
      return data;
    },
    onSuccess: (data ) => {
      queryClient.setQueryData(USER_QUERY_KEY, data.user || data);
      router.push('/dashboard');
    },
  });
}