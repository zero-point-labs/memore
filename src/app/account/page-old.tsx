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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <User className="w-6 h-6 text-purple-400" />
                      Profile Information
                    </h2>
                    {profile && !isProfileComplete && (
                      <Link href="/account/profile">
                        <button className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm hover:bg-yellow-600/30 transition-colors">
                          Complete Profile
                        </button>
                      </Link>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                            {new Date(user.$createdAt).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {profile ? (
                        <>
                          <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg">
                            <Phone className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-sm text-gray-400">Phone Number</div>
                              <div className="text-white font-medium">
                                {profile.phoneCountryCode} {profile.phone}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg">
                            <School className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-sm text-gray-400">Status</div>
                              <div className="text-white font-medium">
                                {profile.studentStatus === 'college' ? 'College Student' : 'Youth (18-28)'}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4 p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                          <div>
                            <div className="text-sm text-yellow-400">Profile Incomplete</div>
                            <div className="text-white font-medium">Complete your profile to book trips</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 p-4 bg-black/30 rounded-lg">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="text-sm text-gray-400">Account Status</div>
                          <div className="text-green-400 font-medium">Active</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats & Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {/* Adventure Stats */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Your Adventures</h3>
                  
                  {bookingsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Loading stats...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-purple-600/10 rounded-lg">
                          <div className="text-2xl font-black text-purple-400 mb-1">{stats.total}</div>
                          <div className="text-xs text-gray-400">Trips Booked</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-600/10 rounded-lg">
                          <div className="text-2xl font-black text-green-400 mb-1">€{stats.totalSpent}</div>
                          <div className="text-xs text-gray-400">Total Spent</div>
                        </div>
                      </div>
                      
                      {stats.pendingPayments > 0 && (
                        <div className="text-center p-4 bg-yellow-600/10 rounded-lg">
                          <div className="text-2xl font-black text-yellow-400 mb-1">€{stats.pendingPayments}</div>
                          <div className="text-xs text-gray-400">Pending Payments</div>
                        </div>
                      )}

                      {stats.fullyPaid > 0 && (
                        <div className="text-center p-4 bg-blue-600/10 rounded-lg">
                          <div className="text-2xl font-black text-blue-400 mb-1">{stats.fullyPaid}</div>
                          <div className="text-xs text-gray-400">Completed Trips</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
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

                {/* Booking Stats */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Your Adventures</h3>
                  
                  {bookingsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Loading bookings...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-purple-600/10 rounded-lg">
                        <div className="text-3xl font-black text-purple-400 mb-1">{stats.total}</div>
                        <div className="text-sm text-gray-400">Trips Booked</div>
                      </div>
                      
                      <div className="text-center p-4 bg-pink-600/10 rounded-lg">
                        <div className="text-3xl font-black text-pink-400 mb-1">€{stats.totalSpent}</div>
                        <div className="text-sm text-gray-400">Total Spent</div>
                      </div>
                      
                      {stats.pendingPayments > 0 && (
                        <div className="text-center p-4 bg-yellow-600/10 rounded-lg">
                          <div className="text-3xl font-black text-yellow-400 mb-1">€{stats.pendingPayments}</div>
                          <div className="text-sm text-gray-400">Pending Payments</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Booking Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 space-y-8"
            >
              {/* Profile Completion */}
              {!profileLoading && profile && !isProfileComplete && (
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Complete Your Profile</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Complete your profile to unlock booking features and receive important notifications.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-black/30 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletionPercentage}%` }}
                      />
                    </div>
                    <span className="text-yellow-400 font-bold">{profileCompletionPercentage}%</span>
                  </div>
                </div>
              )}

              {/* Balance Due Soon */}
              {balanceDueSoon.length > 0 && (
                <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold text-white">Balance Due Soon</h3>
                  </div>
                  <div className="space-y-3">
                    {balanceDueSoon.slice(0, 3).map((booking) => (
                      <div key={booking.$id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                        <div>
                          <div className="text-white font-medium">Trip #{booking.$id.slice(-6)}</div>
                          <div className="text-sm text-gray-400">
                            Due: {new Date(booking.balanceDueDate).toLocaleDateString('en-GB')}
                          </div>
                        </div>
                        <div className="text-orange-400 font-bold">€{booking.balanceAmount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Bookings */}
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
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
                      <div key={booking.$id} className="p-4 bg-black/30 rounded-lg">
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
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/account/profile">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-center p-6 bg-black/30 rounded-lg hover:bg-black/50 transition-all cursor-pointer"
                    >
                      <User className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-white mb-2">Manage Profile</h3>
                      <p className="text-sm text-gray-400">Update your personal information</p>
                    </motion.div>
                  </Link>
                  
                  <Link href="/account/bookings">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-center p-6 bg-black/30 rounded-lg hover:bg-black/50 transition-all cursor-pointer"
                    >
                      <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-white mb-2">Booking History</h3>
                      <p className="text-sm text-gray-400">View all your trips and payments</p>
                    </motion.div>
                  </Link>
                  
                  <Link href="/account/preferences">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-center p-6 bg-black/30 rounded-lg hover:bg-black/50 transition-all cursor-pointer"
                    >
                      <Bell className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-white mb-2">Preferences</h3>
                      <p className="text-sm text-gray-400">Manage notifications and settings</p>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}