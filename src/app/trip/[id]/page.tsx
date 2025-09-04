'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Users, Check, ArrowRight, Clock, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BookingFormPopup from '@/components/BookingFormPopup';
import TripImageCarousel from '@/components/trip-elements/TripImageCarousel';
import TripDetailsCard from '@/components/trip-elements/TripDetailsCard';
import { tripService } from '@/services/tripService';
import { TripDocument } from '@/types/trip';

import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import BlurFade from '@/components/ui/BlurFade';
import { fadeInUp, fadeIn } from '@/utils/animationVariants';
import { cn } from '@/utils/cn';
import TripAboutCard from '@/components/trip-elements/TripAboutCard';
import { BorderBeam } from '@/components/magicui/border-beam';
import EnhancedGetStartedButton from '@/components/EnhancedGetStartedButton';

// Note: Trip data now comes from database via tripService.getTrip() (ID-based)



// Booking form component
function BookingForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    packageType: 'Standard',
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
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Book Your Adventure</h3>
        <p className="text-gray-400">Secure your spot in just a few steps</p>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-4 mt-6">
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
              <label className="block text-white font-medium mb-2">Package Type</label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
              >
                <option value="Standard">Standard Package</option>
                <option value="Premium">Premium Package</option>
                <option value="VIP">VIP Package</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Room Preference</label>
              <select
                name="roomPreference"
                value={formData.roomPreference}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
              >
                <option value="twin">Twin Beds</option>
                <option value="double">Double Bed</option>
                <option value="single">Single Room (+€50/night)</option>
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
                  <span>Package:</span>
                  <span>{formData.packageType}</span>
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
  );
}

