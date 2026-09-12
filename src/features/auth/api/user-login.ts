import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, setTokens } from '@/lib/api-client';
import { USER_QUERY_KEY } from './use-user';

export function useLogin() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        '/auth/login',
        credentials
      );

      // Store returned tokens in localStorage / cookie handler
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    },
    onSuccess: async () => {
      // Refresh current user data in the query cache
      await queryClient.refetchQueries({ queryKey: USER_QUERY_KEY });

      const returnTo = searchParams.get('returnTo');

      // Prevent open redirect vulnerabilities by ensuring returnTo is a relative path
      const isRelativeUrl = returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//');
      
      router.push(isRelativeUrl ? returnTo : '/dashboard');
    },
  });
}