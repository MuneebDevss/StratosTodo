import { useMutation, useQueryClient } from '@tanstack/react-query';
import {  useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { USER_QUERY_KEY } from './use-user';

export function useLogin() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams(); // next/navigation

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      await apiClient.post('/auth/login', credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      const returnTo = searchParams.get('returnTo');
      if (returnTo) {
        // returnTo was encodeURIComponent(req.url) on the backend — decode once
        const backendUrl = process.env.NEXT_PUBLIC_API_URL; // e.g. https://reflection-backend-rq55.onrender.com/api
        const oauthBase = backendUrl.replace(/\/api\/?$/, '');

        window.location.href = `${oauthBase}${decodeURIComponent(returnTo)}`;
      } else {
        window.location.href = '/dashboard';
      }
    },
  });
}