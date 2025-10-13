'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  Users,
  Euro,
  Calendar,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
  Settings
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { bookingService } from '@/services/bookingService';
import { tripService } from '@/services/tripService';
import { eventService } from '@/services/eventService';
import { BlogDocument } from '@/types/blog';
import { blogService } from '@/services/blogService';
import { BookingDocument } from '@/types/booking';
import { TripDocument } from '@/types/trip';
import { EventDocument } from '@/types/event';

interface DashboardStats {
  bookings: {
    total: number;
    thisMonth: number;
    pending: number;
    confirmed: number;
    completed: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    pending: number;
    collected: number;
  };
  content: {
    trips: number;
    events: number;
    blogs: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'booking' | 'payment' | 'trip' | 'blog';
    title: string;
    subtitle: string;
    time: string;
    status: 'success' | 'pending' | 'warning';
  }>;
}

export default function AdminDashboardPage() {
  const { isAdmin } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [bookingResponse, trips, events, blogs] = await Promise.all([
        bookingService.getAll(),
        tripService.getTrips(),
        eventService.getEvents(),
        blogService.getBlogs()
      ]);

      const bookings = bookingResponse.bookings;

      // Calculate booking stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const bookingStats = {
        total: bookings.length,
        thisMonth: bookings.filter((b: BookingDocument) => new Date(b.$createdAt) >= thisMonth).length,
        pending: bookings.filter((b: BookingDocument) => b.bookingStatus === 'pending').length,
        confirmed: bookings.filter((b: BookingDocument) => b.bookingStatus === 'deposit_paid' || b.bookingStatus === 'fully_paid').length,
        completed: bookings.filter((b: BookingDocument) => b.bookingStatus === 'fully_paid').length,
      };

      // Calculate revenue stats
      const revenueStats = {
        total: bookings.reduce((sum: number, b: BookingDocument) => sum + (b.totalAmount || 0), 0),
        thisMonth: bookings
          .filter((b: BookingDocument) => new Date(b.$createdAt) >= thisMonth)
          .reduce((sum: number, b: BookingDocument) => sum + (b.totalAmount || 0), 0),
        pending: bookings
          .filter((b: BookingDocument) => b.bookingStatus === 'pending' || b.bookingStatus === 'deposit_paid')
          .reduce((sum: number, b: BookingDocument) => sum + (b.balanceAmount || 0), 0),
        collected: bookings
          .filter((b: BookingDocument) => b.bookingStatus === 'fully_paid')
          .reduce((sum: number, b: BookingDocument) => sum + (b.totalAmount || 0), 0),
      };

      // Content stats
      const contentStats = {
        trips: trips.length,
        events: events.length,
        blogs: blogs.length,
      };

      // Recent activity (last 10 items)
      const recentActivity = [
        ...bookings.slice(0, 5).map((booking: BookingDocument) => ({
          id: booking.$id,
          type: 'booking' as const,
          title: `New booking received`,
          subtitle: `€${booking.totalAmount} - ${booking.packageType}`,
          time: new Date(booking.$createdAt).toLocaleDateString('en-GB'),
          status: booking.bookingStatus === 'fully_paid' ? 'success' as const : 
                  booking.bookingStatus === 'pending' ? 'pending' as const : 'warning' as const
        })),
        ...blogs.slice(0, 3).map((blog: BlogDocument) => ({
          id: blog.$id,
          type: 'blog' as const,
          title: `Blog published: ${blog.title}`,
          subtitle: blog.excerpt.substring(0, 50) + '...',
          time: new Date(blog.$createdAt).toLocaleDateString('en-GB'),
          status: 'success' as const
        })),
        ...trips.slice(0, 2).map((trip: TripDocument) => ({
          id: trip.$id,
          type: 'trip' as const,
          title: `Trip updated: ${trip.title}`,
          subtitle: `${trip.duration} days - ${trip.location}`,
          time: new Date(trip.$updatedAt).toLocaleDateString('en-GB'),
          status: 'success' as const
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

      setStats({
        bookings: bookingStats,
        revenue: revenueStats,
        content: contentStats,
        recentActivity
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Access denied</div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            Dashboard
          </h1>
          <p className="text-gray-400">Overview of your Memora business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                +{stats?.bookings.thisMonth || 0} this month
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats?.bookings.total || 0}</h3>
            <p className="text-gray-400 text-sm">Total Bookings</p>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Euro className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                €{stats?.revenue.thisMonth || 0} this month
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">€{stats?.revenue.total || 0}</h3>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </motion.div>

          {/* Pending Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                {stats?.bookings.pending || 0} bookings
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">€{stats?.revenue.pending || 0}</h3>
            <p className="text-gray-400 text-sm">Pending Payments</p>
          </motion.div>

          {/* Content Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                Content
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {(stats?.content.trips || 0) + (stats?.content.events || 0) + (stats?.content.blogs || 0)}
            </h3>
            <p className="text-gray-400 text-sm">
              {stats?.content.trips || 0} trips, {stats?.content.events || 0} events, {stats?.content.blogs || 0} blogs
            </p>
          </motion.div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Booking Status Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Confirmed</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{stats?.bookings.confirmed || 0}</div>
                  <div className="text-xs text-gray-400">
                    {stats?.bookings.total ? Math.round((stats.bookings.confirmed / stats.bookings.total) * 100) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300">Pending</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{stats?.bookings.pending || 0}</div>
                  <div className="text-xs text-gray-400">
                    {stats?.bookings.total ? Math.round((stats.bookings.pending / stats.bookings.total) * 100) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Completed</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{stats?.bookings.completed || 0}</div>
                  <div className="text-xs text-gray-400">
                    {stats?.bookings.total ? Math.round((stats.bookings.completed / stats.bookings.total) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {stats?.recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-gray-400 text-xs truncate">{activity.subtitle}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-black/30 border border-blue-500/20 rounded-lg text-left hover:bg-black/50 transition-colors group">
              <CreditCard className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-medium mb-1">Manage Payments</h4>
              <p className="text-gray-400 text-sm">Process payments and refunds</p>
            </button>
            
            <button className="p-4 bg-black/30 border border-green-500/20 rounded-lg text-left hover:bg-black/50 transition-colors group">
              <MapPin className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-medium mb-1">Create Trip</h4>
              <p className="text-gray-400 text-sm">Add new adventure trip</p>
            </button>
            
            <button className="p-4 bg-black/30 border border-yellow-500/20 rounded-lg text-left hover:bg-black/50 transition-colors group">
              <Calendar className="w-8 h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-medium mb-1">Create Event</h4>
              <p className="text-gray-400 text-sm">Schedule new event</p>
            </button>
            
            <button className="p-4 bg-black/30 border border-purple-500/20 rounded-lg text-left hover:bg-black/50 transition-colors group">
              <FileText className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-medium mb-1">Write Blog</h4>
              <p className="text-gray-400 text-sm">Create new blog post</p>
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
