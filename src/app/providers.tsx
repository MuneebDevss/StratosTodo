'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from '@/features/auth/api/use-user';
import { ThemeProvider } from '@/features/settings/hooks/use-theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Creating the QueryClient inside a useState hook guarantees that 
  // data doesn't leak between different user requests if server-side rendering occurs
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes standard freshness
        refetchOnWindowFocus: true,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </UserProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}