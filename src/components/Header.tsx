'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Compass, Camera, MessageSquare, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Next Trip', href: '/next-trip', icon: <Compass size={20} /> },
    { label: 'Gallery', href: '/gallery', icon: <Camera size={20} /> },
    { label: 'Stories', href: '/blog', icon: <FileText size={20} /> },
    { label: 'Contact', href: '/contact', icon: <MessageSquare size={20} /> },
  ];

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const navItemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-purple-500/20' : ''
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50"></div>
                <Image
                  src="/logo.png"
                  alt="Memora Logo"
                  width={48}
                  height={48}
                  className="relative object-contain"
                />
              </div>
              <span className="text-2xl font-black text-white">MEMORA</span>
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
                  className="relative text-gray-300 hover:text-white transition-colors group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Button */}
          {!loading && (
            user ? (
              <Link href="/account">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex items-center gap-2 relative px-6 py-2.5 overflow-hidden rounded-lg font-bold text-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50"></span>
                  <User className="relative w-4 h-4 text-white" />
                  <span className="relative text-white">ACCOUNT</span>
                </motion.button>
              </Link>
            ) : (
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:block relative px-6 py-2.5 overflow-hidden rounded-lg font-bold text-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50"></span>
                  <span className="relative text-white">SIGN UP</span>
                </motion.button>
              </Link>
            )
          )}

          {/* Mobile Menu Button */}
          <div className="lg:hidden relative z-50">
            <AnimatedHamburgerIcon
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-xl z-40 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item) => (
                <motion.div key={item.label} variants={navItemVariants}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 text-2xl text-gray-300 hover:text-white transition-colors group w-full max-w-xs p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-md">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={navItemVariants} className="mt-8 w-full max-w-xs">
                {!loading && (
                  user ? (
                    <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white flex items-center justify-center gap-2 text-lg">
                        <User size={20} />
                        ACCOUNT
                      </button>
                    </Link>
                  ) : (
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white text-lg">
                        SIGN UP
                      </button>
                    </Link>
                  )
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
