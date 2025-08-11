'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Settings, 
  LogOut, 
  Sparkles,
  Plane,
  Users,
  CreditCard
} from 'lucide-react';

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50"></div>
                  <Sparkles className="relative w-8 h-8 text-purple-400" />
                </div>
                <span className="text-2xl font-black text-white">MEMORA</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 hover:border-red-500/50 transition-all"
              >
                <LogOut size={16} />
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl font-black text-white mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Welcome back, {user.name}!
              </motion.h1>
              <motion.p 
                className="text-gray-400 text-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your Cyprus adventure awaits
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-purple-400" />
                    Profile Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg">
                      <Mail className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm text-gray-400">Email Address</div>
                        <div className="text-white font-medium">{user.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm text-gray-400">Member Since</div>
                        <div className="text-white font-medium">
                          {new Date(user.$createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-sm text-gray-400">Account Status</div>
                        <div className="text-green-400 font-medium">Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <Link href="/next-trip">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 transition-all"
                      >
                        <Plane size={18} />
                        <span>Book Next Trip</span>
                      </motion.button>
                    </Link>

                    <Link href="/gallery">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-3 bg-black/30 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-black/50 transition-all"
                      >
                        <MapPin size={18} />
                        <span>View Gallery</span>
                      </motion.button>
                    </Link>

                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-3 bg-black/30 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-black/50 transition-all"
                      >
                        <Users size={18} />
                        <span>Contact Support</span>
                      </motion.button>
                    </Link>
                  </div>
                </div>

                {/* Trip Stats */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Your Adventures</h3>
                  
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-purple-600/10 rounded-lg">
                      <div className="text-3xl font-black text-purple-400 mb-1">0</div>
                      <div className="text-sm text-gray-400">Trips Booked</div>
                    </div>
                    
                    <div className="text-center p-4 bg-pink-600/10 rounded-lg">
                      <div className="text-3xl font-black text-pink-400 mb-1">0</div>
                      <div className="text-sm text-gray-400">Memories Created</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Coming Soon Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Coming Soon</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-black/30 rounded-lg">
                    <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Payment History</h3>
                    <p className="text-sm text-gray-400">Track all your bookings and payments</p>
                  </div>
                  
                  <div className="text-center p-4 bg-black/30 rounded-lg">
                    <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Trip History</h3>
                    <p className="text-sm text-gray-400">View your past Cyprus adventures</p>
                  </div>
                  
                  <div className="text-center p-4 bg-black/30 rounded-lg">
                    <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-1">Friend Groups</h3>
                    <p className="text-sm text-gray-400">Connect with your travel squad</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}