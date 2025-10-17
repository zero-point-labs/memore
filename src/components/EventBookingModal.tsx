'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { EventDocument } from '@/types/event';
import EventBookingForm from './EventBookingForm';

interface EventBookingModalProps {
  event: EventDocument;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventBookingModal({ event, isOpen, onClose }: EventBookingModalProps) {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const handleBookingSuccess = (reference: string) => {
    setBookingReference(reference);
    setBookingSuccess(true);
  };

  const handleClose = () => {
    setBookingSuccess(false);
    setBookingReference('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!bookingSuccess ? (
              <>
                {/* Event Summary Header */}
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/20 rounded-t-2xl p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Event Image */}
                    <div className="relative h-48 lg:h-64 rounded-xl overflow-hidden">
                      <img
                        src={event.eventContent.featuredImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                        {event.eventType.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                        <p className="text-gray-300 text-sm">{event.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span>{new Date(event.eventDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span>{event.eventDetails.startTime} - {event.eventDetails.endTime}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span>{event.venueInfo.venue}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span>
                            {event.capacity.generalRemaining + event.capacity.vipRemaining} spots available
                          </span>
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <div className="bg-black/30 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">Pricing</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">General:</span>
                            <span className="text-white">
                              {event.pricing.general.price === 0 ? 'Free' : `€${event.pricing.general.price}`}
                            </span>
                          </div>
                          {event.pricing.vip?.available && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">VIP:</span>
                              <span className="text-white">€{event.pricing.vip.price}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="bg-black/40 backdrop-blur-xl border-x border-b border-purple-500/20 rounded-b-2xl">
                  <EventBookingForm
                    event={event}
                    onSuccess={handleBookingSuccess}
                    onCancel={handleClose}
                  />
                </div>
              </>
            ) : (
              /* Success State */
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">Booking Confirmed!</h3>
                  <p className="text-gray-300 mb-6">
                    Your spot has been reserved for <strong>{event.title}</strong>
                  </p>

                  <div className="bg-purple-900/20 rounded-lg p-4 mb-6">
                    <div className="text-sm text-gray-400 mb-2">Booking Reference</div>
                    <div className="text-white font-mono text-lg">{bookingReference}</div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-300 mb-8">
                    <p>✓ Confirmation email sent to your inbox</p>
                    <p>✓ Event details and venue information included</p>
                    <p>✓ QR code for easy check-in (if applicable)</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleClose}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => window.location.href = '/account/event-bookings'}
                      className="px-6 py-3 bg-gray-600 rounded-lg text-white font-medium hover:bg-gray-500 transition-colors"
                    >
                      View My Bookings
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
