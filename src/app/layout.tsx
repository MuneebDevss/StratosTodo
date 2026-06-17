import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers"; // 👈 Import your providers wrapper
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
  title: "StratosToDo",
  description: "Advanced dynamic task management engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children} {/* 👈 Everything inside children can now use useQuery() and useMutation() */}
        </Providers>
      </body>
    </html>
  );
}