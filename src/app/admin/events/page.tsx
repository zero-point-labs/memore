'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Eye, Globe, Users, Calendar, Ticket } from 'lucide-react';
import { eventService } from '@/services/eventService';
import { EventDocument, EVENT_TYPES, EVENT_CITIES, EVENT_BOOKING_STATUSES } from '@/types/event';
import { cn } from '@/utils/cn';

export default function AdminEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

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

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await eventService.getEvents({
        eventType: typeFilter !== 'all' ? typeFilter : undefined,
        city: cityFilter !== 'all' ? cityFilter : undefined,
        published: filter === 'published' ? true : filter === 'drafts' ? false : undefined,
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchEvents();
    }
  }, [isAdmin, filter, typeFilter, cityFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        await fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await eventService.togglePublished(id, !currentStatus);
      await fetchEvents();
    } catch (error) {
      console.error('Error toggling published status:', error);
      alert('Failed to update published status');
    }
  };

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

  const stats = {
    total: events.length,
    published: events.filter(e => e.published).length,
    drafts: events.filter(e => !e.published).length,
    upcoming: events.filter(e => new Date(e.eventDate) > new Date()).length,
    soldOut: events.filter(e => e.bookingStatus === 'sold-out').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Events Management</h1>
            <p className="text-gray-400">Manage single-night events, parties, and club nights</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/events/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-xl hover:shadow-purple-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Events', value: stats.total, icon: Ticket, color: 'purple' },
            { label: 'Published', value: stats.published, icon: Globe, color: 'green' },
            { label: 'Drafts', value: stats.drafts, icon: Edit, color: 'yellow' },
            { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'blue' },
            { label: 'Sold Out', value: stats.soldOut, icon: Users, color: 'red' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 bg-gradient-to-br ${
                stat.color === 'purple' ? 'from-purple-500/10 to-purple-600/5' :
                stat.color === 'green' ? 'from-green-500/10 to-green-600/5' :
                stat.color === 'yellow' ? 'from-yellow-500/10 to-yellow-600/5' :
                stat.color === 'blue' ? 'from-blue-500/10 to-blue-600/5' :
                'from-red-500/10 to-red-600/5'
              } border ${
                stat.color === 'purple' ? 'border-purple-500/20' :
                stat.color === 'green' ? 'border-green-500/20' :
                stat.color === 'yellow' ? 'border-yellow-500/20' :
                stat.color === 'blue' ? 'border-blue-500/20' :
                'border-red-500/20'
              } rounded-xl`}
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'purple' ? 'text-purple-400' :
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  'text-red-400'
                }`} />
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
              <div className={`text-3xl font-black ${
                stat.color === 'purple' ? 'text-purple-400' :
                stat.color === 'green' ? 'text-green-400' :
                stat.color === 'yellow' ? 'text-yellow-400' :
                stat.color === 'blue' ? 'text-blue-400' :
                'text-red-400'
              }`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Published Filter */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'published', label: 'Published' },
              { id: 'drafts', label: 'Drafts' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as 'all' | 'published' | 'drafts')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                  filter === f.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-purple-500/10 text-gray-300 border border-purple-500/20 hover:border-purple-500/40'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-purple-500/20 rounded-full text-white text-sm font-semibold hover:border-purple-500/40 focus:outline-none focus:border-purple-500/60"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Types</option>
            {EVENT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-purple-500/20 rounded-full text-white text-sm font-semibold hover:border-purple-500/40 focus:outline-none focus:border-purple-500/60"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Cities</option>
            {EVENT_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.icon} {city.label}
              </option>
            ))}
          </select>
        </div>

        {/* Events Table */}
        <div className="bg-black/40 border border-purple-500/20 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-purple-400">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-20 text-center">
              <div className="text-gray-400 mb-4">No events found</div>
              <button
                onClick={() => router.push('/admin/events/create')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-500/10 border-b border-purple-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Event</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Venue</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Capacity</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-purple-400">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-purple-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {events.map((event) => {
                    const eventType = EVENT_TYPES.find(t => t.id === event.eventType);
                    const totalRemaining = event.capacity.generalRemaining + event.capacity.vipRemaining;
                    const totalCapacity = event.capacity.general + event.capacity.vip;
                    
                    return (
                      <tr key={event.$id} className="hover:bg-purple-500/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{eventType?.icon}</span>
                            <div>
                              <div className="text-white font-semibold">{event.title}</div>
                              <div className="text-gray-400 text-sm">{eventType?.label}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300">
                            {new Date(event.eventDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-gray-400 text-sm">{event.eventDetails.startTime}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300">{event.venueInfo.venue}</div>
                          <div className="text-gray-400 text-sm">{EVENT_CITIES.find(c => c.id === event.city)?.label}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 font-semibold">
                            {totalRemaining} / {totalCapacity}
                          </div>
                          <div className="text-gray-400 text-sm">
                            G: {event.capacity.generalRemaining} • V: {event.capacity.vipRemaining}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-bold">€{event.pricing.general.price}</div>
                          {event.pricing.vip?.available && (
                            <div className="text-yellow-400 text-sm">VIP: €{event.pricing.vip.price}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={cn(
                              'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
                              EVENT_BOOKING_STATUSES.find(s => s.id === event.bookingStatus)?.color
                            )}>
                              {EVENT_BOOKING_STATUSES.find(s => s.id === event.bookingStatus)?.label}
                            </span>
                            <button
                              onClick={() => togglePublished(event.$id, event.published)}
                              className={cn(
                                'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all',
                                event.published
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                              )}
                            >
                              <Globe className="w-3 h-3" />
                              {event.published ? 'Published' : 'Draft'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => window.open(`/event/${event.$id}`, '_blank')}
                              className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all"
                              title="View Event"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/events/edit/${event.$id}`)}
                              className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-all"
                              title="Edit Event"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.$id)}
                              className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

