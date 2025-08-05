'use client';

import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    adventures: [
      { label: 'Day 1 - Beach Party', href: '#' },
      { label: 'Day 2 - Boat Trip', href: '#' },
      { label: 'Day 3 - Club Night', href: '#' },
      { label: 'All Activities', href: '#' },
    ],
    support: [
      { label: 'FAQs', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
    company: [
      { label: 'About Memora', href: '#' },
      { label: 'Reviews', href: '#' },
      { label: 'Partner With Us', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-black border-t border-purple-500/20 mt-20">
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
              <h3 className="text-3xl font-black text-white mb-2">MEMORA</h3>
              <p className="text-gray-400">
                Creating unforgettable 3-day adventures in Cyprus for students who want to party hard and explore harder.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@memora.com" className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span>hello@memora.com</span>
              </a>
              <a href="tel:+35799123456" className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span>+357 99 123 456</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Ayia Napa, Cyprus</span>
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
            {/* Adventures */}
            <div>
              <h4 className="text-white font-bold mb-4">Adventures</h4>
              <ul className="space-y-3">
                {footerLinks.adventures.map((link) => (
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