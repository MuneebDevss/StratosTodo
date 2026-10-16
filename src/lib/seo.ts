import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Stratos',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stratos-todo.vercel.app',
  description:
    'Stratos is a capacity-aware task planner that turns big goals into realistic schedules and keeps them balanced when plans change.',
  verification: '4v4tL2p42n_Z5ZgMSDZ-2vvkVqCMDF4dg3d3c2PWfo0',
  socialImage: '/icon.png',
};

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: 'website',
      images: [{ url: siteConfig.socialImage, alt: 'Stratos' }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [siteConfig.socialImage],
    },
  };
}
