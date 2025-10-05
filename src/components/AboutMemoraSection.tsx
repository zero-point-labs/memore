'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutMemoraSection() {
  return (
    <section className="relative bg-black py-16 sm:py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center"
          >
            {/* Small badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <span className="text-purple-300 text-sm font-semibold">About Us</span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                What is{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Memora?
                </span>
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              <p>
                <strong className="text-white">Memora</strong> is your ultimate Cyprus experience organizer. 
                We specialize in creating unforgettable adventures for students and young adults.
              </p>
              <p>
                From <span className="text-purple-400 font-semibold">3-day adventure trips</span> packed 
                with beach parties, cultural tours, and VIP club access, to <span className="text-pink-400 font-semibold">single-night events</span> at 
                the hottest venues — we handle everything so you just show up and have the time of your life.
              </p>
            </div>

            {/* Mascot - Below Description */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-5 sm:gap-8 py-6 justify-center max-w-lg mx-auto"
            >
              {/* Text on left */}
              <div className="text-left flex-1">
                <div className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                  Meet Our Mascot!
                </div>
                <div className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Your friendly guide to unforgettable Cyprus adventures
                </div>
              </div>

              {/* Bird on right */}
              <motion.div
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 4, 0, -4, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0"
              >
                {/* Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.25, 0.45, 0.25],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded-full blur-2xl"
                />
                <Image
                  src="/memora-mascot-bird.png"
                  alt="Memora Mascot"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Single Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <motion.button
                onClick={() => {
                  document.querySelector('#next-trip')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  About Us
                  <span>→</span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
