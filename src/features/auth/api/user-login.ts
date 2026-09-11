import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient, setTokens } from '@/lib/api-client';
import { USER_QUERY_KEY } from './use-user';

export function useLogin() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        '/auth/login',
        credentials
      );
      
      // Store returned tokens in localStorage
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: USER_QUERY_KEY });
      
      const returnTo = searchParams.get('returnTo');
      if (returnTo) {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        const oauthBase = backendUrl?.replace(/\/api\/?$/, '');

        if (!oauthBase) {
          throw new Error('NEXT_PUBLIC_API_URL is required for OAuth redirects');
        }

        const oauthUrl = new URL(returnTo, `${oauthBase}/`);
        if (oauthUrl.origin !== new URL(oauthBase).origin) {
          throw new Error('Invalid OAuth return URL');
        }

        window.location.assign(oauthUrl.toString());
      } else {
        window.location.assign('/dashboard');
      }
    },
  });
}