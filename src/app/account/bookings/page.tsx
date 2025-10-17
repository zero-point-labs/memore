'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NextTripLink from '@/components/NextTripLink';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Euro,
  User,
  Phone,
  Car,
  Bus,
  Bed,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBookings } from '@/hooks/useUserBookings';
import { tripService } from '@/services/tripService';
import { BookingDocument } from '@/types/booking';
import { TripDocument } from '@/types/trip';

interface BookingWithTrip extends BookingDocument {
  trip?: TripDocument;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const { bookings, loading, stats } = useUserBookings();
  const [bookingsWithTrips, setBookingsWithTrips] = useState<BookingWithTrip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Load trip details for each booking
  useEffect(() => {
    const loadTripDetails = async () => {
      if (bookings.length === 0) {
        setLoadingTrips(false);
        return;
      }

      try {
        const bookingsWithTripData = await Promise.all(
          bookings.map(async (booking) => {
            try {
              const trip = await tripService.getTrip(booking.tripId);
              return { ...booking, trip };
            } catch (error) {
              console.error(`Error loading trip ${booking.tripId}:`, error);
              return booking;
            }
          })
        );

        setBookingsWithTrips(bookingsWithTripData);
      } catch (error) {
        console.error('Error loading trip details:', error);
        setBookingsWithTrips(bookings);
      } finally {
        setLoadingTrips(false);
      }
    };

    loadTripDetails();
  }, [bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'deposit_paid':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fully_paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'deposit_paid':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading || loadingTrips) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your bookings...</div>
      </div>
    );
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
              <Link href="/account" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Account</span>
              </Link>
              
              <h1 className="text-xl font-bold text-white">My Bookings</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
              >
                <div className="text-2xl font-bold text-purple-400 mb-1">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Bookings</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-xl p-6"
              >
                <div className="text-2xl font-bold text-green-400 mb-1">€{stats.totalSpent}</div>
                <div className="text-sm text-gray-400">Total Spent</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6"
              >
                <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.depositPaid}</div>
                <div className="text-sm text-gray-400">Awaiting Balance</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6"
              >
                <div className="text-2xl font-bold text-blue-400 mb-1">{stats.fullyPaid}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </motion.div>
            </div>

            {/* Bookings List */}
            {bookingsWithTrips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-12 text-center"
              >
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">No Bookings Yet</h2>
                <p className="text-gray-400 mb-8">Ready to start your Cyprus adventure?</p>
                <NextTripLink>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold"
                  >
                    Book Your First Trip
                  </motion.button>
                </NextTripLink>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bookingsWithTrips.map((booking, index) => (
                  <motion.div
                    key={booking.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-colors"
                  >
                    {/* Trip Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {booking.trip?.title || `Trip #${booking.tripId.slice(-6)}`}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <MapPin size={14} />
                          <span>{booking.trip?.location || 'Cyprus'}</span>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.bookingStatus)}`}>
                        {getStatusIcon(booking.bookingStatus)}
                        {booking.bookingStatus.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Trip Date - Most Important Info */}
                    {booking.trip && (
                      <div className="bg-blue-900/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-semibold">Trip Dates</span>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {new Date(booking.trip.startDate).toLocaleDateString('en-GB')} - {new Date(booking.trip.endDate).toLocaleDateString('en-GB')}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          {booking.trip.duration} days • {booking.packageType} package
                        </div>
                      </div>
                    )}

                    {/* Payment Timeline */}
                    <div className="space-y-3 mb-6">
                      {/* Deposit Payment */}
                      <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="text-green-400 font-medium">Deposit Paid</div>
                            <div className="text-gray-400 text-sm">
                              {new Date(booking.$createdAt).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                        </div>
                        <div className="text-green-400 font-bold">€{booking.depositAmount}</div>
                      </div>

                      {/* Balance Payment */}
                      <div className={`flex items-center justify-between p-3 rounded-lg border ${
                        booking.bookingStatus === 'fully_paid' 
                          ? 'bg-green-900/20 border-green-500/30' 
                          : 'bg-yellow-900/20 border-yellow-500/30'
                      }`}>
                        <div className="flex items-center gap-3">
                          {booking.bookingStatus === 'fully_paid' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-400" />
                          )}
                          <div>
                            <div className={`font-medium ${
                              booking.bookingStatus === 'fully_paid' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {booking.bookingStatus === 'fully_paid' ? 'Balance Paid' : 'Balance Due'}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {booking.bookingStatus === 'fully_paid' 
                                ? 'Payment completed' 
                                : `Payment link: ${new Date(booking.balanceDueDate).toLocaleDateString('en-GB')}`
                              }
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold ${
                          booking.bookingStatus === 'fully_paid' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          €{booking.balanceAmount}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link href={`/account/bookings/${booking.$id}`} className="flex-1">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium"
                        >
                          View Full Details
                        </motion.button>
                      </Link>
                      
                      {booking.trip && (
                        <Link href={`/trip/${booking.tripId}`}>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 bg-black/40 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-black/60 transition-colors"
                          >
                            Trip Info
                          </motion.button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
