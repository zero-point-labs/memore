'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Sparkles, Users, Star, Zap } from 'lucide-react';
import { TripDocument } from '@/types/trip';
import ShimmerBorder from '@/components/ui/ShimmerBorder';
import NumberTicker from '@/components/magicui/number-ticker';
import { TRIP_CATEGORIES } from '@/types/trip';

interface TripDetailsCardProps {
  trip: TripDocument;
}

export default function TripDetailsCard({ trip }: TripDetailsCardProps) {
  const categoryInfo = TRIP_CATEGORIES.find(cat => cat.id === trip.category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `${trip.pricing.currency}${price}`;
  };

  const lowestPrice = trip.pricing.standard || trip.pricing.premium || trip.pricing.vip || 0;
  const availabilityPercentage = ((trip.availability.totalSpots - trip.availability.spotsRemaining) / trip.availability.totalSpots) * 100;

  return (
    <ShimmerBorder
      className="w-full"
      borderRadius="1.5rem"
      borderWidth="1px"
      duration={6}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-black/90 via-purple-950/40 to-black/90 backdrop-blur-2xl rounded-[1.5rem] p-8 overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-50" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl animate-pulse">{categoryInfo?.icon || '🌟'}</span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs font-medium text-purple-300 border border-purple-500/30">
                  {categoryInfo?.label || 'Adventure'}
                </span>
              </div>
              <h3 className="text-3xl font-black text-white mb-2">{trip.title}</h3>
              <p className="text-gray-400 text-sm max-w-md">{trip.description}</p>
            </div>
            
            {/* Price Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-500/30 backdrop-blur-sm"
            >
              <div className="text-xs text-gray-400 mb-1">Starting from</div>
              <div className="text-2xl font-bold text-white">{formatPrice(lowestPrice)}</div>
            </motion.div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Dates */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-900/30 to-transparent rounded-xl p-4 border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Dates</span>
              </div>
              <div className="text-sm font-bold text-white">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-pink-900/30 to-transparent rounded-xl p-4 border border-pink-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-gray-400">Location</span>
              </div>
              <div className="text-sm font-bold text-white truncate">{trip.location}</div>
            </motion.div>

            {/* Duration */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-cyan-900/30 to-transparent rounded-xl p-4 border border-cyan-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-400">Duration</span>
              </div>
              <div className="text-sm font-bold text-white">{trip.duration} Epic Days</div>
            </motion.div>
          </div>

          {/* Availability Section */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 mb-8 border border-purple-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-white">Availability</h4>
              </div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                <NumberTicker value={trip.availability.spotsRemaining} /> spots left
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-3 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${availabilityPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white/80">
                  {Math.round(availabilityPercentage)}% Booked
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">
                {trip.availability.totalSpots - trip.availability.spotsRemaining} students already joined
              </span>
              <span className="text-xs text-gray-400">
                Total: {trip.availability.totalSpots} spots
              </span>
            </div>
          </div>

          {/* Top Highlights */}
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <h4 className="text-lg font-bold text-white">Experience Highlights</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trip.highlights.slice(0, 4).map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-8 p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl border border-purple-500/20 text-center"
          >
            <p className="text-purple-300 font-medium mb-2">
              Don&apos;t miss out on this incredible adventure!
            </p>
            <p className="text-sm text-gray-400">
              Limited spots available • Book now to secure your place
            </p>
          </motion.div>
        </div>

        {/* Shimmer animation keyframes */}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </motion.div>
    </ShimmerBorder>
  );
}
