'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
// import VIPCard from '@/components/hero-elements/VIPCard';

import GlitchText from '@/components/hero-elements/GlitchText';
import AboutMemoraSection from '@/components/AboutMemoraSection';
import FAQSection from '@/components/FAQSection';
import NextTripSection from '@/components/NextTripSection';
import EventsSection from '@/components/EventsSection';
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
const words = ['EXPERIENCES', 'MEMORIES', 'ADVENTURES'];

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
            <source src="/hero-backround.mp4" type="video/mp4" />
          </video>
          
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen parallax-container">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-20">
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeInUp}
                style={{
                  transform: isMobileDevice ? 'none' : `translateX(${parallax.x * 0.1}px) translateY(${parallax.y * 0.1}px)`,
                }}
                className="space-y-6 sm:space-y-8 text-center max-w-6xl w-full px-2 sm:px-4">
                {/* Small Label */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={slideInFromTop}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 mx-auto backdrop-blur-md shadow-lg"
                >
                  <span className="text-2xl">🌴</span>
                  <span className="text-purple-200 text-sm font-bold tracking-wide">CYPRUS EXPERIENCES</span>
                </motion.div>

                {/* Main Title */}
                <div className="space-y-4">
                  <motion.h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight"
                    style={{
                      transform: isMobileDevice ? 'none' : `perspective(1000px) rotateX(${parallax.rotateX * 0.2}deg) rotateY(${parallax.rotateY * 0.2}deg)`,
                    }}
                  >
                    <span className="text-white neon-hover drop-shadow-2xl">UNFORGETTABLE</span>{' '}
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
                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mx-auto max-w-3xl px-2">
                  Epic{' '}
                  <span className="text-purple-400 font-bold">3-day adventures</span>
                  {' and '}
                  <span className="text-pink-400 font-bold">single-night events</span>
                  {' across the most beautiful island in the Mediterranean'}
                </p>

                {/* Features */}
                <motion.div 
                  className="flex flex-wrap gap-4 justify-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeIn}
                >
                  {[
                    { icon: '🏖️', label: 'Beach Parties' },
                    { icon: '🎉', label: 'Epic Clubs' },
                    { icon: '🏛️', label: 'Culture & History' },
                    { icon: '🌊', label: 'Water Sports' }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-purple-500/30 rounded-full backdrop-blur-sm hover:border-purple-400/60 hover:from-purple-500/25 hover:to-pink-500/25 transition-all shadow-lg"
                    >
                      <span className="text-xl">{feature.icon}</span>
                      <span className="text-sm font-semibold text-white">{feature.label}</span>
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
                    {/* Primary CTA */}
                    <motion.button
                      onClick={() => setIsBookingPopupOpen(true)}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        Book Your Adventure
                        <span className="text-xl">🚀</span>
                      </span>
                    </motion.button>

                    {/* Secondary CTA */}
                    <motion.button
                      onClick={() => {
                        const nextTripElement = document.querySelector('#next-trip');
                        if (nextTripElement) {
                          nextTripElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-4 bg-black/40 backdrop-blur-sm border-2 border-purple-500/40 rounded-full text-white font-bold text-lg hover:bg-purple-500/10 hover:border-purple-400/60 transition-all shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        View All Trips
                        <span>→</span>
                      </span>
                    </motion.button>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Memora Section */}
      <AboutMemoraSection />

      {/* Next Trip Details Section */}
      <NextTripSection isHomepage={true} />
      
      {/* Events Section */}
      <EventsSection />
      
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
