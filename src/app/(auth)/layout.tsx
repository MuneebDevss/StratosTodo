import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Sign in or create an account',
  description: 'Access your Stratos workspace or create a new account.',
  path: '/login',
  index: false,
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
