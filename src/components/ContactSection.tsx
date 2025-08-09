'use client';

import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="relative bg-black py-20">
      {/* Subtle gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>
      
      {/* Subtle background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-pink-600/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-400 mb-8">
            Get in touch with our team or chat with Lora for instant help
          </p>
          
          {/* Contact Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {/* Chat with Lora */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-900/10 to-purple-800/5 border border-purple-500/20 rounded-2xl p-6 cursor-pointer group hover:border-purple-500/40 transition-all duration-300"
            >
              <motion.div 
                className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors"
                whileHover={{ rotate: 10 }}
              >
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </motion.div>
              <h3 className="text-white font-semibold mb-2">Chat with Lora</h3>
              <p className="text-gray-400 text-sm">Instant AI assistance 24/7</p>
            </motion.div>
            
            {/* Email */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-900/10 to-purple-800/5 border border-purple-500/20 rounded-2xl p-6 cursor-pointer group hover:border-purple-500/40 transition-all duration-300"
            >
              <motion.div 
                className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors"
                whileHover={{ rotate: 10 }}
              >
                <Mail className="w-6 h-6 text-purple-400" />
              </motion.div>
              <h3 className="text-white font-semibold mb-2">Email Us</h3>
              <p className="text-gray-400 text-sm">hello@memora.com</p>
            </motion.div>
            
            {/* WhatsApp */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-900/10 to-purple-800/5 border border-purple-500/20 rounded-2xl p-6 cursor-pointer group hover:border-purple-500/40 transition-all duration-300"
            >
              <motion.div 
                className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors"
                whileHover={{ rotate: 10 }}
              >
                <Phone className="w-6 h-6 text-purple-400" />
              </motion.div>
              <h3 className="text-white font-semibold mb-2">WhatsApp</h3>
              <p className="text-gray-400 text-sm">+357 99 123 456</p>
            </motion.div>
          </div>
          
          {/* Quick Message Form */}
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm mb-4">Or send us a quick message</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}