// Expandable Cards Component for Trip Information
const ExpandableCardsSection = ({ 
  trip, 
  selectedDay, 
  setSelectedDay 
}: { 
  trip: TripDocument; 
  selectedDay: number; 
  setSelectedDay: (day: number) => void; 
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const cards = [
    {
      id: 'trip-details',
      icon: '🏖️',
      title: 'Trip Details & Information',
      subtitle: 'Duration, pricing & what\'s included',
      preview: `${trip.duration} days in ${trip.location.split(',')[0]}`,
      content: (
        <div className="space-y-6">
          <TripAboutCard trip={trip} />
        </div>
      )
    },
    {
      id: 'itinerary',
      icon: '📅',
      title: 'Detailed Trip Itinerary',
      subtitle: 'Day-by-day adventure breakdown',
      preview: `${trip.itinerary.length} action-packed days planned`,
      content: (
        <div className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-4 mb-8 overflow-x-auto">
            {trip.itinerary.map((day, index) => (
              <motion.button
                key={day.day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  "px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap text-sm sm:text-base",
                  selectedDay === index
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-black/40 border border-purple-500/30 text-gray-300 hover:border-purple-500/50"
                )}
              >
                <div className="text-center">
                  <div>{day.day}</div>
                  {day.date && <div className="text-xs opacity-80 hidden sm:block">{day.date}</div>}
                </div>
              </motion.button>
            ))}
          </div>
          
          {trip.itinerary.length > 0 && trip.itinerary[selectedDay] && (
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-purple-400 mb-2">
                  {trip.itinerary[selectedDay].title}
                </h4>
                {trip.itinerary[selectedDay].theme && (
                  <p className="text-gray-400 italic">{trip.itinerary[selectedDay].theme}</p>
                )}
              </div>

              <div className="space-y-4">
                {trip.itinerary[selectedDay].items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                          <span className="text-lg">{item.icon}</span>
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-purple-400 font-bold text-xs">{item.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-white mb-1">{item.activity}</h5>
                        {item.description && (
                          <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                        )}
                        
                        {item.included && item.included.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.included.map((include, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full"
                              >
                                <Check className="w-3 h-3" />
                                {include}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'gallery',
      icon: '📸',
      title: 'Trip Preview Gallery',
      subtitle: 'See what awaits you on this adventure',
      preview: `${trip.gallery.length} breathtaking images`,
      content: (
        <div className="space-y-6">
          <TripImageCarousel 
            images={trip.gallery}
            className="w-full max-w-4xl mx-auto" 
            autoPlay={true} 
            autoPlayInterval={4000}
            showControls={true}
            showDots={true}
          />
          <div className="text-center">
            <p className="text-gray-400 text-lg">Swipe through memories from our Cyprus adventures</p>
            <p className="text-purple-300 text-sm mt-2">✨ Every photo tells a story of incredible experiences</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-950/20 to-pink-950/20">
      <div className="absolute inset-0">
        <Meteors number={6} />
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              DISCOVER <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">MORE DETAILS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expand each section to explore comprehensive trip information, detailed itineraries, and stunning gallery
            </p>
          </div>
        </BlurFade>

        <div className="max-w-5xl mx-auto space-y-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300"
            >
              {/* Card Header */}
              <motion.button
                onClick={() => toggleCard(card.id)}
                className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-inset"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <motion.span 
                      className="text-4xl"
                      animate={{ 
                        rotate: expandedCard === card.id ? [0, 10, -10, 0] : 0,
                        scale: expandedCard === card.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.icon}
                    </motion.span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{card.title}</h3>
                      <p className="text-gray-400 text-sm sm:text-base">{card.subtitle}</p>
                      <p className="text-purple-300 text-sm sm:text-base font-medium mt-1">{card.preview}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: expandedCard === card.id ? 180 : 0,
                      color: expandedCard === card.id ? '#a855f7' : '#9ca3af'
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl"
                  >
                    ⌄
                  </motion.div>
                </div>
              </motion.button>

              {/* Expandable Content */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedCard === card.id ? "auto" : 0,
                  opacity: expandedCard === card.id ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 border-t border-purple-500/10">
                  <div className="pt-6">
                    {card.content}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function TripPage() {
  const params = useParams();
  const tripId = params.id as string;
  
  const [selectedDay, setSelectedDay] = useState(0);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const [trip, setTrip] = useState<TripDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<TripDocument[]>([]);
  const [previousTrips, setPreviousTrips] = useState<TripDocument[]>([]);
  const [otherTripsLoading, setOtherTripsLoading] = useState(true);

  // Fetch trip data
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const tripData = await tripService.getTrip(tripId);
        if (!tripData) {
          setError('Trip not found');
        } else {
          setTrip(tripData);
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  // Fetch other trips for browsing (exclude current trip)
  useEffect(() => {
    const fetchOtherTrips = async () => {
      try {
        const [upcoming, previous] = await Promise.all([
          tripService.getUpcomingTrips(false), // Get all upcoming trips (don't exclude next trip)
          tripService.getPreviousTrips(10)     // Get last 10 previous trips
        ]);
        
        // Filter out current trip from both lists
        const filteredUpcoming = upcoming.filter(t => t.$id !== tripId);
        const filteredPrevious = previous.filter(t => t.$id !== tripId);
        
        setUpcomingTrips(filteredUpcoming);
        setPreviousTrips(filteredPrevious);
      } catch (error) {
        console.error('Error fetching other trips:', error);
      } finally {
        setOtherTripsLoading(false);
      }
    };

    if (tripId) {
      fetchOtherTrips();
    }
  }, [tripId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <div className="text-white">Loading trip details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !trip) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">{error || 'Trip not found'}</div>
            <Link
              href="/next-trip"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-lg text-white font-medium hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate if trip is in the future or past
  const now = new Date();
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isPast = endDate < now;

  const tripStatus = isUpcoming ? 'upcoming' : isOngoing ? 'ongoing' : 'completed';
  const statusColors = {
    upcoming: 'text-green-400 bg-green-500/20',
    ongoing: 'text-yellow-400 bg-yellow-500/20',
    completed: 'text-gray-400 bg-gray-500/20'
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden pt-24 sm:pt-28">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/0806.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-6"
            >
              <motion.div
                variants={fadeIn}
                className="flex items-center justify-center gap-4 mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
                  <span className="text-lg">📍</span>
                  <span className="text-purple-300 text-sm font-medium">
                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </span>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[tripStatus]}`}>
                  {tripStatus.charAt(0).toUpperCase() + tripStatus.slice(1)}
                </div>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
                {trip.title.toUpperCase()}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {isUpcoming ? 'AWAITS YOU' : isPast ? 'MEMORIES' : 'HAPPENING NOW'}
                </span>
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {trip.description}
              </p>

              <div className="flex flex-wrap gap-6 justify-center text-gray-300">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  {trip.location}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  {trip.duration} Days
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  {isUpcoming ? 'Limited to' : 'Hosted'} {trip.availability.totalSpots} Students
                </span>
              </div>

              {isUpcoming && (
                <div className="flex justify-center">
                <EnhancedGetStartedButton 
                  onClick={() => setIsBookingPopupOpen(true)}
                  className="shadow-2xl hover:shadow-purple-500/25"
                />
                </div>
              )}
              
              {isPast && (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">This amazing adventure has concluded</p>
                  <Link
                    href="/next-trip"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 font-medium hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <Star className="w-4 h-4" />
                    Explore Upcoming Trips
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trip Overview */}
      <section className="relative py-32 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Meteors number={6} />
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                {isUpcoming ? 'WHAT MAKES THIS' : isPast ? 'WHAT MADE THIS' : 'WHAT MAKES THIS'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPECIAL</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {isUpcoming 
                  ? "This isn't just another student trip. It's a carefully curated experience designed to create lifelong memories."
                  : isPast
                  ? "This was an incredible journey that created unforgettable memories for all participants."
                  : "An amazing experience happening right now!"
                }
              </p>
            </div>
          </BlurFade>

          <div className="flex justify-center">
            {/* Trip Details Card - Full Width on Desktop */}
            <BlurFade delay={0.3}>
              <div className="w-full max-w-4xl">
              <TripDetailsCard trip={trip} />
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Expandable Trip Information Cards */}
      <ExpandableCardsSection 
        trip={trip} 
        selectedDay={selectedDay} 
        setSelectedDay={setSelectedDay} 
      />

      {/* Booking Section - Only show for upcoming trips */}
      {isUpcoming && (
        <section id="booking" className="relative py-32 bg-gradient-to-br from-purple-950/30 to-pink-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
          <BlurFade delay={0.1}>
                <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                    SECURE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPOT NOW</span>
              </h2>
                  <p className="text-xl text-gray-300">
                    Only <NumberTicker value={trip.availability.spotsRemaining} className="text-purple-400 font-bold" /> spots remaining for this exclusive experience!
              </p>
            </div>
          </BlurFade>

              <BookingForm />
                </div>
          </div>
        </section>
      )}

      {/* Other Trips Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-purple-950/10 to-black">
        <div className="absolute inset-0">
          <Meteors number={4} />
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                EXPLORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">MORE TRIPS</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover upcoming adventures and relive amazing memories from past trips
              </p>
            </div>
          </BlurFade>

          {!otherTripsLoading && (upcomingTrips.length > 0 || previousTrips.length > 0) && (
            <div className="space-y-16">
              {/* Upcoming Trips */}
              {upcomingTrips.length > 0 && (
          <BlurFade delay={0.2}>
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <h3 className="text-2xl font-bold text-white">Upcoming Adventures</h3>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingTrips.slice(0, 6).map((tripItem, index) => (
                        <motion.div
                          key={tripItem.$id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <Link href={`/trip/${tripItem.$id}`}>
                            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 cursor-pointer">
                              {/* Trip Image */}
                              {tripItem.gallery && tripItem.gallery.length > 0 && (
                                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                                  <img
                                    src={typeof tripItem.gallery[0] === 'string' ? tripItem.gallery[0] : tripItem.gallery[0].url}
                                    alt={tripItem.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                  <div className="absolute bottom-3 left-3">
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                                      Upcoming
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Trip Info */}
                              <div className="space-y-3">
                                <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                  {tripItem.title}
                                </h4>
                                
                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {tripItem.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    {tripItem.location.split(',')[0]}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-pink-400" />
                                    {tripItem.duration} days
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                                  <div className="text-sm text-gray-400">
                                    {new Date(tripItem.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <div className="flex items-center gap-1 text-purple-300 group-hover:text-white transition-colors">
                                    <span className="text-sm font-medium">Explore</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
            </div>
          </BlurFade>
              )}
              
              {/* Previous Trips */}
              {previousTrips.length > 0 && (
                <BlurFade delay={0.3}>
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <h3 className="text-2xl font-bold text-white">Past Adventures</h3>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-pink-500/50 to-transparent" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {previousTrips.slice(0, 6).map((tripItem, index) => (
                        <motion.div
                          key={tripItem.$id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="group"
                        >
                          <Link href={`/trip/${tripItem.$id}`}>
                            <div className="bg-gradient-to-br from-gray-900/40 to-purple-900/20 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 cursor-pointer">
                              {/* Trip Image */}
                              {tripItem.gallery && tripItem.gallery.length > 0 && (
                                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                                  <img
                                    src={typeof tripItem.gallery[0] === 'string' ? tripItem.gallery[0] : tripItem.gallery[0].url}
                                    alt={tripItem.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 grayscale-[30%] group-hover:grayscale-0"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                  <div className="absolute bottom-3 left-3">
                                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-medium rounded-full border border-gray-500/30">
                                      Completed
                                    </span>
                                  </div>
        </div>
                              )}
                              
                              {/* Trip Info */}
                              <div className="space-y-3">
                                <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                  {tripItem.title}
                                </h4>
                                
                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {tripItem.description}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    {tripItem.location.split(',')[0]}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-pink-400" />
                                    {tripItem.duration} days
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-gray-500/20">
                                  <div className="text-sm text-gray-400">
                                    {new Date(tripItem.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-300 group-hover:text-purple-300 transition-colors">
                                    <span className="text-sm font-medium">View Memories</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                </div>
              </BlurFade>
              )}
            </div>
          )}

          {/* Loading State for Other Trips */}
          {otherTripsLoading && (
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading more trips...</p>
            </div>
          )}

          {/* No Other Trips */}
          {!otherTripsLoading && upcomingTrips.length === 0 && previousTrips.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">More trips coming soon! Stay tuned for amazing adventures.</p>
            </div>
          )}
          </div>
        </section>

      <Footer />
      
      {/* Booking Form Popup - Only for upcoming trips */}
      {isUpcoming && (
        <BookingFormPopup 
          isOpen={isBookingPopupOpen}
          onClose={() => setIsBookingPopupOpen(false)}
        />
      )}
    </div>
  );
}
