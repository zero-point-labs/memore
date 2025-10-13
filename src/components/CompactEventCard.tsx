'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import { EventDocument, EVENT_TYPES } from '@/types/event';

interface CompactEventCardProps {
  event: EventDocument;
  index?: number;
}

export default function CompactEventCard({ event, index = 0 }: CompactEventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/event/${event.$id}`}>
        <div className="group relative bg-black/40 border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full">
          {/* Header with Icon and Status */}
          <div className="relative p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              {/* Event Type Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl flex items-center justify-center border border-purple-500/40">
                <span className="text-3xl">
                  {EVENT_TYPES.find(t => t.id === event.eventType)?.icon || '🎉'}
                </span>
              </div>

              {/* Booking Status Badge */}
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

            {/* Event Type Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full mb-4">
              <span className="text-xs font-bold text-purple-300">
                {EVENT_TYPES.find(t => t.id === event.eventType)?.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
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
            <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all line-clamp-2 min-h-[3.5rem]">
              {event.title}
            </h3>

            {/* Venue */}
            <div className="flex items-start gap-2 text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm line-clamp-2">{event.venueInfo.venue}</span>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {event.capacity.generalRemaining + event.capacity.vipRemaining} spots left
              </span>
            </div>

            {/* Price and CTA */}
            <div className="space-y-3 pt-2 border-t border-purple-500/20">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-white">
                  <Euro className="w-4 h-4" />
                  <span className="text-xl font-black">
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
              <div className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-sm text-center group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                More Info →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
