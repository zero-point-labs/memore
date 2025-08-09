'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import GlitchText from '@/components/hero-elements/GlitchText';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What's included in the VIP Cyprus adventure?",
    answer: "Your VIP pass includes exclusive access to premium beach clubs, yacht parties, private villa events, personalized trip planning with Lora AI, and priority booking for all Cyprus hotspots. Plus, you'll join a community of like-minded students ready to make unforgettable memories."
  },
  {
    id: 2,
    question: "How does Lora AI help plan my trip?",
    answer: "Lora is your personal AI trip planner who knows Cyprus inside out. She'll create customized itineraries based on your preferences, recommend hidden gems, secure reservations at exclusive venues, and provide real-time support throughout your adventure."
  },
  {
    id: 3,
    question: "Is this only for university students?",
    answer: "Yes! This exclusive experience is designed specifically for university students aged 18-25. You'll need to verify your student status to access VIP benefits. It's all about creating the perfect student adventure community in Cyprus."
  },
  {
    id: 4,
    question: "How much does the VIP experience cost?",
    answer: "Packages start from €299 for weekend experiences and go up to €999 for full-week ultimate packages. Early bird VIP members get up to 40% off and can secure their spot with just a €99 deposit. Chat with Lora to find the perfect package for your budget."
  }
];

// Optimized Sparkles component using CSS animations
function OptimizedSparkles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style jsx>{`
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          50% { opacity: 1; transform: scale(1) translateY(-10px); }
          100% { opacity: 0; transform: scale(0) translateY(-20px); }
        }
        .sparkle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #a855f7;
          border-radius: 50%;
          box-shadow: 0 0 4px #a855f7;
          animation: sparkle 2s infinite ease-out;
        }
        .sparkle:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
        .sparkle:nth-child(2) { top: 60%; left: 80%; animation-delay: 0.5s; }
        .sparkle:nth-child(3) { top: 30%; left: 50%; animation-delay: 1s; }
        .sparkle:nth-child(4) { top: 80%; left: 30%; animation-delay: 1.5s; }
        .sparkle:nth-child(5) { top: 20%; left: 70%; animation-delay: 2s; }
        .sparkle:nth-child(6) { top: 70%; left: 10%; animation-delay: 2.5s; }
        .sparkle:nth-child(7) { top: 40%; left: 90%; animation-delay: 3s; }
        .sparkle:nth-child(8) { top: 90%; left: 60%; animation-delay: 3.5s; }
      `}</style>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="sparkle" />
      ))}
    </div>
  );
}

// Optimized ShimmerBorder using pure CSS
function OptimizedShimmerBorder({ children, duration = 4 }: { children: React.ReactNode; duration?: number }) {
  return (
    <div className="relative">
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmer-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(90deg, transparent, #a855f7, #ec4899, transparent);
          background-size: 200% 100%;
          animation: shimmer ${duration}s infinite linear;
          opacity: 0.75;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 2px;
        }
      `}</style>
      <div className="shimmer-border relative">
        {children}
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="relative">
      {/* FAQ Content Section */}
      <div className="relative pt-20 pb-24 overflow-hidden bg-black">
        
        {/* Static Background with Performance Optimizations */}
        <div className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
          {/* Static Gradient Orbs - Your brilliant idea! */}
          <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/25 to-pink-500/20 rounded-full blur-[80px] transform3d(0,0,0)" />
          <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 to-purple-600/25 rounded-full blur-[70px] transform3d(0,0,0)" />
          <div className="absolute bottom-20 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-yellow-500/15 to-orange-500/20 rounded-full blur-[90px] transform3d(0,0,0)" />
          <div className="absolute top-1/4 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-green-500/20 to-blue-500/25 rounded-full blur-[60px] transform3d(0,0,0)" />
          <div className="absolute bottom-1/4 right-1/3 w-[550px] h-[550px] bg-gradient-to-br from-rose-500/25 to-violet-500/30 rounded-full blur-[75px] transform3d(0,0,0)" />

          {/* Simplified Static Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px),
                linear-gradient(-45deg, rgba(236, 72, 153, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px, 80px 80px',
            }} />
          </div>

          {/* Subtle accent lines - reduced from 6 to 2 */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute h-px top-1/4 w-full opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent)',
              }}
            />
            <div
              className="absolute h-px top-3/4 w-full opacity-20"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.3), transparent)',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
              <span className="text-white">GOT </span>
              <GlitchText 
                text="QUESTIONS?"
                className="text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              />
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about your epic Cyprus adventure
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 relative">
          {/* Optimized Sparkles */}
          <OptimizedSparkles />
          
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative z-10"
            >
              <OptimizedShimmerBorder duration={4 + index}>
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* FAQ Item */}
                  <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-6 flex items-center justify-between text-left transition-colors hover:bg-purple-500/5"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-white pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.includes(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-4" />
                          <p className="text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                          {faq.id === 4 && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white text-sm shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                            >
                              Chat with Lora
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </OptimizedShimmerBorder>
          </motion.div>
          ))}
        </div>


        </div>
      </div>
    </section>
  );
}