'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserBookingsPage from '@/components/UserBookingsPage';

export default function EventBookingsPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your event bookings.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Calendar className="w-4 h-4" />
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Navigation */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-purple-500/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm sm:text-base">Back to Account</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/events"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Browse Events</span>
                <span className="sm:hidden">Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <UserBookingsPage />
    </div>
  );
}
