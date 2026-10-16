import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers"; // 👈 Import your providers wrapper
import { AppLayout } from "@/Common/components/AppLayout";
import { siteConfig } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Stratos | Capacity-aware task planning",
    template: "%s | Stratos",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["task planner", "task management", "capacity planning", "Claude connector"],
  authors: [{ name: "Stratos" }],
  creator: "Stratos",
  publisher: "Stratos",
  alternates: { canonical: "/landing" },
  robots: { index: true, follow: true },
  verification: { google: siteConfig.verification },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Stratos | Capacity-aware task planning",
    description: siteConfig.description,
    url: "/landing",
    images: [{ url: siteConfig.socialImage, alt: "Stratos" }],
  },
  twitter: {
    card: "summary",
    title: "Stratos | Capacity-aware task planning",
    description: siteConfig.description,
    images: [siteConfig.socialImage],
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('stratostodo:theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
