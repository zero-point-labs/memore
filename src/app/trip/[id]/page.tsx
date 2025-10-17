'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Users, Check, ArrowRight, Clock, ArrowLeft, Star, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
//  // Replaced with dedicated booking pages
import TripImageCarousel from '@/components/trip-elements/TripImageCarousel';
import { clientTripService } from '@/services/tripService.client';
import { TripDocument } from '@/types/trip';

import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import BlurFade from '@/components/ui/BlurFade';
import { fadeInUp, fadeIn } from '@/utils/animationVariants';
import { cn } from '@/utils/cn';
import TripAboutCard from '@/components/trip-elements/TripAboutCard';
import { BorderBeam } from '@/components/magicui/border-beam';
import EnhancedGetStartedButton from '@/components/EnhancedGetStartedButton';

// Note: Trip data now comes from API via clientTripService.getTrip() (ID-based)



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
    <section className="relative py-24 bg-gradient-to-br from-purple-950/20 to-pink-950/20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Meteors number={6} />
        <div className="absolute top-20 left-20 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-purple-600/15 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-pink-600/15 rounded-full blur-[100px] sm:blur-[120px]" />
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
  // const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false); // Replaced with dedicated booking pages
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
        const tripData = await clientTripService.getTrip(tripId);
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
          clientTripService.getUpcomingTrips(false), // Get all upcoming trips (don't exclude next trip)
          clientTripService.getPreviousTrips(10)     // Get last 10 previous trips
        ]);
        
        // Filter out current trip from both lists
        const filteredUpcoming = upcoming.filter((t: TripDocument) => t.$id !== tripId);
        const filteredPrevious = previous.filter((t: TripDocument) => t.$id !== tripId);
        
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
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-br from-purple-900 via-black to-pink-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] bg-purple-600/20 rounded-full blur-[100px] sm:blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-pink-600/20 rounded-full blur-[100px] sm:blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] bg-cyan-600/15 rounded-full blur-[80px] sm:blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center">
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
                  <Link href={`/book/${trip.$id}`}>
                    <EnhancedGetStartedButton 
                      className="shadow-2xl hover:shadow-purple-500/25"
                    />
                  </Link>
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
      <section className="relative py-32 bg-gradient-to-br from-purple-950/30 via-black to-pink-950/30 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Meteors number={8} />
          <div className="absolute top-20 left-20 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-purple-600/25 rounded-full blur-[100px] sm:blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-[350px] h-[350px] sm:w-[600px] sm:h-[600px] lg:w-[700px] lg:h-[700px] bg-pink-600/25 rounded-full blur-[120px] sm:blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] bg-cyan-600/15 rounded-full blur-[80px] sm:blur-[100px]" />
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

          {/* Trip Details - Direct Display */}
          <BlurFade delay={0.3}>
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Trip Header */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl animate-pulse">🌟</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm font-medium text-purple-300 border border-purple-500/30">
                    Adventure Trip
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">{trip.title}</h3>
                <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">{trip.description}</p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dates */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-purple-900/40 to-transparent rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Dates</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-pink-900/40 to-transparent rounded-2xl p-6 border border-pink-500/30 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-6 h-6 text-pink-400" />
                    <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Location</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{trip.location}</div>
                </motion.div>

                {/* Duration */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-cyan-900/40 to-transparent rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-sm sm:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                    <span className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Duration</span>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white">{trip.duration} Epic Days</div>
                </motion.div>
              </div>

              {/* Availability Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20 backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Users className="w-8 h-8 text-purple-400" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-white">Availability</h4>
                      <p className="text-sm text-gray-400">Limited spots available</p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      <NumberTicker value={trip.availability.spotsRemaining} /> spots left
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Out of {trip.availability.totalSpots} total spots</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-4 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((trip.availability.totalSpots - trip.availability.spotsRemaining) / trip.availability.totalSpots) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-white/90">
                      {Math.round(((trip.availability.totalSpots - trip.availability.spotsRemaining) / trip.availability.totalSpots) * 100)}% Booked
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 text-sm text-gray-400">
                  <span>{trip.availability.totalSpots - trip.availability.spotsRemaining} students already joined</span>
                  <span>Total: {trip.availability.totalSpots} spots</span>
                </div>
              </motion.div>

              {/* Experience Highlights */}
              {trip.highlights && trip.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="w-8 h-8 text-yellow-400" />
                    <h4 className="text-2xl sm:text-3xl font-bold text-white">Experience Highlights</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trip.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <Zap className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <span className="text-gray-300 font-medium">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Pricing Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30 text-center"
              >
                <div className="mb-4">
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Starting from</span>
                  <div className="text-4xl sm:text-5xl font-bold text-white mt-2">
                    €{trip.pricing.standard || trip.pricing.premium || trip.pricing.vip || 'TBA'}
                  </div>
                  <p className="text-gray-400 mt-2">per person</p>
                </div>
                {trip.pricing.earlyBird && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                    <span className="text-yellow-400 text-sm font-medium">EARLY BIRD DISCOUNT AVAILABLE</span>
                  </div>
                )}
              </motion.div>

              {/* Book Now Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <Link href={`/book/${trip.$id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transition-all overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      <span>Book Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>
                <p className="text-gray-400 mt-4 text-sm">
                  Limited spots available • Secure your place today
                </p>
              </motion.div>

            </div>
          </BlurFade>
        </div>
      </section>

      {/* Expandable Trip Information Cards */}
      <ExpandableCardsSection 
        trip={trip} 
        selectedDay={selectedDay} 
        setSelectedDay={setSelectedDay} 
      />

      {/* Other Trips Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-purple-950/10 to-black overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Meteors number={4} />
          <div className="absolute top-20 right-20 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] bg-purple-600/10 rounded-full blur-[60px] sm:blur-[80px]" />
          <div className="absolute bottom-20 left-20 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-pink-600/10 rounded-full blur-[80px] sm:blur-[100px]" />
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
      
      {/* Booking now handled by dedicated /book/[tripId] pages */}
    </div>
  );
}
