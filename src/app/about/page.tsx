'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import NextTripLink from '@/components/NextTripLink';
import { viewportOnce, fadeInUp, fadeIn, slideInFromTop } from '@/utils/animationVariants';

export default function AboutPage() {
  return (
    <div className="relative bg-black min-h-screen w-full overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-full px-3 sm:px-6 lg:px-12 pt-16 sm:pt-20 pb-6 sm:pb-8 relative z-10">
        <div className="w-full max-w-full mx-auto">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 md:space-y-8 text-center"
          >
            {/* Small badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                <span className="text-purple-300 text-xs sm:text-sm font-semibold">About Us</span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-3 sm:mb-4 md:mb-6 px-2">
                What is{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Memora?
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-full mx-auto px-1 sm:px-2">
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
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 py-4 sm:py-6 md:py-8 justify-center max-w-full mx-auto px-2"
            >
              {/* Text */}
              <div className="text-center sm:text-left flex-1 order-2 sm:order-1">
                <div className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 sm:mb-3">
                  Meet Our Mascot!
                </div>
                <div className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  Your friendly guide to unforgettable Cyprus adventures
                </div>
              </div>

              {/* Bird */}
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
                className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 flex-shrink-0 order-1 sm:order-2"
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

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.3 }}
              className="pt-4 sm:pt-6 md:pt-8"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center px-2">
                <NextTripLink className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-purple-500/50 transition-all overflow-hidden min-h-[48px] sm:min-h-[56px] md:min-h-[60px]"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">
                      Book Your Adventure
                    </span>
                  </motion.button>
                </NextTripLink>

                <Link href="/events" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-black/40 backdrop-blur-sm border-2 border-purple-500/40 rounded-full text-white font-bold text-base sm:text-lg md:text-xl hover:bg-purple-500/10 hover:border-purple-400/60 transition-all shadow-lg min-h-[48px] sm:min-h-[56px] md:min-h-[60px]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      View Events
                      <span>→</span>
                    </span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
