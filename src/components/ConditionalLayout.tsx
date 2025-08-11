'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    // Admin pages: no header, render children directly
    return <>{children}</>;
  }

  // Regular pages: include header and main wrapper
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}