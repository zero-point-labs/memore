'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
// import VIPCard from '@/components/hero-elements/VIPCard';

import GlitchText from '@/components/hero-elements/GlitchText';
import FAQSection from '@/components/FAQSection';
import NextTripSection from '@/components/NextTripSection';
import GallerySection from '@/components/GallerySection';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import BookingFormPopup from '@/components/BookingFormPopup';
import { useParallax } from '@/hooks/useParallax';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { isMobile } from '@/utils/isMobile';
import { viewportOnce, fadeInUp, fadeIn, slideInFromTop } from '@/utils/animationVariants';


// Memoize VIPCard to prevent re-renders when title changes
// const MemoizedVIPCard = memo(VIPCard);

// Constants
const words = ['PARTIES', 'MEMORIES', 'MADNESS'];

export default function Home() {

  const [currentWord, setCurrentWord] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parallax = useParallax(isMobileDevice ? 0 : 0.5);

  useEffect(() => {
    setIsMobileDevice(isMobile());
    
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Video management to ensure it never stops playing
  const ensureVideoPlays = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (error) {
        console.log('Video play failed:', error);
      }
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to play when component mounts
    ensureVideoPlays();

    // Create intersection observer to play video when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ensureVideoPlays();
          }
        });
      },
      { threshold: 0.1 } // Play when 10% visible
    );

    observer.observe(video);

    // Event listeners to handle video pause/ended events
    const handlePause = () => {
      // If video pauses, try to play it again immediately
      setTimeout(ensureVideoPlays, 100);
    };

    const handleEnded = () => {
      // If video ends (shouldn't happen with loop), restart it
      ensureVideoPlays();
    };

    const handleLoadedData = () => {
      // When video data loads, ensure it plays
      ensureVideoPlays();
    };

    // Handle page visibility changes (e.g., switching tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, ensure video plays
        setTimeout(ensureVideoPlays, 200);
      }
    };

    // Add event listeners
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadeddata', handleLoadedData);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Force play attempt on focus/scroll events
    const handleFocus = () => {
      setTimeout(ensureVideoPlays, 100);
    };
    
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      observer.disconnect();
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadeddata', handleLoadedData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [ensureVideoPlays]);

  // Swipe gesture for desktop only
  useSwipeGesture(heroRef as React.RefObject<HTMLElement>, {
    onSwipeUp: () => {
      if (!isMobileDevice) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    },
  });

  return (
    <div ref={heroRef} className="relative">
      {/* First Section: Video Background for Title, Subtitle, Features */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/0806.mov" type="video/mp4" />
          </video>
          
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/70" />
          
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-32 pb-20 parallax-container">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeInUp}
                style={{
                  transform: isMobileDevice ? 'none' : `translateX(${parallax.x * 0.3}px) translateY(${parallax.y * 0.3}px)`,
                }}
                className="space-y-6 sm:space-y-8 text-center max-w-6xl w-full px-2 sm:px-4">
                {/* Small Label */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={slideInFromTop}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mx-auto backdrop-blur-sm"
                >
                  <span className="text-lg">🇨🇾</span>
                  <span className="text-purple-300 text-sm font-medium">CYPRUS ADVENTURES</span>
                </motion.div>

                {/* Main Title */}
                <div className="space-y-4">
                  <motion.h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight"
                    style={{
                      transform: isMobileDevice ? 'none' : `perspective(1000px) rotateX(${parallax.rotateX * 0.5}deg) rotateY(${parallax.rotateY * 0.5}deg)`,
                    }}
                  >
                    <span className="text-white neon-hover drop-shadow-2xl">3 DAYS OF</span>{' '}
                    <span className="relative inline-block">
                      <span className="absolute inset-0 blur-2xl bg-purple-600/50"></span>
                      <GlitchText 
                        text={words[currentWord]}
                        className="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 neon-purple drop-shadow-2xl"
                      />
                    </span>
                  </motion.h1>
                </div>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mx-auto max-w-2xl px-2 drop-shadow-lg">
                  Let Memora take you on an incredible journey to experience{' '}
                  <motion.span 
                    className="text-purple-400 font-semibold relative inline-block"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(139, 92, 246, 0.5)',
                        '0 0 20px rgba(139, 92, 246, 0.8)',
                        '0 0 10px rgba(139, 92, 246, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Cyprus
                  </motion.span>
                  {' and its '}
                  <motion.span 
                    className="text-pink-400 font-semibold relative inline-block"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(251, 113, 133, 0.5)',
                        '0 0 20px rgba(251, 113, 133, 0.8)',
                        '0 0 10px rgba(251, 113, 133, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    legendary nightlife
                  </motion.span>
                  {' like '}
                  <motion.span 
                    className="text-cyan-400 font-semibold relative inline-block"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(34, 211, 238, 0.5)',
                        '0 0 20px rgba(34, 211, 238, 0.8)',
                        '0 0 10px rgba(34, 211, 238, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    never before
                  </motion.span>
                  .
                </p>

                {/* Features */}
                <motion.div 
                  className="flex flex-wrap gap-3 sm:gap-6 justify-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeIn}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {['Beach Adventures', 'Epic Parties', 'Cultural Experiences'].map((feature, index) => (
                    <motion.div
                      key={feature}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { 
                          opacity: 1, 
                          scale: 1,
                          transition: { delay: index * 0.1 }
                        }
                      }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="flex items-center gap-2 text-gray-300 hover:text-purple-300 transition-colors cursor-pointer group backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse group-hover:bg-purple-400 group-hover:glow-pulse" />
                      <span className="text-sm whitespace-nowrap">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeIn}
                  className="mt-12"
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* Scroll to Cyprus Map Button */}
                    <button
                      onClick={() => {
                        const cyprusElement = document.querySelector('[data-cyprus-map]');
                        if (cyprusElement) {
                          cyprusElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-black/20 border border-purple-500/30 rounded-full text-gray-300 hover:text-purple-300 hover:border-purple-500/50 transition-colors backdrop-blur-sm"
                    >
                      <span>🗺️</span>
                      <span className="font-medium">Next Trip</span>
                    </button>

                    {/* Sign Up Button */}
                    <button
                      onClick={() => setIsBookingPopupOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <span>✨</span>
                      <span className="font-medium">Get Started</span>
                    </button>
                  </div>
                </motion.div>

                {/* Countdown Timer */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeIn}
                  className="mt-12 text-center"
                >
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
                    🚀 NEXT ADVENTURE DEPARTING IN
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
                        23
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
                        14
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
                        37
                      </motion.div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Minutes</div>
                    </div>
                  </motion.div>
                  
                  <motion.p 
                    className="text-gray-400 text-xs mt-3"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Limited spots • Early bird pricing ends soon
                  </motion.p>
                </motion.div>

                {/* Scroll Animation */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeIn}
                  className="mt-12 flex flex-col items-center"
                >
                  <motion.div
                    className="cursor-pointer group"
                    onClick={() => {
                      const nextSection = document.querySelector('[data-cyprus-map]') || document.querySelector('section:nth-child(2)');
                      if (nextSection) {
                        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="flex flex-col items-center gap-3"
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.span
                        className="text-purple-400 text-sm font-medium tracking-wider uppercase"
                        animate={{
                          textShadow: [
                            '0 0 10px rgba(139, 92, 246, 0.3)',
                            '0 0 15px rgba(139, 92, 246, 0.6)',
                            '0 0 10px rgba(139, 92, 246, 0.3)',
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        SCROLL TO EXPLORE
                      </motion.span>
                      <motion.div
                        className="flex flex-col gap-1"
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <motion.div 
                          className="w-1 h-3 bg-purple-400 rounded-full"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div 
                          className="w-1 h-3 bg-purple-400 rounded-full"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        />
                        <motion.div 
                          className="w-1 h-3 bg-purple-400 rounded-full"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                        />
                      </motion.div>
                      <motion.div
                        className="w-6 h-6 border-2 border-purple-400 rounded-full flex items-center justify-center"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <motion.div
                          className="w-1 h-1 bg-purple-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Trip Details Section */}
      <NextTripSection />
      
      {/* Gallery Section */}
      <GallerySection />
      
      {/* Blog Section */}
      <BlogSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Contact Section - flows from FAQ */}
      <ContactSection />
      
      {/* Footer - no gap */}
      <Footer />
      
      {/* Booking Form Popup */}
      <BookingFormPopup 
        isOpen={isBookingPopupOpen}
        onClose={() => setIsBookingPopupOpen(false)}
      />
    </div>
  );
}