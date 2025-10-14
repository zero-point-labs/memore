'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clientTripService } from '@/services/tripService.client';
import { TripDocument } from '@/types/trip';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [countdownType, setCountdownType] = useState<'trip' | 'static'>('static');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const trip = await clientTripService.getNextTrip();
        
        if (trip) {
          // Countdown to trip start date only
          const tripStartDate = new Date(trip.startDate);
          const now = new Date();

          // Only use trip start date
          if (tripStartDate > now) {
            setTargetDate(tripStartDate);
            setCountdownType('trip');
          } else {
            setCountdownType('static');
          }
        } else {
          setCountdownType('static');
        }
      } catch (error) {
        console.error('Error fetching trip for countdown:', error);
        setCountdownType('static');
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Timer expired
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Static fallback values
  const displayTime = countdownType === 'static' ? { days: 23, hours: 14, minutes: 37 } : timeLeft;
  
  const getCountdownText = () => {
    return '🚀 NEXT ADVENTURE DEPARTING IN';
  };

  if (loading) {
    return (
      <div className="mt-12 text-center">
        <div className="text-purple-300 text-xs font-medium mb-2">Loading countdown...</div>
      </div>
    );
  }

  return (
    <div className="mt-12 text-center">
      <motion.p 
        className="text-purple-300 text-xs font-medium mb-2"
        animate={{
          textShadow: [
            '0 0 10px rgba(139, 92, 246, 0.5)',
            '0 0 20px rgba(139, 92, 246, 0.8)',
            '0 0 10px rgba(139, 92, 246, 0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {getCountdownText()}
      </motion.p>
      
      <motion.div 
        className="flex items-center justify-center gap-3"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {displayTime.days.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Days</div>
        </div>
        
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
        
        <div className="text-center">
          <motion.div
            className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            {displayTime.hours.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Hours</div>
        </div>
        
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
        
        <div className="text-center">
          <motion.div
            className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            {displayTime.minutes.toString().padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Minutes</div>
        </div>
      </motion.div>
    </div>
  );
}
