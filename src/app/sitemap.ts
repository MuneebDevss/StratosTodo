import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl('/landing'), lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/docs'), lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/support'), lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/privacy'), lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
