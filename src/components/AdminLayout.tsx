'use client';

import { motion } from 'framer-motion';
import { Sparkles, FileText, LogOut, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { logoutAdmin } = useAdmin();
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    logoutAdmin();
    await logout();
    router.push('/');
  };

  const sidebarItems = [
    {
      label: 'Blogs',
      href: '/admin/blogs',
      icon: FileText,
      active: pathname === '/admin/blogs'
    },
    {
      label: 'Trips',
      href: '/admin/trips',
      icon: MapPin,
      active: pathname === '/admin/trips'
    }
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-purple-500/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-purple-500/20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <Sparkles className="relative w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <span className="text-2xl font-black text-white group-hover:text-purple-100 transition-colors">MEMORA</span>
          </Link>
          <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      item.active
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                        : 'text-gray-400 hover:text-white hover:bg-black/30'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-purple-500/20">
          <motion.button
            onClick={handleSignOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[150px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}