import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Authorize Stratos',
  description: 'Authorize a connected application to access Stratos.',
  path: '/oauth/consent',
  index: false,
});

export default function ConsentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
