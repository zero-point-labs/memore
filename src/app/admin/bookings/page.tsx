'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users, 
  Calendar, 
  Ticket, 
  Filter, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface BookingData {
  $id: string;
  eventId: string;
  userId: string;
  userProfileId: string;
  ticketType: 'general' | 'vip';
  quantity: number;
  totalPrice: number;
  currency: string;
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  bookingReference: string;
  $createdAt: string;
  event: {
    id: string;
    title: string;
    eventDate: string;
    venue: string;
    eventType: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface BookingsResponse {
  success: boolean;
  data: {
    bookings: BookingData[];
    stats: {
      total: number;
      confirmed: number;
      cancelled: number;
      completed: number;
      totalRevenue: number;
    };
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    totalRevenue: 0
  });
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, adminLoading, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (ticketTypeFilter !== 'all') params.append('ticketType', ticketTypeFilter);
      if (eventFilter !== 'all') params.append('eventId', eventFilter);
      params.append('limit', '100');
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');

      const response = await fetch(`/api/admin/bookings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${user?.$id}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data: BookingsResponse = await response.json();
      
      if (data.success) {
        setBookings(data.data.bookings);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && user) {
      fetchBookings();
    }
  }, [isAdmin, user, statusFilter, ticketTypeFilter, eventFilter]);

  const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.$id}`,
        },
        body: JSON.stringify({
          bookingId,
          bookingStatus: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Refresh bookings
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings?bookingId=${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.$id}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      // Refresh bookings
      await fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'completed':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.user.firstName.toLowerCase().includes(searchLower) ||
        booking.user.lastName.toLowerCase().includes(searchLower) ||
        booking.user.email.toLowerCase().includes(searchLower) ||
        booking.bookingReference.toLowerCase().includes(searchLower) ||
        booking.event.title.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Event Bookings</h1>
            <p className="text-gray-400">Manage and view all event bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchBookings}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Bookings', value: stats.total, icon: Users, color: 'purple' },
            { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'green' },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'red' },
            { label: 'Completed', value: stats.completed, icon: Clock, color: 'blue' },
            { label: 'Revenue', value: `€${stats.totalRevenue}`, icon: Ticket, color: 'yellow' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 bg-gradient-to-br ${
                stat.color === 'purple' ? 'from-purple-500/10 to-purple-600/5' :
                stat.color === 'green' ? 'from-green-500/10 to-green-600/5' :
                stat.color === 'red' ? 'from-red-500/10 to-red-600/5' :
                stat.color === 'blue' ? 'from-blue-500/10 to-blue-600/5' :
                'from-yellow-500/10 to-yellow-600/5'
              } border ${
                stat.color === 'purple' ? 'border-purple-500/20' :
                stat.color === 'green' ? 'border-green-500/20' :
                stat.color === 'red' ? 'border-red-500/20' :
                stat.color === 'blue' ? 'border-blue-500/20' :
                'border-yellow-500/20'
              } rounded-xl`}
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'purple' ? 'text-purple-400' :
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'red' ? 'text-red-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-yellow-400'
                }`} />
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
              <div className={`text-3xl font-black ${
                stat.color === 'purple' ? 'text-purple-400' :
                stat.color === 'green' ? 'text-green-400' :
                stat.color === 'red' ? 'text-red-400' :
                stat.color === 'blue' ? 'text-blue-400' :
                'text-yellow-400'
              }`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'completed', label: 'Completed' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                  statusFilter === f.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-purple-500/10 text-gray-300 border border-purple-500/20 hover:border-purple-500/40'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Ticket Type Filter */}
          <select
            value={ticketTypeFilter}
            onChange={(e) => setTicketTypeFilter(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-purple-500/20 rounded-full text-white text-sm font-semibold hover:border-purple-500/40 focus:outline-none focus:border-purple-500/60"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Ticket Types</option>
            <option value="general">General</option>
            <option value="vip">VIP</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/40 border border-purple-500/20 rounded-full text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500/60"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-black/40 border border-purple-500/20 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-purple-400">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-20 text-center">
              <div className="text-gray-400 mb-4">No bookings found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-500/10 border-b border-purple-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Booking</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Event</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Tickets</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-purple-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.$id} className="hover:bg-purple-500/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">{booking.bookingReference}</div>
                          <div className="text-gray-400 text-sm">#{booking.$id.slice(-8)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">
                            {booking.user.firstName} {booking.user.lastName}
                          </div>
                          <div className="text-gray-400 text-sm">{booking.user.email}</div>
                          <div className="text-gray-400 text-sm">{booking.user.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">{booking.event.title}</div>
                          <div className="text-gray-400 text-sm">{booking.event.venue}</div>
                          <div className="text-gray-400 text-sm">
                            {new Date(booking.event.eventDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">
                          {booking.quantity}x {booking.ticketType.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-bold">€{booking.totalPrice}</div>
                        <div className="text-gray-400 text-sm">{booking.currency}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border',
                          getStatusColor(booking.bookingStatus)
                        )}>
                          {getStatusIcon(booking.bookingStatus)}
                          {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">
                          {new Date(booking.$createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(booking.$createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => window.open(`/event/${booking.event.id}`, '_blank')}
                            className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all"
                            title="View Event"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {booking.bookingStatus === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking.$id, 'completed')}
                              className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition-all"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {booking.bookingStatus === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking.$id, 'cancelled')}
                              className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(booking.$id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
