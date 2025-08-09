'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Calendar, Users, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveCyprusMap from '@/components/trip-elements/InteractiveCyprusMap';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import BlurFade from '@/components/ui/BlurFade';
import { fadeInUp, fadeIn } from '@/utils/animationVariants';
import { cn } from '@/utils/cn';

// Extended itinerary data
const detailedItinerary = [
  {
    day: 'Day 1',
    date: 'Friday, May 24th',
    title: 'Arrival & Welcome Party',
    theme: 'Welcome to Paradise',
    items: [
      { 
        time: '12:00', 
        activity: 'Airport VIP Pickup & Transfer', 
        icon: '✈️',
        description: 'Private transport with welcome drinks and Cyprus orientation',
        included: ['VIP airport lounge access', 'Welcome drink', 'Cyprus guide booklet']
      },
      { 
        time: '14:00', 
        activity: 'Check-in at Beachfront Resort', 
        icon: '🏨',
        description: 'Luxury accommodation with sea views and welcome packages',
        included: ['Ocean view room', 'Welcome gift bag', 'Resort orientation']
      },
      { 
        time: '16:00', 
        activity: 'Group Meet & Greet Pool Party', 
        icon: '🏊',
        description: 'Ice-breaking activities and first-day celebrations',
        included: ['Pool games', 'Welcome cocktails', 'Photo session']
      },
      { 
        time: '18:00', 
        activity: 'Sunset Beach BBQ', 
        icon: '🌅',
        description: 'Traditional Cypriot BBQ on the beach with live music',
        included: ['Cypriot BBQ feast', 'Live acoustic music', 'Beach games']
      },
      { 
        time: '22:00', 
        activity: 'VIP Club Night at Castle Club', 
        icon: '🎊',
        description: 'Skip-the-line access and VIP booth experience',
        included: ['VIP table', 'Bottle service', 'Skip-the-line access']
      },
    ]
  },
  {
    day: 'Day 2',
    date: 'Saturday, May 25th',
    title: 'Adventure & Culture Day',
    theme: 'Explore & Discover',
    items: [
      { 
        time: '09:00', 
        activity: 'Recovery Breakfast & Spa Time', 
        icon: '☕',
        description: 'Hangover breakfast and optional spa treatments',
        included: ['Full breakfast', 'Spa access', 'Pool relaxation']
      },
      { 
        time: '11:00', 
        activity: 'Water Sports Adventure', 
        icon: '🏄',
        description: 'Jet skiing, parasailing, and cliff jumping at Cape Greco',
        included: ['Equipment rental', 'Professional instruction', 'Safety gear']
      },
      { 
        time: '15:00', 
        activity: 'Ancient Kourion & Wine Tasting', 
        icon: '🏛️',
        description: 'Historical tour followed by Cypriot wine experience',
        included: ['Guided tour', 'Wine tasting session', 'Historical insights']
      },
      { 
        time: '19:00', 
        activity: 'Traditional Village Dinner', 
        icon: '🍽️',
        description: 'Authentic Cypriot cuisine in a traditional village setting',
        included: ['Multi-course dinner', 'Cultural show', 'Local music']
      },
      { 
        time: '23:00', 
        activity: 'Ayia Napa Bar Crawl', 
        icon: '🍻',
        description: 'VIP access to the best bars and clubs in Ayia Napa',
        included: ['5 venues', 'VIP entry', 'Welcome drinks']
      },
    ]
  },
  {
    day: 'Day 3',
    date: 'Sunday, May 26th',
    title: 'Yacht Party & Farewell',
    theme: 'Grand Finale',
    items: [
      { 
        time: '10:00', 
        activity: 'Luxury Yacht Charter', 
        icon: '🚤',
        description: 'Private yacht with DJ, drinks, and Mediterranean views',
        included: ['Luxury yacht', 'DJ & sound system', 'Open bar']
      },
      { 
        time: '14:00', 
        activity: 'Beach Club Hopping', 
        icon: '🏖️',
        description: 'VIP access to exclusive beach clubs and infinity pools',
        included: ['3 beach clubs', 'Pool access', 'VIP loungers']
      },
      { 
        time: '17:00', 
        activity: 'Golden Hour Photography', 
        icon: '📸',
        description: 'Professional photo session at scenic Cyprus locations',
        included: ['Professional photographer', 'Multiple locations', 'Digital gallery']
      },
      { 
        time: '20:00', 
        activity: 'Farewell Gala Dinner', 
        icon: '🏆',
        description: 'Elegant dinner with awards ceremony and memories sharing',
        included: ['Gala dinner', 'Award ceremony', 'Memory book']
      },
      { 
        time: '23:00', 
        activity: 'Final Party at Rooftop Club', 
        icon: '🌃',
        description: 'Last night celebration with panoramic city views',
        included: ['Rooftop access', 'Premium drinks', 'Group photos']
      },
    ]
  }
];



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

