'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/features/tasks/components/Sidebar';
import { useTheme } from '@/features/settings/hooks/use-theme';
import { PAGE_THEME } from '@/Common/Constants/ThemeConstants';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Public pages that do not get the application layout shell
  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname == '/landing' || pathname === '/docs' || pathname === '/support' || pathname === '/privacy' || pathname === '/support' || pathname === '/privacy' || pathname === '/docs' ;

  if (isPublicRoute) {
    return <>{children}</>;
  }

  const t = PAGE_THEME[theme];

  return (
    <div className={`flex min-h-screen ${t.bg} ${t.heading} transition-colors duration-150`}>
      <Sidebar />
      <main className="flex-1 min-w-0 relative">
        {children}
      </main>
    </div>
  );
}
