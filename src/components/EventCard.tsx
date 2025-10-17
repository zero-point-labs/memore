'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import { EventDocument, EVENT_TYPES } from '@/types/event';

interface EventCardProps {
  event: EventDocument;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/event/${event.$id}`}>
        <div className="group relative bg-black/40 border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
            {event.eventContent.featuredImage && !event.eventContent.featuredImage.includes('placeholder') ? (
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
            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all line-clamp-2">
              {event.title}
            </h3>

            {/* Venue */}
            <div className="flex items-start gap-2 text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{event.venueInfo.venue}</span>
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
  );
}

