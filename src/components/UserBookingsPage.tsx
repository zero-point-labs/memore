'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Ticket, Euro, CheckCircle, XCircle, AlertCircle, Filter, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EventBookingDocument } from '@/types/event';
import { cn } from '@/utils/cn';

interface UserBookingsPageProps {
  className?: string;
}

interface BookingWithEvent extends EventBookingDocument {
  event: {
    id: string;
    title: string;
    eventDate: string;
    venue: string;
    eventType: string;
    featuredImage?: string;
  };
}

export default function UserBookingsPage({ className }: UserBookingsPageProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/user/bookings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${user?.$id}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const result = await response.json();
      if (result.success) {
        setBookings(result.data.bookings);
      } else {
        throw new Error(result.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingBooking(bookingId);
      setError(null);

      const response = await fetch('/api/user/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.$id}`,
        },
        body: JSON.stringify({
          bookingId,
          action: 'cancel'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      const result = await response.json();
      if (result.success) {
        // Refresh bookings
        await fetchBookings();
      } else {
        throw new Error(result.error || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setCancellingBooking(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400">You need to be logged in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-black py-8", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">My Event Bookings</h1>
          <p className="text-gray-400">Manage your upcoming and past event bookings</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
              />
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-purple-400 text-lg">Loading your bookings...</div>
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Bookings Found</h3>
                <p className="text-gray-400 mb-6">
                  {statusFilter === 'all' 
                    ? "You haven't booked any events yet."
                    : `No ${statusFilter} bookings found.`
                  }
                </p>
                <a
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Browse Events
                </a>
              </div>
            ) : (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Event Image */}
                    <div className="relative h-48 lg:h-full rounded-xl overflow-hidden">
                      {booking.event.featuredImage ? (
                        <img
                          src={booking.event.featuredImage}
                          alt={booking.event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-purple-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                        {booking.event.eventType.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{booking.event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(booking.event.eventDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(booking.event.eventDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.event.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Booking Reference</div>
                          <div className="text-white font-mono text-sm">{booking.bookingReference}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Ticket Type</div>
                          <div className="text-white font-medium capitalize">{booking.ticketType}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Quantity</div>
                          <div className="text-white font-medium">{booking.quantity}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Total Price</div>
                          <div className="text-white font-bold">
                            {booking.totalPrice === 0 ? 'Free' : `€${booking.totalPrice}`}
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border",
                            getStatusColor(booking.bookingStatus)
                          )}>
                            {getStatusIcon(booking.bookingStatus)}
                            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                          </div>
                        </div>

                        {booking.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.$id)}
                            disabled={cancellingBooking === booking.$id}
                            className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 font-medium hover:bg-red-600/30 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingBooking === booking.$id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        )}
                      </div>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="bg-blue-900/20 rounded-lg p-4">
                          <div className="text-sm text-blue-300 font-medium mb-1">Special Requests</div>
                          <div className="text-gray-300 text-sm">{booking.specialRequests}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
