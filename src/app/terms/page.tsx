'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fadeInUp, fadeIn } from '@/utils/animationVariants';

export default function TermsPage() {
  const lastUpdated = "January 2024";

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
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
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Conditions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services or booking your Cyprus adventure.
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
                {/* Acceptance */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-300 leading-relaxed">
                    By accessing and using the Memora Cyprus website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                {/* Booking Terms */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">2. Booking Terms</h2>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Booking Process</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>All bookings are subject to availability</li>
                        <li>A booking is confirmed only after full payment is received</li>
                        <li>You must be 18+ or have parental consent to book</li>
                        <li>Valid identification and travel documents are required</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Payment Terms</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Payment must be made in full at the time of booking</li>
                        <li>We accept major credit cards and bank transfers</li>
                        <li>All prices are in EUR and include applicable taxes</li>
                        <li>Prices are subject to change without notice</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">3. Cancellation Policy</h2>
                  <div className="text-gray-300 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Cancellation by Customer</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>30+ days before departure: 80% refund</li>
                        <li>15-29 days before departure: 50% refund</li>
                        <li>7-14 days before departure: 25% refund</li>
                        <li>Less than 7 days: No refund</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Cancellation by Memora</h3>
                      <p>If we cancel your trip due to circumstances beyond our control, we will provide a full refund or offer alternative dates.</p>
                    </div>
                  </div>
                </div>

                {/* Trip Inclusions */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Trip Inclusions & Exclusions</h2>
                  <div className="text-gray-300 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Included</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Accommodation as specified</li>
                        <li>Scheduled activities and excursions</li>
                        <li>Transportation during the trip</li>
                        <li>Some meals as indicated in the itinerary</li>
                        <li>Professional trip coordination</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400 mb-2">Not Included</h3>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Flights to/from Cyprus</li>
                        <li>Travel insurance (strongly recommended)</li>
                        <li>Personal expenses and souvenirs</li>
                        <li>Meals not specified in the itinerary</li>
                        <li>Optional activities and upgrades</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Customer Responsibilities</h2>
                  <div className="text-gray-300 space-y-2">
                    <p>As a participant, you agree to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Provide accurate information during booking</li>
                      <li>Arrive with valid travel documents</li>
                      <li>Follow safety guidelines and instructions</li>
                      <li>Respect local laws, customs, and other participants</li>
                      <li>Inform us of any medical conditions or dietary requirements</li>
                      <li>Attend mandatory safety briefings</li>
                      <li>Take responsibility for personal belongings</li>
                    </ul>
                  </div>
                </div>

                {/* Liability */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      Memora Cyprus acts as an intermediary between customers and service providers. While we strive to ensure quality services, we cannot be held responsible for:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Acts of nature, weather conditions, or force majeure events</li>
                      <li>Actions of third-party service providers</li>
                      <li>Personal injury or property damage due to negligence</li>
                      <li>Loss or theft of personal belongings</li>
                      <li>Medical emergencies or pre-existing conditions</li>
                    </ul>
                    <p className="mt-4">
                      We strongly recommend purchasing comprehensive travel insurance.
                    </p>
                  </div>
                </div>

                {/* Behavior Policy */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">7. Behavior Policy</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>We reserve the right to remove participants who:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Engage in illegal activities</li>
                      <li>Threaten the safety or enjoyment of others</li>
                      <li>Fail to follow safety guidelines</li>
                      <li>Are excessively intoxicated or disruptive</li>
                      <li>Violate local laws or customs</li>
                    </ul>
                    <p>No refund will be provided for early departure due to behavioral issues.</p>
                  </div>
                </div>

                {/* Force Majeure */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">8. Force Majeure</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Memora Cyprus shall not be liable for any failure to perform its obligations due to circumstances beyond reasonable control, including but not limited to natural disasters, government actions, terrorism, pandemic, or other force majeure events.
                  </p>
                </div>

                {/* Privacy */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">9. Privacy and Data Protection</h2>
                  <p className="text-gray-300 leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our services, you consent to our privacy practices.
                  </p>
                </div>

                {/* Governing Law */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
                  <p className="text-gray-300 leading-relaxed">
                    These terms and conditions are governed by the laws of Cyprus. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of Cyprus courts.
                  </p>
                </div>

                {/* Changes */}
                <div className="bg-white/5 rounded-xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
                  <p className="text-gray-300 leading-relaxed">
                    We reserve the right to modify these terms and conditions at any time. Updated terms will be posted on our website with a new &quot;Last updated&quot; date. Continued use of our services constitutes acceptance of the modified terms.
                  </p>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30">
                  <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
                  <div className="text-gray-300 space-y-2">
                    <p>If you have any questions about these Terms & Conditions, please contact us:</p>
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