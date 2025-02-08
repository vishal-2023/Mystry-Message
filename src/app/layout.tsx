'use client';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import AuthProvider from './context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/custom/Navbar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This will set `isClient` to true once the component is mounted on the client side
  }, []);

  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {isClient && !window?.location?.pathname?.includes('u') && <Navbar />}
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
