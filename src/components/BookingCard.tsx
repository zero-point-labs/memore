'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, Euro, CheckCircle, XCircle, AlertCircle, MoreVertical } from 'lucide-react';
import { EventBookingDocument } from '@/types/event';
import { cn } from '@/utils/cn';

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

interface BookingCardProps {
  booking: BookingWithEvent;
  onCancel?: (bookingId: string) => void;
  cancelling?: boolean;
  className?: string;
}

export default function BookingCard({ booking, onCancel, cancelling = false, className }: BookingCardProps) {
  const [showDetails, setShowDetails] = useState(false);

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
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = new Date(booking.event.eventDate) > new Date();
  const isPast = new Date(booking.event.eventDate) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{booking.event.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(booking.event.eventDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(booking.event.eventDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{booking.event.venue}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border",
              getStatusColor(booking.bookingStatus)
            )}>
              {getStatusIcon(booking.bookingStatus)}
              {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Tickets</div>
            <div className="text-white font-bold">{booking.quantity}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Type</div>
            <div className="text-white font-medium capitalize text-sm">{booking.ticketType}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Total</div>
            <div className="text-white font-bold">
              {booking.totalPrice === 0 ? 'Free' : `€${booking.totalPrice}`}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <motion.div
          initial={false}
          animate={{ height: showDetails ? 'auto' : 0 }}
          className="overflow-hidden"
        >
          <div className="space-y-4 pt-4 border-t border-purple-500/20">
            {/* Booking Reference */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Booking Reference</div>
              <div className="text-white font-mono text-sm">{booking.bookingReference}</div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-blue-900/20 rounded-lg p-4">
                <div className="text-sm text-blue-300 font-medium mb-1">Special Requests</div>
                <div className="text-gray-300 text-sm">{booking.specialRequests}</div>
              </div>
            )}

            {/* Event Type Badge */}
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-400">Event Type:</div>
              <div className="px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-purple-300 text-sm font-medium">
                {booking.event.eventType.replace('-', ' ').toUpperCase()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                {isUpcoming && 'Upcoming Event'}
                {isPast && 'Past Event'}
                {!isUpcoming && !isPast && 'Today'}
              </div>

              {booking.bookingStatus === 'confirmed' && isUpcoming && onCancel && (
                <button
                  onClick={() => onCancel(booking.$id)}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 font-medium hover:bg-red-600/30 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
