'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CountdownTimer() {
  const [spotsLeft, setSpotsLeft] = useState(23);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Calculate time until next Friday
    const getNextFriday = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
      const nextFriday = new Date(now);
      nextFriday.setDate(now.getDate() + daysUntilFriday);
      nextFriday.setHours(18, 0, 0, 0); // 6 PM Friday
      return nextFriday;
    };

    const updateCountdown = () => {
      const now = new Date();
      const target = getNextFriday();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Simulate spots being taken
    const spotsInterval = setInterval(() => {
      setSpotsLeft((prev) => {
        if (prev > 8) {
          return prev - 1;
        }
        return prev;
      });
    }, 30000); // Decrease every 30 seconds

    return () => {
      clearInterval(interval);
      clearInterval(spotsInterval);
    };
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div
        className="text-3xl sm:text-4xl md:text-5xl font-black text-white relative"
        style={{
          textShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)',
        }}
      >
        <span className="relative z-10">{value.toString().padStart(2, '0')}</span>
        <div className="absolute inset-0 text-purple-400 blur-sm">{value.toString().padStart(2, '0')}</div>
      </div>
      <div className="text-sm text-purple-300 uppercase font-semibold tracking-wider">{label}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Countdown */}
      <div className="flex justify-center gap-3 sm:gap-6">
        <TimeUnit value={timeLeft.days} label="Days" />
        <div className="flex items-center">
          <motion.span 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-purple-400 text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{
              textShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
              lineHeight: '1',
              transform: 'translateY(-10px)'
            }}
          >
            :
          </motion.span>
        </div>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <div className="flex items-center">
          <motion.span 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="text-purple-400 text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{
              textShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
              lineHeight: '1',
              transform: 'translateY(-10px)'
            }}
          >
            :
          </motion.span>
        </div>
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <div className="flex items-center">
          <motion.span 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="text-purple-400 text-3xl sm:text-4xl md:text-5xl font-bold"
            style={{
              textShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
              lineHeight: '1',
              transform: 'translateY(-10px)'
            }}
          >
            :
          </motion.span>
        </div>
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>

      {/* Spots Left with Animation */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={spotsLeft}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-base text-gray-300"
          >
            <span 
              className="text-purple-300 font-bold text-xl"
              style={{
                textShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
              }}
            >
              {spotsLeft} spots left
            </span> for next Friday
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}