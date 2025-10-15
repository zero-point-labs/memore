'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Euro,
  Mail,
  Phone,
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { tripService } from '@/services/tripService';
// Notification service is handled server-side via API

interface BookingDetails {
  booking: any;
  trip: any;
}

export default function BookingSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!paymentIntentId || !user) {
        setError('Missing payment information');
        setLoading(false);
        return;
      }

      try {
        // Get user's bookings and find the one with this payment intent
        const userBookings = await bookingService.getByUserId(user.$id);
        const booking = userBookings.find(b => b.depositPaymentIntentId === paymentIntentId);
        
        if (!booking) {
          setError('Booking not found');
          setLoading(false);
          return;
        }

        // Get trip details
        const trip = await tripService.getTrip(booking.tripId);
        if (!trip) {
          setError('Trip details not found');
          setLoading(false);
          return;
        }

        setBookingDetails({ booking, trip });

        // Fallback: Send booking confirmation email if webhook didn't work
        // This is needed for local development where webhooks don't work
        try {
          await fetch('/api/debug/manual-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntentId
            }),
          });
          console.log('Fallback booking confirmation email sent');
        } catch (emailError) {
          console.error('Failed to send fallback booking confirmation email:', emailError);
        }

      } catch (err) {
        console.error('Error loading booking details:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    loadBookingDetails();
  }, [paymentIntentId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading booking confirmation...</div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/account">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Go to My Account
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { booking, trip } = bookingDetails;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-green-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="border-b border-green-500/20 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50"></div>
                  <Sparkles className="relative w-8 h-8 text-purple-400" />
                </div>
                <span className="text-2xl font-black text-white">MEMORA</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Booking Confirmed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                🎉 Booking Confirmed!
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                Your Cyprus adventure is secured
              </p>
              <p className="text-gray-400">
                Booking ID: <span className="text-purple-400 font-mono">#{booking.$id.slice(-8)}</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Trip Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Trip Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{trip.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <MapPin size={16} />
                      <span>{trip.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-green-500/20 pt-6">
                    <h4 className="text-white font-semibold mb-4">Your Package</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Package:</span>
                        <span className="text-white capitalize">{booking.packageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Room:</span>
                        <span className="text-white capitalize">{booking.roomPreference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transport:</span>
                        <span className="text-white capitalize">{booking.transportPreference}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Payment Summary</h2>
                
                <div className="space-y-4">
                  <div className="bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle size={16} />
                      <span className="font-medium">Deposit Paid</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      €{booking.depositAmount}
                    </div>
                    <div className="text-sm text-gray-400">
                      Paid today
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Euro size={16} />
                      <span className="font-medium">Balance Due</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      €{booking.balanceAmount}
                    </div>
                    <div className="text-sm text-gray-400">
                      Payment link sent on {new Date(bookingDetails.booking.balanceDueDate).toLocaleDateString('en-GB')}
                    </div>
                  </div>

                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total Trip Cost:</span>
                      <span className="text-white">€{booking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Check Your Email</h3>
                    <p className="text-sm text-gray-400">
                      We've sent you a confirmation email with all the details
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Stay Connected</h3>
                    <p className="text-sm text-gray-400">
                      We'll send you updates and reminders via SMS and email
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Balance Payment</h3>
                    <p className="text-sm text-gray-400">
                      Payment link sent on {new Date(booking.balanceDueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/account">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold flex items-center gap-2"
                >
                  View My Bookings
                  <ArrowRight size={20} />
                </motion.button>
              </Link>

              <Link href="/gallery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-black/40 border border-purple-500/20 rounded-lg text-white font-medium hover:bg-black/60 transition-colors"
                >
                  Explore Cyprus Gallery
                </motion.button>
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-400 mb-2">
                Questions about your booking?
              </p>
              <Link href="/contact" className="text-purple-400 hover:text-purple-300 font-medium">
                Contact our support team
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
