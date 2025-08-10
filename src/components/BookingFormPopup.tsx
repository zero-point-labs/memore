'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BookingFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingFormPopup({ isOpen, onClose }: BookingFormPopupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    transportPreference: 'bus',
    roomPreference: 'twin',
    dietaryRequirements: '',
    emergencyContact: '',
    specialRequests: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Booking submitted successfully! We\'ll contact you within 24 hours.');
    setIsSubmitting(false);
    onClose();
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      university: '',
      transportPreference: 'bus',
      roomPreference: 'twin',
      dietaryRequirements: '',
      emergencyContact: '',
      specialRequests: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-sm border border-purple-500/20 rounded-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-purple-500/20 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Book Your Adventure</h3>
                  <p className="text-gray-400">Secure your spot in just a few steps</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-white/5 border border-purple-500/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress indicator */}
              <div className="px-6 pt-4">
                <div className="flex items-center gap-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                        currentStep >= step ? "bg-purple-600 text-white" : "bg-gray-600 text-gray-400"
                      )}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={cn(
                          "w-12 h-0.5 ml-2 transition-colors",
                          currentStep > step ? "bg-purple-600" : "bg-gray-600"
                        )} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2">First Name</label>
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
                          <label className="block text-white font-medium mb-2">Last Name</label>
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
                        <label className="block text-white font-medium mb-2">Email</label>
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
                        <label className="block text-white font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">University</label>
                        <input
                          type="text"
                          name="university"
                          value={formData.university}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-white font-medium mb-2">Transportation Preference</label>
                        <select
                          name="transportPreference"
                          value={formData.transportPreference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40 [&>option]:bg-black [&>option]:text-white"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="bus" className="bg-black text-white">Provided Bus Transportation</option>
                          <option value="own_car" className="bg-black text-white">Own Car</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Room Preference</label>
                        <select
                          name="roomPreference"
                          value={formData.roomPreference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40 [&>option]:bg-black [&>option]:text-white"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="twin" className="bg-black text-white">Twin Beds</option>
                          <option value="double" className="bg-black text-white">Double Bed</option>
                          <option value="single" className="bg-black text-white">Single Room (+€50/night)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Dietary Requirements</label>
                        <textarea
                          name="dietaryRequirements"
                          value={formData.dietaryRequirements}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                          placeholder="Any allergies or dietary preferences..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Emergency Contact</label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                          placeholder="Name and phone number"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-white font-medium mb-2">Special Requests</label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                          placeholder="Any special requests or preferences for your trip..."
                        />
                      </div>
                      
                      {/* Booking Summary */}
                      <div className="bg-purple-900/20 rounded-lg p-6">
                        <h4 className="text-white font-bold mb-4">Booking Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-300">
                            <span>Transport:</span>
                            <span>{formData.transportPreference === 'bus' ? 'Provided Bus' : 'Own Car'}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Room:</span>
                            <span>{formData.roomPreference}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Duration:</span>
                            <span>3 Days / 2 Nights</span>
                          </div>
                          <hr className="border-purple-500/20 my-3" />
                          <div className="flex justify-between text-white font-bold">
                            <span>Status:</span>
                            <span>Pricing available upon request</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation buttons */}
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium ml-auto"
                      >
                        Next Step
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processing...' : 'Complete Booking'}
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}