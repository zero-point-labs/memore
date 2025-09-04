'use client';

import { motion } from 'framer-motion';
// Header provided by ConditionalLayout
import Footer from '@/components/Footer';
import { fadeInUp, fadeIn } from '@/utils/animationVariants';

export default function PrivacyPage() {
  const lastUpdated = "January 2024";

  return (
    <div className="min-h-screen bg-black">
      {/* Header provided by ConditionalLayout */}
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-purple-950/30 to-pink-950/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Policy</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="prose prose-invert prose-lg max-w-none"
            >
              <div className="space-y-12">
                {/* Introduction */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Welcome to Memora Cyprus (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services for Cyprus student adventure trips.
                  </p>
                </div>

                {/* Information We Collect */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Personal Information</h3>
                      <p>We may collect personal information that you voluntarily provide, including:</p>
                      <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                        <li>Name and contact information (email, phone number)</li>
                        <li>University information</li>
                        <li>Emergency contact details</li>
                        <li>Dietary requirements and special requests</li>
                        <li>Payment information (processed securely through third-party providers)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Automatically Collected Information</h3>
                      <p>When you visit our website, we may automatically collect:</p>
                      <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                        <li>Device information and browser type</li>
                        <li>IP address and location data</li>
                        <li>Website usage patterns and analytics</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* How We Use Information */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                  <div className="text-gray-300 space-y-2">
                    <p>We use your information to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Process and manage your trip bookings</li>
                      <li>Communicate with you about your reservations and trip details</li>
                      <li>Provide customer support and respond to inquiries</li>
                      <li>Ensure safety and emergency contact capabilities</li>
                      <li>Improve our services and website functionality</li>
                      <li>Send marketing communications (with your consent)</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                </div>

                {/* Information Sharing */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
                  <div className="text-gray-300 space-y-2">
                    <p>We may share your information with:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Service providers (accommodation, transportation, activities)</li>
                      <li>Payment processors for secure transaction handling</li>
                      <li>Legal authorities when required by law</li>
                      <li>Emergency services if necessary for your safety</li>
                    </ul>
                    <p className="mt-4">We do not sell, trade, or rent your personal information to third parties for marketing purposes.</p>
                  </div>
                </div>

                {/* Data Security */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                {/* Your Rights */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                  <div className="text-gray-300 space-y-2">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Access and receive a copy of your personal information</li>
                      <li>Rectify inaccurate or incomplete information</li>
                      <li>Request deletion of your personal information</li>
                      <li>Object to processing of your personal information</li>
                      <li>Request restriction of processing</li>
                      <li>Data portability</li>
                      <li>Withdraw consent at any time</li>
                    </ul>
                  </div>
                </div>

                {/* Cookies */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookies through your browser settings, though this may affect website functionality.
                  </p>
                </div>

                {/* Updates */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">8. Updates to This Policy</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the &quot;Last updated&quot; date.
                  </p>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30">
                  <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
                  <div className="text-gray-300 space-y-2">
                    <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                    <div className="mt-4 space-y-1">
                      <p><span className="text-purple-400 font-semibold">Email:</span> info@memora-cy.com</p>
                      <p><span className="text-purple-400 font-semibold">Phone:</span> +357 99 116020</p>
                      <p><span className="text-purple-400 font-semibold">Address:</span> Nicosia, Cyprus</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}