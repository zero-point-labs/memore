'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { MapPin, Plus, Edit, Trash2, Eye, Globe, Clock, Users, Calendar } from 'lucide-react';
import { tripService } from '@/services/tripService';
import { TripDocument, TRIP_CATEGORIES, BOOKING_STATUSES } from '@/types/trip';
import { cn } from '@/utils/cn';

export default function AdminTripsPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [trips, setTrips] = useState<TripDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const fetchedTrips = await tripService.getTrips({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        published: filter === 'published' ? true : filter === 'drafts' ? false : undefined,
        bookingStatus: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setTrips(fetchedTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTrips();
    }
  }, [isAdmin, filter, categoryFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripService.deleteTrip(id);
        await fetchTrips(); // Refresh the list
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip');
      }
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await tripService.togglePublished(id, !currentStatus);
      await fetchTrips(); // Refresh the list
    } catch (error) {
      console.error('Error toggling published status:', error);
      alert('Failed to update published status');
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingStatusColor = (status: string) => {
    const statusConfig = BOOKING_STATUSES.find(s => s.id === status);
    return statusConfig?.color || 'text-gray-400 bg-gray-500/20';
  };

  const publishedTrips = trips.filter(trip => trip.published);
  const draftTrips = trips.filter(trip => !trip.published);
  const totalSpots = trips.reduce((sum, trip) => sum + trip.availability.totalSpots, 0);
  const bookedSpots = trips.reduce((sum, trip) => sum + trip.availability.spotsTaken, 0);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Trip Management</h1>
            <p className="text-gray-400">Manage trip details, availability, and bookings</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/trips/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Plus size={18} />
            <span>New Trip</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{trips.length}</div>
                <div className="text-sm text-gray-400">Total Trips</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{publishedTrips.length}</div>
                <div className="text-sm text-gray-400">Published</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{draftTrips.length}</div>
                <div className="text-sm text-gray-400">Drafts</div>
              </div>
            </div>
          </motion.div>



          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{bookedSpots}/{totalSpots}</div>
                <div className="text-sm text-gray-400">Spots Booked</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All Trips' },
                  { key: 'published', label: 'Published' },
                  { key: 'drafts', label: 'Drafts' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key as 'all' | 'published' | 'drafts')}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      filter === item.key
                        ? "bg-purple-600 text-white"
                        : "bg-black/30 text-gray-400 hover:bg-black/50 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Categories</option>
                {TRIP_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Booking Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Booking Status</option>
                {BOOKING_STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Trips List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-purple-500/20">
            <h2 className="text-xl font-bold text-white">Trips</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="text-gray-400">Loading trips...</div>
            </div>
          ) : trips.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No trips found</p>
              <p className="text-gray-500 text-sm">Create your first trip to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-500/20">
              {trips.map((trip) => (
                <div key={trip.$id} className="p-6 hover:bg-purple-500/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {trip.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded-full flex items-center gap-1",
                              trip.published
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            )}
                          >
                            {trip.published ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            {trip.published ? 'Published' : 'Draft'}
                          </span>
                          <span className={cn("px-2 py-1 text-xs rounded-full", getBookingStatusColor(trip.availability.bookingStatus))}>
                            {BOOKING_STATUSES.find(s => s.id === trip.availability.bookingStatus)?.label}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {trip.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {trip.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {trip.duration} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {trip.availability.spotsTaken}/{trip.availability.totalSpots} spots
                        </span>
                        <span>
                          Category: {TRIP_CATEGORIES.find(c => c.id === trip.category)?.label}
                        </span>
                        <span>
                          {new Date(trip.$createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(`/next-trip/${trip.$id}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => router.push(`/admin/trips/edit/${trip.$id}`)}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => togglePublished(trip.$id, trip.published)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          trip.published
                            ? "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            : "text-yellow-400 hover:text-green-400 hover:bg-green-500/10"
                        )}
                        title={trip.published ? "Unpublish" : "Publish"}
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => router.push(`/admin/trips/edit/${trip.$id}`)}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(trip.$id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
