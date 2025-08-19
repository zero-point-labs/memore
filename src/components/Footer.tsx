'use client';

import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    support: [
      { label: 'FAQs', href: '#' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    company: [
      { label: 'About Memora', href: '#' },
      { label: 'Reviews', href: '#' },
      { label: 'Partner With Us', href: '#' },
    ],
    trip: [
      { label: 'Next Trip', href: '/next-trip' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Stories', href: '/blog' },
      { label: 'Book Now', href: '/next-trip' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-black border-t border-purple-500/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        {/* Top Section */}
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50"></div>
                  <Image
                    src="/logo.png"
                    alt="Memora Logo"
                    width={56}
                    height={56}
                    className="relative object-contain"
                  />
                </div>
                <h3 className="text-3xl font-black text-white">MEMORA</h3>
              </div>
              <p className="text-gray-400">
                Creating unforgettable 3-day adventures in Cyprus for students who want to party hard and explore harder.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@memora-cy.com" className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@memora-cy.com</span>
              </a>
              <a href="tel:+35799116020" className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span>+357 99 116020</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Nicosia, Cyprus</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                >
                  <social.icon className="w-5 h-5 text-purple-400" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Trip */}
            <div>
              <h4 className="text-white font-bold mb-4">Trip</h4>
              <ul className="space-y-3">
                {footerLinks.trip.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-y border-purple-500/20 py-6 sm:py-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 text-center lg:text-left">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Stay in the loop!</h4>
              <p className="text-gray-400 text-sm sm:text-base">Get exclusive deals and early access to new adventures.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 lg:w-64 px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {currentYear} Memora. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-purple-400" /> in Cyprus
          </p>
        </div>
      </div>
    </footer>
  );
}