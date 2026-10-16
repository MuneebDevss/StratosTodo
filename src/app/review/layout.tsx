import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Review',
  description: 'Review private tasks that need attention in Stratos.',
  path: '/review',
  index: false,
});

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
