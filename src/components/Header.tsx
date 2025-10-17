'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Compass, Camera, MessageSquare, FileText, X, Calendar, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const navItems = [
    { label: 'Next Trip', href: '/next-trip', icon: <Compass size={16} /> },
    { label: 'Events', href: '/events', icon: <Calendar size={16} /> },
    { label: 'Gallery', href: '/gallery', icon: <Camera size={16} /> },
    { label: 'Stories', href: '/blog', icon: <FileText size={16} /> },
    { label: 'About Us', href: '/about', icon: <Users size={16} /> },
    { label: 'Contact', href: '/contact', icon: <MessageSquare size={16} /> },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Modern hamburger component with better mobile UX
  const HamburgerMenu = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 touch-manipulation"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-6 flex flex-col items-center justify-center">
        <motion.span
          className="block w-5 h-0.5 bg-white rounded-full"
          animate={isOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: -2 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <motion.span
          className="block w-5 h-0.5 bg-white rounded-full mt-1"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block w-5 h-0.5 bg-white rounded-full mt-1"
          animate={isOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 2 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </button>
  );

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMenuOpen 
            ? 'bg-black/90 backdrop-blur-xl border-b border-purple-500/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50"></div>
                  <Image
                    src="/logo.png"
                    alt="Memora Logo"
                    width={40}
                    height={40}
                    className="relative object-contain sm:w-12 sm:h-12"
                  />
                </div>
                <span className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  MEMORA
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="relative text-gray-300 hover:text-white transition-colors group font-medium"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              {!loading && (
                user ? (
                  <Link href="/account">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      ACCOUNT
                    </motion.button>
                  </Link>
                ) : (
                  <Link href="/auth/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    >
                      SIGN UP
                    </motion.button>
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden relative z-50">
              <HamburgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40"
            onClick={closeMenu}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              className="absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-black/95 backdrop-blur-xl border-l border-purple-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex justify-end p-6">
                <button
                  onClick={closeMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="px-4 pb-6">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center gap-3 py-3 px-2 text-white hover:text-purple-300 transition-colors duration-200 group"
                      >
                        <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                          {item.icon}
                        </div>
                        <span className="text-base font-medium">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 + 0.3 }}
                  className="mt-6 pt-4 border-t border-white/10"
                >
                  {!loading && (
                    user ? (
                      <Link href="/account" onClick={closeMenu}>
                        <button className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-sm text-white shadow-lg">
                          <User size={16} />
                          ACCOUNT
                        </button>
                      </Link>
                    ) : (
                      <Link href="/auth/signup" onClick={closeMenu}>
                        <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-sm text-white shadow-lg">
                          SIGN UP
                        </button>
                      </Link>
                    )
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
