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
  CreditCard,
  Phone,
  School,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Euro
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserBookings } from '@/hooks/useUserBookings';

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Use our new hooks
  const { profile, loading: profileLoading, isProfileComplete, profileCompletionPercentage } = useUserProfile();
  const { bookings, loading: bookingsLoading, stats, upcomingBookings, balanceDueSoon } = useUserBookings();

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

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 pt-32">
          <div className="max-w-6xl mx-auto">
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

            {/* Profile Completion Alert */}
            {!profileLoading && profile && !isProfileComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Complete Your Profile</h3>
                      <p className="text-gray-300">Unlock all booking features and notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">{profileCompletionPercentage}%</div>
                      <div className="text-gray-400 text-sm">Complete</div>
                    </div>
                    <Link href="/account/profile">
                      <button className="px-6 py-3 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors">
                        Complete Now
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Balance Due Alert */}
            {balanceDueSoon.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Balance Due Soon</h3>
                      <p className="text-gray-300">
                        {balanceDueSoon.length} payment{balanceDueSoon.length > 1 ? 's' : ''} scheduled for auto-charge
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-bold text-lg">
                      €{balanceDueSoon.reduce((sum, booking) => sum + booking.balanceAmount, 0)}
                    </div>
                    <div className="text-gray-400 text-sm">Total Due</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-black text-purple-400 mb-2">{bookingsLoading ? '...' : stats.total}</div>
                <div className="text-sm text-gray-400">Trips Booked</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-black text-green-400 mb-2">€{bookingsLoading ? '...' : stats.totalSpent}</div>
                <div className="text-sm text-gray-400">Total Spent</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-black text-yellow-400 mb-2">€{bookingsLoading ? '...' : stats.pendingPayments}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-black text-blue-400 mb-2">{bookingsLoading ? '...' : stats.fullyPaid}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
                  {bookings.length > 0 && (
                    <Link href="/account/bookings" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                      View All
                    </Link>
                  )}
                </div>
                
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400">Loading bookings...</div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Plane className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-6">Ready for your first Cyprus adventure?</p>
                    <Link href="/next-trip">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium"
                      >
                        Book Your First Trip
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <Link key={booking.$id} href={`/account/bookings/${booking.$id}`}>
                        <div className="p-4 bg-black/30 rounded-lg hover:bg-black/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                booking.bookingStatus === 'fully_paid' ? 'bg-green-400' :
                                booking.bookingStatus === 'deposit_paid' ? 'bg-yellow-400' :
                                booking.bookingStatus === 'cancelled' ? 'bg-red-400' :
                                'bg-gray-400'
                              }`} />
                              <span className="text-white font-medium">Trip #{booking.$id.slice(-6)}</span>
                            </div>
                            <span className="text-sm text-gray-400 capitalize">
                              {booking.bookingStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Balance Due: {new Date(booking.balanceDueDate).toLocaleDateString('en-GB')}
                            </span>
                            <span className="text-purple-400 font-medium">€{booking.totalAmount}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                
                <div className="space-y-4">
                  <Link href="/account/bookings">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-pink-600/30 transition-all cursor-pointer"
                    >
                      <CreditCard className="w-8 h-8 text-purple-400" />
                      <div>
                        <div className="text-white font-semibold">My Bookings</div>
                        <div className="text-gray-400 text-sm">View all trips and payments</div>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/account/profile">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 bg-black/30 border border-gray-500/30 rounded-lg hover:bg-black/50 transition-all cursor-pointer"
                    >
                      <User className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="text-white font-semibold">Manage Profile</div>
                        <div className="text-gray-400 text-sm">Update personal information</div>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/account/preferences">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 bg-black/30 border border-gray-500/30 rounded-lg hover:bg-black/50 transition-all cursor-pointer"
                    >
                      <Bell className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="text-white font-semibold">Preferences</div>
                        <div className="text-gray-400 text-sm">Manage notifications</div>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/next-trip">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all cursor-pointer"
                    >
                      <Plane className="w-8 h-8 text-blue-400" />
                      <div>
                        <div className="text-white font-semibold">Book New Trip</div>
                        <div className="text-gray-400 text-sm">Explore Cyprus adventures</div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
