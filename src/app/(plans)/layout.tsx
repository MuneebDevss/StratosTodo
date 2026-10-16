import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Plans',
  description: 'Manage your private Stratos plans and tasks.',
  path: '/plans',
  index: false,
});

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
