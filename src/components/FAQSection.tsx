'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import GlitchText from '@/components/hero-elements/GlitchText';
import Sparkles from '@/components/ui/Sparkles';
import ShimmerBorder from '@/components/ui/ShimmerBorder';

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
      {/* Animated gradient line separator */}
      <div className="relative h-px overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      </div>
      
      {/* FAQ Content Section */}
      <div className="relative py-32 overflow-hidden">
        {/* Subtle fade from black */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
        
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
          
          {/* Dark Overlay - reduced for more video visibility */}
          <div className="absolute inset-0 bg-black/60" />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px]" />
        </div>
        
        {/* Cyber Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(purple 1px, transparent 1px), linear-gradient(90deg, purple 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>
        
        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
              style={{
                top: `${30 + i * 20}%`,
                width: '100%',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2,
              }}
            />
          ))}
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
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
              <span className="text-white">GOT </span>
              <GlitchText 
                text="QUESTIONS?"
                className="text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              />
            </h2>
          </motion.div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about your epic Cyprus adventure
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 relative">
          {/* Sparkles overlay for the FAQ section */}
          <Sparkles 
            className="z-0" 
            density={30} 
            color="#a855f7" 
            speed={0.5}
          />
          
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative z-10"
            >
              <ShimmerBorder duration={4 + index}>
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* FAQ Item */}
                  <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-6 flex items-center justify-between text-left transition-colors hover:bg-purple-500/5"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-white pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
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
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-4" />
                          <p className="text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                          {faq.id === 4 && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
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
            </ShimmerBorder>
          </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Still have questions? Lora has all the answers
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              Ask Lora Anything
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
        </div>
      </div>
    </section>
  );
}