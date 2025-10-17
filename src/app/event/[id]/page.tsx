'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { EventDocument, EVENT_TYPES, EVENT_CITIES } from '@/types/event';
import { Calendar, Clock, MapPin, Users, Euro, CheckCircle, AlertCircle } from 'lucide-react';
import EventBookingModal from '@/components/EventBookingModal';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<EventDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketType, setSelectedTicketType] = useState<'general' | 'vip'>('general');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string);
    }
  }, [params.id]);

  const fetchEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setEvent(result.data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 text-lg">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">Event not found</div>
          <a href="/events" className="text-purple-400 hover:text-purple-300">
            ← Back to Events
          </a>
        </div>
      </div>
    );
  }

  const eventType = EVENT_TYPES.find(t => t.id === event.eventType);
  const cityInfo = EVENT_CITIES.find(c => c.id === event.city);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Image Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        
        {event.eventContent.featuredImage && !event.eventContent.featuredImage.includes('placeholder') ? (
          <Image
            src={event.eventContent.featuredImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40 flex items-center justify-center">
            <span className="text-9xl opacity-30">{eventType?.icon || '🎉'}</span>
          </div>
        )}

        {/* Floating Booking Card - Desktop */}
        <div className="hidden lg:block absolute top-20 right-8 z-20 w-96">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Starting from</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  event.bookingStatus === 'open' ? 'bg-green-500/20 text-green-400' :
                  event.bookingStatus === 'limited' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {event.bookingStatus === 'open' ? 'Open' : 
                   event.bookingStatus === 'limited' ? 'Limited Spots' : 
                   'Sold Out'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <Euro className="w-6 h-6 text-white" />
                <span className="text-4xl font-black text-white">
                  {event.pricing.earlyBird?.available 
                    ? event.pricing.earlyBird.price 
                    : event.pricing.general.price}
                </span>
                {event.pricing.earlyBird?.available && (
                  <span className="text-sm text-green-400 font-semibold">Early Bird!</span>
                )}
              </div>

              {/* Ticket Type Selection */}
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTicketType('general')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTicketType === 'general'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-purple-500/20 bg-black/20 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">General Admission</div>
                      <div className="text-gray-400 text-sm">{event.capacity.generalRemaining} spots left</div>
                    </div>
                    <div className="text-white font-black text-xl">€{event.pricing.general.price}</div>
                  </div>
                </button>

                {event.pricing.vip?.available && (
                  <button
                    onClick={() => setSelectedTicketType('vip')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTicketType === 'vip'
                        ? 'border-pink-500 bg-pink-500/10'
                        : 'border-pink-500/20 bg-black/20 hover:border-pink-500/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-bold flex items-center gap-2">
                          VIP Access
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-0.5 rounded-full font-black">
                            PREMIUM
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">{event.capacity.vipRemaining} spots left</div>
                      </div>
                      <div className="text-white font-black text-xl">€{event.pricing.vip.price}</div>
                    </div>
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                disabled={event.bookingStatus === 'sold-out'}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {event.bookingStatus === 'sold-out' ? 'Sold Out' : 'Book Now'}
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Secure payment • Instant confirmation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto lg:mr-[28rem]">
            
            {/* Event Title & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <a href="/events" className="hover:text-purple-400">Events</a>
                <span>→</span>
                <span className="text-purple-400">{eventType?.label}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
                {event.title}
              </h1>

              {/* Key Info Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="text-white font-semibold">
                      {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-gray-400">Time</div>
                    <div className="text-white font-semibold">{event.eventDetails.startTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-gray-400">City</div>
                    <div className="text-white font-semibold">{cityInfo?.label}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-gray-400">Spots Left</div>
                    <div className="text-white font-semibold">
                      {event.capacity.generalRemaining + event.capacity.vipRemaining}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed">
                {event.description}
              </p>
            </motion.div>

            {/* Venue Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12 p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-400" />
                Venue
              </h3>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-purple-400">{event.venueInfo.venue}</p>
                {event.venueInfo.venueAddress && (
                  <p className="text-gray-400">{event.venueInfo.venueAddress}</p>
                )}
              </div>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-6">What&apos;s Included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {event.eventContent.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Event Highlights</h3>
              <div className="space-y-3">
                {event.eventContent.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                    <span className="text-2xl flex-shrink-0">✨</span>
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lineup (if available) */}
            {event.eventContent.lineup && event.eventContent.lineup.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Artist Lineup</h3>
                <div className="flex flex-wrap gap-3">
                  {event.eventContent.lineup.map((artist, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-white font-semibold"
                    >
                      🎵 {artist}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIP Benefits (if VIP available) */}
            {event.pricing.vip?.available && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12 p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-3xl">👑</span>
                  VIP Benefits
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {event.pricing.vip.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Requirements */}
            {(event.eventDetails.ageRestriction || event.eventDetails.dresscode || event.eventContent.requirements) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Requirements & Info</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-semibold">Age Restriction: </span>
                      <span className="text-gray-300">{event.eventDetails.ageRestriction}+ only</span>
                    </div>
                  </div>

                  {event.eventDetails.dresscode && (
                    <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">Dress Code: </span>
                        <span className="text-gray-300">{event.eventDetails.dresscode}</span>
                      </div>
                    </div>
                  )}

                  {event.eventContent.requirements?.map((req, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{req}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Cancellation Policy */}
            {event.eventDetails.cancellationPolicy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-12 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-3">Cancellation Policy</h3>
                <p className="text-gray-300">{event.eventDetails.cancellationPolicy}</p>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-purple-500/30 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-400">From</div>
            <div className="flex items-baseline gap-1">
              <Euro className="w-4 h-4 text-white" />
              <span className="text-2xl font-black text-white">
                {event.pricing.earlyBird?.available 
                  ? event.pricing.earlyBird.price 
                  : event.pricing.general.price}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            disabled={event.bookingStatus === 'sold-out'}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {event.bookingStatus === 'sold-out' ? 'Sold Out' : 'Book Now'}
          </button>
        </div>
      </div>

      {/* Event Booking Modal */}
      {event && (
        <EventBookingModal
          event={event}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}

    </div>
  );
}

