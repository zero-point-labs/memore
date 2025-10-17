'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Euro, Clock } from 'lucide-react';
import { EventDocument, EVENT_TYPES } from '@/types/event';

interface MainEventCardProps {
  event: EventDocument;
}

export default function MainEventCard({ event }: MainEventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="col-span-full"
    >
      <Link href={`/event/${event.$id}`}>
        <div className="group cursor-pointer">
          {/* Mobile Layout: Image + Separate Card */}
          <div className="sm:hidden">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-900 rounded-t-3xl">
              {event.eventContent.featuredImage && !event.eventContent.featuredImage.includes('placeholder') ? (
                <Image
                  src={event.eventContent.featuredImage}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40 flex items-center justify-center">
                  <span className="text-8xl opacity-50">
                    {EVENT_TYPES.find(t => t.id === event.eventType)?.icon || '🎉'}
                  </span>
                </div>
              )}
              
              {/* Badges on Image */}
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-full border border-purple-500/40">
                <span className="text-xs font-bold text-purple-300">
                  {EVENT_TYPES.find(t => t.id === event.eventType)?.icon}{' '}
                  {EVENT_TYPES.find(t => t.id === event.eventType)?.label}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
                  event.bookingStatus === 'open' ? 'bg-green-500/80 text-white' :
                  event.bookingStatus === 'limited' ? 'bg-yellow-500/80 text-white' :
                  'bg-red-500/80 text-white'
                }`}>
                  {event.bookingStatus === 'open' ? 'Available' : 
                   event.bookingStatus === 'limited' ? 'Limited' : 
                   'Sold Out'}
                </span>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-black/40 border border-purple-500/20 border-t-0 rounded-b-3xl p-6 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              {/* Date & Time */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-pink-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">{event.eventDetails.startTime}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                {event.title}
              </h3>

              {/* Venue */}
              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-sm font-medium">{event.venueInfo.venue}</span>
              </div>

              {/* Bottom Row: Price, Capacity, CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Price */}
                  <div className="flex items-center gap-1">
                    <Euro className="w-4 h-4 text-green-400" />
                    <span className="text-xl font-black text-white">
                      {event.pricing.earlyBird?.available 
                        ? event.pricing.earlyBird.price 
                        : event.pricing.general.price}
                    </span>
                  </div>
                  
                  {/* Capacity */}
                  <div className="flex items-center gap-1 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {event.capacity.generalRemaining + event.capacity.vipRemaining}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-sm group-hover:from-purple-500 group-hover:to-pink-500 transition-all">
                  Book Now →
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout: Original Overlay Style */}
          <div className="hidden sm:block bg-black/40 border border-purple-500/20 rounded-3xl overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="relative aspect-[16/7] lg:aspect-[21/8] overflow-hidden bg-gray-900">
              {event.eventContent.featuredImage && !event.eventContent.featuredImage.includes('placeholder') ? (
                <Image
                  src={event.eventContent.featuredImage}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40 flex items-center justify-center">
                  <span className="text-9xl opacity-50">
                    {EVENT_TYPES.find(t => t.id === event.eventType)?.icon || '🎉'}
                  </span>
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Event Type Badge */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full border border-purple-500/40">
                <span className="text-sm font-bold text-purple-300">
                  {EVENT_TYPES.find(t => t.id === event.eventType)?.icon}{' '}
                  {EVENT_TYPES.find(t => t.id === event.eventType)?.label}
                </span>
              </div>

              {/* Booking Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                  event.bookingStatus === 'open' ? 'bg-green-500/80 text-white' :
                  event.bookingStatus === 'limited' ? 'bg-yellow-500/80 text-white' :
                  'bg-red-500/80 text-white'
                }`}>
                  {event.bookingStatus === 'open' ? 'Tickets Available' : 
                   event.bookingStatus === 'limited' ? 'Limited Tickets' : 
                   'Sold Out'}
                </span>
              </div>

              {/* Desktop Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="max-w-4xl">
                  {/* Date & Time */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-purple-400 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-pink-400 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">{event.eventDetails.startTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  {event.eventContent.description && (
                    <p className="text-gray-300 text-base lg:text-lg mb-6 line-clamp-2 max-w-3xl">
                      {event.eventContent.description}
                    </p>
                  )}

                  {/* Details Row */}
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    {/* Venue */}
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">{event.venueInfo.venue}</span>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-5 h-5 text-pink-400" />
                      <span className="font-medium">
                        {event.capacity.generalRemaining + event.capacity.vipRemaining} spots left
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <Euro className="w-5 h-5 text-green-400" />
                      <span className="text-2xl font-black text-white">
                        {event.pricing.earlyBird?.available 
                          ? event.pricing.earlyBird.price 
                          : event.pricing.general.price}
                      </span>
                      {event.pricing.earlyBird?.available && (
                        <span className="text-sm text-green-400 font-semibold bg-green-400/20 px-2 py-1 rounded-full">
                          Early Bird! 🎯
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex">
                    <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg group-hover:from-purple-500 group-hover:to-pink-500 transition-all shadow-2xl">
                      Book Now
                      <span className="text-xl">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