export default function NextTripPage() {
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden pt-20">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm"
              >
                <span className="text-lg">🇨🇾</span>
                <span className="text-purple-300 text-sm font-medium">MAY 24-26, 2024</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
                CYPRUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ADVENTURE</span>
                <br />AWAITS YOU
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                3 days of non-stop adventure, luxury experiences, and unforgettable memories in the Mediterranean paradise
              </p>

              <div className="flex flex-wrap gap-6 justify-center text-gray-300">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Ayia Napa & Limassol
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  May 24-26, 2024
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Limited to 50 Students
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
              >
                BOOK YOUR ADVENTURE NOW
              </motion.button>
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
                WHAT MAKES THIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPECIAL</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                This isn&apos;t just another student trip. It&apos;s a carefully curated experience designed to create lifelong memories.
              </p>
            </div>
          </BlurFade>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Cyprus Map with Activities */}
            <BlurFade delay={0.2}>
              <div className="relative">
                <div className="relative flex items-center justify-center min-h-[500px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <OrbitingCircles
                      className="h-[60px] w-[60px] border-purple-500/20 bg-black/30"
                      duration={35}
                      delay={0}
                      radius={150}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-2xl">🏖️</span>
                        <span className="text-xs text-cyan-400 font-medium">Beaches</span>
                      </div>
                    </OrbitingCircles>
                    <OrbitingCircles
                      className="h-[60px] w-[60px] border-purple-500/20 bg-black/30"
                      duration={40}
                      delay={5}
                      radius={200}
                      reverse
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-2xl">🎉</span>
                        <span className="text-xs text-purple-400 font-medium">Parties</span>
                      </div>
                    </OrbitingCircles>
                    <OrbitingCircles
                      className="h-[60px] w-[60px] border-purple-500/20 bg-black/30"
                      duration={30}
                      delay={10}
                      radius={120}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-2xl">🏛️</span>
                        <span className="text-xs text-orange-400 font-medium">Culture</span>
                      </div>
                    </OrbitingCircles>
                  </div>
                  <div className="relative z-10 w-full max-w-md">
                    <InteractiveCyprusMap />
                  </div>
                </div>
              </div>
            </BlurFade>

            {/* Key Features */}
            <BlurFade delay={0.3}>
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white mb-6">Why Choose Our Cyprus Experience?</h3>
                
                {[
                  {
                    icon: '🏆',
                    title: 'VIP Treatment Everywhere',
                    description: 'Skip lines, get priority access, and enjoy exclusive experiences at every venue.'
                  },
                  {
                    icon: '🌊',
                    title: 'Premium Locations',
                    description: 'Beachfront hotels, luxury yachts, and the hottest clubs in Cyprus.'
                  },
                  {
                    icon: '👥',
                    title: 'Perfect Group Size',
                    description: 'Limited to 50 students for an intimate, personalized experience.'
                  },
                  {
                    icon: '🔒',
                    title: 'Safe & Secure',
                    description: '24/7 support, emergency assistance, and verified accommodations.'
                  },
                  {
                    icon: '📸',
                    title: 'Memory Creation',
                    description: 'Professional photography, custom content, and lifelong memories.'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-white/5 rounded-lg border border-purple-500/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-3xl">{feature.icon}</span>
                    <div>
                      <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Detailed Itinerary */}
      <section className="relative py-32 bg-gradient-to-br from-purple-950/20 to-pink-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                DETAILED <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ITINERARY</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Every moment is planned for maximum fun, adventure, and unforgettable experiences.
              </p>
            </div>
          </BlurFade>

          {/* Day Selector */}
          <div className="flex justify-center gap-4 mb-12">
            {detailedItinerary.map((day, index) => (
              <motion.button
                key={day.day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  "px-8 py-4 rounded-full font-bold transition-all duration-300",
                  selectedDay === index
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-black/40 border border-purple-500/30 text-gray-300 hover:border-purple-500/50"
                )}
              >
                <div className="text-center">
                  <div className="text-lg">{day.day}</div>
                  <div className="text-xs opacity-80">{day.date}</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Day Content */}
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-purple-400 mb-2">
                {detailedItinerary[selectedDay].title}
              </h3>
              <p className="text-gray-400">{detailedItinerary[selectedDay].theme}</p>
            </div>

            <div className="space-y-6">
              {detailedItinerary[selectedDay].items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-purple-400 font-bold text-sm">{item.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">{item.activity}</h4>
                      <p className="text-gray-300 mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.included.map((include, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full"
                          >
                            <Check className="w-3 h-3" />
                            {include}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>



      {/* Booking Section */}
      <section id="booking" className="relative py-32 bg-gradient-to-br from-purple-950/30 to-pink-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <BlurFade delay={0.1}>
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                  SECURE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPOT NOW</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Only <NumberTicker value={8} className="text-purple-400 font-bold" /> spots remaining for this exclusive experience!
                </p>
              </div>
            </BlurFade>

            <BookingForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}