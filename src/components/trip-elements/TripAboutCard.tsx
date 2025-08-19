'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Clock, Sparkles, Star, Zap } from 'lucide-react';
import NumberTicker from '@/components/magicui/number-ticker';
import { BorderBeam } from '@/components/magicui/border-beam';
import { TripDocument } from '@/types/trip';

interface TripAboutCardProps {
  trip: TripDocument;
}

export default function TripAboutCard({ trip }: TripAboutCardProps) {
  // Key features to highlight
  const keyFeatures = [
    { icon: '🏖️', text: 'Exclusive Beach Access' },
    { icon: '🎉', text: 'VIP Club Experiences' },
    { icon: '🛥️', text: 'Luxury Yacht Parties' },
    { icon: '🌅', text: 'Epic Sunset Views' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative max-w-4xl mx-auto mb-20"
    >
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-purple-900/30 via-black/50 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 md:p-12 overflow-hidden">
        <BorderBeam
          colorFrom="#8B5CF6"
          colorTo="#EC4899"
          borderWidth={2}
          duration={6}
        />
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-600/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-semibold text-sm">Your Ultimate Adventure Awaits</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {trip.location.split(',')[0]}
              </span>{' '}
              <span className="text-white">Experience</span>
            </h3>
            
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              An incredible {trip.duration}-day journey through the Mediterranean paradise, 
              designed for maximum adventure and unforgettable memories.
            </p>
          </div>

          {/* Trip Details Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-500/40 transition-colors"
            >
              <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-2">Destination</h4>
              <p className="text-purple-300 font-semibold">{trip.location}</p>
            </motion.div>

            {/* Dates */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-black/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 text-center hover:border-pink-500/40 transition-colors"
            >
              <Calendar className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-2">When</h4>
              <p className="text-pink-300 font-semibold text-sm">
                {new Date(trip.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} - {new Date(trip.endDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-black/30 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-500/40 transition-colors"
            >
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h4 className="text-white font-bold mb-2">Spots Left</h4>
              <div className="flex items-center justify-center gap-2">
                <NumberTicker 
                  value={trip.availability.spotsRemaining} 
                  className="text-cyan-300 font-bold text-xl" 
                />
                <span className="text-gray-400 text-sm">/ {trip.availability.totalSpots}</span>
              </div>
            </motion.div>
          </div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <h4 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              What Makes This Special
              <Star className="w-5 h-5 text-yellow-400" />
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-4 text-center hover:border-purple-500/40 transition-all duration-300"
                >
                  <span className="text-2xl mb-2 block">{feature.icon}</span>
                  <p className="text-gray-300 text-sm font-medium">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mascot Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h4 className="text-xl font-bold text-white">Special Surprise</h4>
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              Meet our legendary party mascot who will make every moment even more epic! 
              This isn&apos;t just any ordinary trip companion - get ready for an interactive experience 
              that will take your Cyprus adventure to the next level.
            </p>
            
            <motion.div
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(139, 92, 246, 0.5)',
                  '0 0 20px rgba(236, 72, 153, 0.8)',
                  '0 0 10px rgba(139, 92, 246, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-lg"
            >
              ✨ Scroll down to meet your party companion! ✨
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
