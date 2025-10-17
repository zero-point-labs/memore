'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EVENT_TYPES, EVENT_CITIES, EventDocument } from '@/types/event';
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsPage() {
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, [selectedType, selectedCity]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        published: 'true',
        ...(selectedType !== 'all' && { eventType: selectedType }),
        ...(selectedCity !== 'all' && { city: selectedCity }),
      });

      const response = await fetch(`/api/events?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Upcoming{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Events
              </span>
            </h1>
            <p className="text-lg text-gray-300">
              Single-night experiences at Cyprus&apos;s hottest venues
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative py-8 border-t border-b border-purple-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Event Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">Type:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedType === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-purple-500/10 text-gray-300 border border-purple-500/20 hover:border-purple-500/40'
                  }`}
                >
                  All Events
                </button>
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedType === type.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-purple-500/10 text-gray-300 border border-purple-500/20 hover:border-purple-500/40'
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-purple-500/20 rounded-full text-white text-sm font-semibold hover:border-purple-500/40 transition-all focus:outline-none focus:border-purple-500/60"
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
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-purple-400 text-lg">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg">No events found</div>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/event/${event.$id}`}>
                    <div className="group relative bg-black/40 border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                        {event.eventContent.featuredImage && event.eventContent.featuredImage !== 'placeholder-castle-club-featured' ? (
                          <Image
                            src={event.eventContent.featuredImage}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                            <span className="text-6xl opacity-50">
                              {EVENT_TYPES.find(t => t.id === event.eventType)?.icon || '🎉'}
                            </span>
                          </div>
                        )}
                        
                        {/* Event Type Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-full border border-purple-500/40">
                          <span className="text-xs font-bold text-purple-300">
                            {EVENT_TYPES.find(t => t.id === event.eventType)?.icon}{' '}
                            {EVENT_TYPES.find(t => t.id === event.eventType)?.label}
                          </span>
                        </div>

                        {/* Booking Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
                            event.bookingStatus === 'open' ? 'bg-green-500/80 text-white' :
                            event.bookingStatus === 'limited' ? 'bg-yellow-500/80 text-white' :
                            'bg-red-500/80 text-white'
                          }`}>
                            {event.bookingStatus === 'open' ? 'Open' : 
                             event.bookingStatus === 'limited' ? 'Limited' : 
                             'Sold Out'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-purple-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                            {' • '}
                            {event.eventDetails.startTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                          {event.title}
                        </h3>

                        {/* Venue */}
                        <div className="flex items-start gap-2 text-gray-400">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{event.venueInfo.venue}</span>
                        </div>

                        {/* Capacity */}
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {event.capacity.generalRemaining + event.capacity.vipRemaining} spots left
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
                          <div className="flex items-center gap-1 text-white">
                            <Euro className="w-4 h-4" />
                            <span className="text-2xl font-black">
                              {event.pricing.earlyBird?.available 
                                ? event.pricing.earlyBird.price 
                                : event.pricing.general.price}
                            </span>
                          </div>
                          {event.pricing.earlyBird?.available && (
                            <span className="text-xs text-green-400 font-semibold">
                              Early Bird! 🎯
                            </span>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="pt-2">
                          <div className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-center group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                            Book Now →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

