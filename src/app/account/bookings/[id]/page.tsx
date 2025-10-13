'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
  MessageSquare,
  Download,
  Mail,
  School,
  Users,
  Star,
  Timer
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { tripService } from '@/services/tripService';
import { userProfileService } from '@/services/userProfileService';
import { BookingDocument, UserProfileDocument } from '@/types/booking';
import { TripDocument } from '@/types/trip';

interface BookingDetails {
  booking: BookingDocument;
  trip: TripDocument | null;
  userProfile: UserProfileDocument | null;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        const bookingId = params.id as string;
        
        // Get booking details
        const booking = await bookingService.getById(bookingId);
        if (!booking) {
          setError('Booking not found');
          setLoading(false);
          return;
        }

        // Verify booking belongs to current user
        if (booking.userId !== user.$id) {
          setError('Access denied');
          setLoading(false);
          return;
        }

        // Get trip and user profile details
        const [trip, userProfile] = await Promise.all([
          tripService.getTrip(booking.tripId),
          userProfileService.getByUserId(booking.userId)
        ]);

        setDetails({ booking, trip, userProfile });
      } catch (err) {
        console.error('Error loading booking details:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    loadBookingDetails();
  }, [params.id, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading booking details...</div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/account/bookings">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Back to Bookings
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { booking, trip, userProfile } = details;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_paid': return 'text-green-400 bg-green-500/20';
      case 'deposit_paid': return 'text-yellow-400 bg-yellow-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const daysUntilTrip = trip ? Math.ceil((new Date(trip.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysUntilBalance = Math.ceil((new Date(booking.balanceDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

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
              <Link href="/account/bookings" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Bookings</span>
              </Link>
              
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">Booking Details</h1>
                <p className="text-sm text-gray-400">#{booking.$id.slice(-8)}</p>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus)}`}>
                {booking.bookingStatus.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Trip Overview */}
            {trip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 mb-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">{trip.title}</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-lg">
                        <MapPin className="w-6 h-6 text-purple-400" />
                        <span className="text-white">{trip.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-lg">
                        <Calendar className="w-6 h-6 text-purple-400" />
                        <span className="text-white">
                          {new Date(trip.startDate).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-lg">
                        <Timer className="w-6 h-6 text-purple-400" />
                        <span className="text-white">{trip.duration} days adventure</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    {daysUntilTrip > 0 ? (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-2">{daysUntilTrip}</div>
                        <div className="text-white font-medium">Days Until Trip</div>
                        <div className="text-gray-400 text-sm">Get excited! 🎉</div>
                      </div>
                    ) : daysUntilTrip === 0 ? (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">TODAY</div>
                        <div className="text-white font-medium">Trip Day!</div>
                        <div className="text-gray-400 text-sm">Have an amazing time! 🚀</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">✓</div>
                        <div className="text-white font-medium">Trip Completed</div>
                        <div className="text-gray-400 text-sm">Hope you had fun! 📸</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-purple-400" />
                  Payment Information
                </h3>

                {/* Payment Timeline */}
                <div className="space-y-6">
                  {/* Total Amount */}
                  <div className="bg-purple-900/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Trip Cost</span>
                      <span className="text-2xl font-bold text-white">€{booking.totalAmount}</span>
                    </div>
                  </div>

                  {/* Deposit Payment */}
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-green-400 font-bold">✓ Deposit Paid</h4>
                              <p className="text-gray-400 text-sm">
                                Paid on {new Date(booking.$createdAt).toLocaleDateString('en-GB', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-green-400 font-bold text-xl">€{booking.depositAmount}</div>
                          </div>
                          <div className="text-green-300 text-sm">
                            30% of total amount • Payment method saved for balance
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balance Payment */}
                  <div className="relative">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        booking.bookingStatus === 'fully_paid' 
                          ? 'bg-green-500/20' 
                          : 'bg-yellow-500/20'
                      }`}>
                        {booking.bookingStatus === 'fully_paid' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`rounded-lg p-4 border ${
                          booking.bookingStatus === 'fully_paid' 
                            ? 'bg-green-900/20 border-green-500/30' 
                            : 'bg-yellow-900/20 border-yellow-500/30'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className={`font-bold ${
                                booking.bookingStatus === 'fully_paid' ? 'text-green-400' : 'text-yellow-400'
                              }`}>
                                {booking.bookingStatus === 'fully_paid' ? '✓ Balance Paid' : '⏰ Balance Due'}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {booking.bookingStatus === 'fully_paid' 
                                  ? 'Payment completed automatically'
                                  : `Scheduled for ${new Date(booking.balanceDueDate).toLocaleDateString('en-GB', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}`
                                }
                              </p>
                            </div>
                            <div className={`font-bold text-xl ${
                              booking.bookingStatus === 'fully_paid' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              €{booking.balanceAmount}
                            </div>
                          </div>
                          <div className={`text-sm ${
                            booking.bookingStatus === 'fully_paid' ? 'text-green-300' : 'text-yellow-300'
                          }`}>
                            {booking.bookingStatus === 'fully_paid' 
                              ? '70% of total amount • Payment completed'
                              : `70% of total amount • ${daysUntilBalance > 0 ? `${daysUntilBalance} days remaining` : 'Due soon'}`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Booking Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-400" />
                  Booking Details
                </h3>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <User size={16} />
                          Name
                        </div>
                        <div className="text-white font-medium">
                          {userProfile?.firstName} {userProfile?.lastName}
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Mail size={16} />
                          Email
                        </div>
                        <div className="text-white font-medium">{userProfile?.email}</div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Phone size={16} />
                          Phone
                        </div>
                        <div className="text-white font-medium">
                          {userProfile?.phoneCountryCode} {userProfile?.phone}
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <School size={16} />
                          Status
                        </div>
                        <div className="text-white font-medium capitalize">
                          {userProfile?.studentStatus === 'college' ? 'College Student' : 'Youth (18-28)'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip Preferences */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Trip Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Star size={16} />
                          Package
                        </div>
                        <div className="text-white font-medium capitalize">{booking.packageType}</div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Bed size={16} />
                          Room
                        </div>
                        <div className="text-white font-medium capitalize">{booking.roomPreference}</div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          {booking.transportPreference === 'bus' ? 
                            <Bus size={16} /> : 
                            <Car size={16} />
                          }
                          Transport
                        </div>
                        <div className="text-white font-medium capitalize">{booking.transportPreference}</div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div>
                      <h4 className="text-white font-semibold mb-3">Special Requests</h4>
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-start gap-2 text-gray-400 text-sm mb-2">
                          <MessageSquare size={16} className="mt-0.5" />
                          Your requests:
                        </div>
                        <p className="text-white">{booking.specialRequests}</p>
                      </div>
                    </div>
                  )}

                  {/* Important Dates */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Important Dates</h4>
                    <div className="space-y-3">
                      <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-medium">Trip Dates</span>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {trip ? (
                            <>
                              {new Date(trip.startDate).toLocaleDateString('en-GB', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })} - {new Date(trip.endDate).toLocaleDateString('en-GB', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </>
                          ) : (
                            'Date not available'
                          )}
                        </div>
                        {daysUntilTrip > 0 && (
                          <div className="text-blue-300 text-sm mt-1">
                            {daysUntilTrip} days from now
                          </div>
                        )}
                      </div>

                      <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                        <div className="flex items-center gap-2 text-yellow-400 mb-2">
                          <Euro className="w-5 h-5" />
                          <span className="font-medium">Balance Payment</span>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {new Date(booking.balanceDueDate).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-yellow-300 text-sm mt-1">
                          {daysUntilBalance > 0 
                            ? `${daysUntilBalance} days remaining • Auto-charged`
                            : 'Payment due • Check your email'
                          }
                        </div>
                      </div>

                      <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Booking Confirmed</span>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {new Date(booking.$createdAt).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-green-300 text-sm mt-1">
                          Deposit paid • Spot secured
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              {trip && (
                <Link href={`/trip/${trip.$id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold"
                  >
                    View Trip Details
                  </motion.button>
                </Link>
              )}
              
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-black/40 border border-purple-500/30 rounded-lg text-white font-medium hover:bg-black/60 transition-colors"
                >
                  Contact Support
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
