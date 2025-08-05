'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah M.",
    university: "University of Cyprus",
    text: "Best 3 days of my uni life! The boat parties were insane 🔥",
    rating: 5,
  },
  {
    name: "Alex K.",
    university: "European University",
    text: "Lora made everything so easy. Instant booking, no stress!",
    rating: 5,
  },
  {
    name: "Maria P.",
    university: "Frederick University",
    text: "VIP access everywhere! Worth every penny 💯",
    rating: 5,
  },
  {
    name: "John D.",
    university: "UCLan Cyprus",
    text: "The hidden beach spots were incredible. Can't wait to go again!",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 h-[140px] flex items-stretch"
        >
          <div className="flex items-start gap-3 w-full">
            <Quote className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div className="flex-1 flex flex-col h-full">
              <p className="text-gray-300 text-sm mb-auto">
                {testimonials[current].text}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {testimonials[current].name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {testimonials[current].university}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === current
                ? 'bg-purple-400 w-4'
                : 'bg-purple-400/30 hover:bg-purple-400/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}