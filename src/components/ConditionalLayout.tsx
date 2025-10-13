'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isBookingPage = pathname.startsWith('/book/');
  const isAuthPage = pathname.startsWith('/auth/');
  const isAccountPage = pathname.startsWith('/account');

  if (isAdminPage || isBookingPage || isAuthPage || isAccountPage) {
    // Admin, booking, auth, and account pages: no header, render children directly (they have custom headers)
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