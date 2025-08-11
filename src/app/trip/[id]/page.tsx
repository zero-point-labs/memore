'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Clock, Users, Check, ArrowLeft, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingFormPopup from '@/components/BookingFormPopup';
import Sid3DMascot from '@/components/trip-elements/Sid3DMascot';
import TripImageCarousel from '@/components/trip-elements/TripImageCarousel';
import TripDetailsCard from '@/components/trip-elements/TripDetailsCard';
import { tripService } from '@/services/tripService';
import { TripDocument } from '@/types/trip';
import Link from 'next/link';

import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import BlurFade from '@/components/ui/BlurFade';
import { fadeInUp, fadeIn } from '@/utils/animationVariants';
import { cn } from '@/utils/cn';

export default function TripPage() {
  const params = useParams();
  const tripId = params.id as string;
  
  const [selectedDay, setSelectedDay] = useState(0);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const [trip, setTrip] = useState<TripDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
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
        <Header />
        <div className="flex items-center justify-center min-h-screen">
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
      <Header />
      
      {/* Back Navigation */}
      <div className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <Link
            href="/next-trip"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Trips
          </Link>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsBookingPopupOpen(true)}
                  className="px-6 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white text-sm sm:text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  BOOK YOUR ADVENTURE NOW
                </motion.button>
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

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Sid 3D Mascot */}
            <BlurFade delay={0.2}>
              <div className="relative">
                <Sid3DMascot />
              </div>
            </BlurFade>

            {/* Trip Details Card */}
            <BlurFade delay={0.3}>
              <TripDetailsCard trip={trip} />
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
                {isUpcoming ? 'DETAILED' : 'THE'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ITINERARY</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {isUpcoming 
                  ? "Every moment is planned for maximum fun, adventure, and unforgettable experiences."
                  : "Here's how this incredible adventure unfolded."
                }
              </p>
            </div>
          </BlurFade>

          {/* Day Selector */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-12 overflow-x-auto">
            {trip.itinerary.map((day, index) => (
              <motion.button
                key={day.day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(index)}
                className={cn(
                  "px-4 sm:px-8 py-3 sm:py-4 rounded-full font-bold transition-all duration-300 whitespace-nowrap",
                  selectedDay === index
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-black/40 border border-purple-500/30 text-gray-300 hover:border-purple-500/50"
                )}
              >
                <div className="text-center">
                  <div className="text-sm sm:text-lg">{day.day}</div>
                  {day.date && <div className="text-xs opacity-80 hidden sm:block">{day.date}</div>}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Day Content */}
          {trip.itinerary.length > 0 && trip.itinerary[selectedDay] && (
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-purple-400 mb-2">
                  {trip.itinerary[selectedDay].title}
                </h3>
                {trip.itinerary[selectedDay].theme && (
                  <p className="text-gray-400">{trip.itinerary[selectedDay].theme}</p>
                )}
              </div>

              <div className="space-y-6">
                {trip.itinerary[selectedDay].items.map((item, index) => (
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
                        {item.description && (
                          <p className="text-gray-300 mb-4">{item.description}</p>
                        )}
                        
                        {item.included && item.included.length > 0 && (
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
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative py-32 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <Meteors number={8} />
          <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-[700px] h-[700px] bg-pink-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <BlurFade delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                {trip.location.split(',')[0].toUpperCase()} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">GALLERY</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {isUpcoming 
                  ? `Immerse yourself in what awaits you with stunning visuals from ${trip.location}`
                  : `Relive the incredible moments from this amazing adventure`
                }
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <div className="max-w-6xl mx-auto">
              <TripImageCarousel 
                images={trip.gallery}
                className="w-full" 
                autoPlay={true} 
                autoPlayInterval={5000}
                showControls={true}
                showDots={true}
              />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Booking Section - Only show for upcoming trips */}
      {isUpcoming && (
        <section id="booking" className="relative py-32 bg-gradient-to-br from-purple-950/30 to-pink-950/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <BlurFade delay={0.1}>
                <div className="mb-12">
                  <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                    SECURE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPOT NOW</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Only <NumberTicker value={trip.availability.spotsRemaining} className="text-purple-400 font-bold" /> spots remaining for this exclusive experience!
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBookingPopupOpen(true)}
                    className="px-8 sm:px-16 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white text-lg sm:text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    BOOK {trip.title.toUpperCase()} NOW
                  </motion.button>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>
      )}

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
