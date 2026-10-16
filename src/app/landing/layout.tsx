import type { Metadata } from 'next';
import { createPageMetadata, siteConfig } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Capacity-aware task planning for real life',
  description: siteConfig.description,
  path: '/landing',
});

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
    },
    {
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${siteConfig.url}/landing`,
      description: siteConfig.description,
    },
  ],
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
