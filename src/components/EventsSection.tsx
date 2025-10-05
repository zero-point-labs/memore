'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EventDocument } from '@/types/event';
import EventCard from '@/components/EventCard';
import Sparkles from '@/components/ui/Sparkles';
import Link from 'next/link';

export default function EventsSection() {
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch('/api/events/featured?limit=3');
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error fetching featured events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-black py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          <Sparkles 
            className="z-0" 
            density={25} 
            color="#ec4899" 
            speed={0.8}
            size={3}
          />
          <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 relative z-10">
            <span className="text-white">UPCOMING </span>
            <motion.span
              className="text-transparent bg-clip-text"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ 
                backgroundSize: '200% auto',
                backgroundImage: 'linear-gradient(to right, #8b5cf6, #ec4899, #8b5cf6)',
                WebkitBackgroundClip: 'text',
              }}
            >
              EVENTS
            </motion.span>
          </motion.h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Single-night experiences at Cyprus&apos;s hottest clubs and beach bars
          </p>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-purple-400 text-lg">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">No events available yet</div>
            <p className="text-gray-500">Check back soon for amazing experiences!</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event, index) => (
                <EventCard key={event.$id} event={event} index={index} />
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative flex justify-center"
            >
              <Link href="/events">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-semibold text-lg shadow-2xl hover:from-purple-600/40 hover:to-pink-600/40 hover:border-purple-400/70 transition-all duration-300 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <span className="relative z-10">View All Events</span>
                  
                  <motion.span
                    className="relative z-10 text-purple-300 group-hover:text-white transition-colors"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

