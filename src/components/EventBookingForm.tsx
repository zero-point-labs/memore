'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Ticket, Euro, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { EventDocument, TicketType, calculateEventBookingTotal, generateBookingReference } from '@/types/event';
import { cn } from '@/utils/cn';

interface EventBookingFormProps {
  event: EventDocument;
  onSuccess: (bookingReference: string) => void;
  onCancel: () => void;
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketType: TicketType;
  quantity: number;
  specialRequests: string;
}

export default function EventBookingForm({ event, onSuccess, onCancel }: EventBookingFormProps) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketType: 'general',
    quantity: 1,
    specialRequests: ''
  });

  // Pre-fill form with user data
  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || user.email || '',
        phone: profile.phone || '',
      }));
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [user, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.email.includes('@') && formData.phone);
      case 2:
        return formData.quantity > 0 && formData.quantity <= 10;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateTotal = () => {
    return calculateEventBookingTotal(formData.ticketType, formData.quantity, event.pricing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      setError('Please log in to book events');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const totalPrice = calculateTotal();
      const bookingReference = generateBookingReference();

      const bookingData = {
        eventId: event.$id,
        userId: user.$id,
        userProfileId: profile.$id,
        ticketType: formData.ticketType,
        quantity: formData.quantity,
        totalPrice,
        currency: 'EUR',
        specialRequests: formData.specialRequests,
        bookingReference
      };

      // Create booking via API
      const response = await fetch(`/api/events/${event.$id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.$id}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const result = await response.json();
      
      if (result.success) {
        onSuccess(bookingReference);
      } else {
        throw new Error(result.error || 'Booking failed');
      }

    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const isFreeEvent = event.pricing.general.price === 0;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Book Your Spot</h2>
        <p className="text-gray-400">Complete your booking in just a few steps</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center gap-2 sm:gap-4 mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${
                currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-6 sm:w-12 h-0.5 ml-1 sm:ml-2 transition-colors ${
                  currentStep > step ? 'bg-purple-600' : 'bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-xs sm:text-sm text-gray-400">
          {currentStep === 1 && 'Personal Information'}
          {currentStep === 2 && 'Ticket Selection'}
          {currentStep === 3 && 'Review & Confirm'}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                required
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Ticket Selection */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-white font-medium mb-4">
                <Ticket className="inline w-4 h-4 mr-2" />
                Select Ticket Type
              </label>
              <div className="space-y-3">
                {/* General Ticket */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, ticketType: 'general' }))}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all text-left",
                    formData.ticketType === 'general'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-500/20 bg-black/20 hover:border-blue-500/40'
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">General Access</div>
                      <div className="text-gray-400 text-sm">
                        {event.capacity.generalRemaining} spots left
                      </div>
                    </div>
                    <div className="text-white font-black text-xl">
                      {isFreeEvent ? 'Free' : `€${event.pricing.general.price}`}
                    </div>
                  </div>
                </button>

                {/* VIP Ticket */}
                {event.pricing.vip?.available && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ticketType: 'vip' }))}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-left",
                      formData.ticketType === 'vip'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-purple-500/20 bg-black/20 hover:border-purple-500/40'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-bold flex items-center gap-2">
                          VIP Access
                          <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-0.5 rounded-full font-black">
                            PREMIUM
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {event.capacity.vipRemaining} spots left
                        </div>
                      </div>
                      <div className="text-white font-black text-xl">
                        €{event.pricing.vip.price}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Quantity *
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                  className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-20 px-3 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white text-center focus:outline-none focus:border-purple-500/40"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: Math.min(10, prev.quantity + 1) }))}
                  className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <MessageSquare className="inline w-4 h-4 mr-2" />
                Special Requests
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any dietary requirements, accessibility needs, or special requests..."
                className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-purple-900/20 rounded-lg p-6">
              <h4 className="text-white font-bold mb-4">Booking Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Event:</span>
                  <span className="text-white">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Venue:</span>
                  <span className="text-white">{event.venueInfo.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ticket Type:</span>
                  <span className="text-white capitalize">{formData.ticketType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="text-white">{formData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-lg">
                    {isFreeEvent ? 'Free' : `€${calculateTotal()}`}
                  </span>
                </div>
              </div>
            </div>

            {formData.specialRequests && (
              <div className="bg-blue-900/20 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">Special Requests:</h5>
                <p className="text-gray-300 text-sm">{formData.specialRequests}</p>
              </div>
            )}

            <div className="bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-300 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Your booking will be confirmed immediately</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                You'll receive a confirmation email with all the details
              </p>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={prevStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-600 rounded-lg text-white font-medium hover:bg-gray-500 transition-colors"
            >
              Previous
            </motion.button>
          )}
          
          {currentStep < 3 ? (
            <motion.button
              type="button"
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Booking...' : 'Confirm Booking'}
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
}
