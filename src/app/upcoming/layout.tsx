import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Upcoming tasks',
  description: 'View your private upcoming Stratos tasks and schedule.',
  path: '/upcoming',
  index: false,
});

export default function UpcomingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
