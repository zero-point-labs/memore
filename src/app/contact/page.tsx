'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, MessageCircle, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Globe, HelpCircle, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Meteors } from '@/components/magicui/meteors';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
import BlurFade from '@/components/ui/BlurFade';
import { cn } from '@/utils/cn';

// Contact options
const contactOptions = [
  {
    id: 'chat',
    title: 'Chat with Lora AI',
    description: 'Instant AI assistance 24/7 for any questions',
    icon: MessageCircle,
    value: 'Available 24/7',
    color: 'from-purple-600 to-pink-600',
    highlight: 'Instant Response'
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Detailed help for complex questions',
    icon: Mail,
    value: 'hello@memora.com',
    color: 'from-blue-600 to-cyan-600',
    highlight: 'Within 24 hours'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Quick messages and voice calls',
    icon: Phone,
    value: '+357 99 123 456',
    color: 'from-green-600 to-emerald-600',
    highlight: 'Business hours'
  }
];

// FAQ Categories
const faqCategories = [
  {
    id: 'booking',
    title: 'Booking & Payments',
    icon: CreditCard,
    questions: [
      {
        question: 'How do I book a Cyprus trip?',
        answer: 'You can book directly through our website using our secure booking form. Choose your package, fill in your details, and complete payment via credit card or PayPal.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. Payment is fully secure and processed through encrypted channels.'
      },
      {
        question: 'Can I cancel or modify my booking?',
        answer: 'Yes! Free cancellation up to 14 days before departure. For modifications, contact us at least 7 days in advance. Cancellation policy varies by package.'
      }
    ]
  },
  {
    id: 'travel',
    title: 'Travel & Logistics',
    icon: Globe,
    questions: [
      {
        question: 'What\'s included in my package?',
        answer: 'All packages include accommodation, activities, transfers, and meals as specified. VIP packages include additional perks like priority access and premium experiences.'
      },
      {
        question: 'Do I need a visa for Cyprus?',
        answer: 'EU citizens need only a valid ID. UK, US, Canada, Australia citizens get 90-day visa-free entry. Check specific requirements for your nationality.'
      },
      {
        question: 'What should I pack for Cyprus?',
        answer: 'Summer clothes, swimwear, comfortable shoes, sun protection, and party outfits for nightlife. We provide a detailed packing list after booking.'
      }
    ]
  },
  {
    id: 'safety',
    title: 'Safety & Support',
    icon: AlertCircle,
    questions: [
      {
        question: 'Is Cyprus safe for young travelers?',
        answer: 'Cyprus is one of the safest countries in Europe. We provide 24/7 support, emergency contacts, and safety briefings for all activities.'
      },
      {
        question: 'What if I have an emergency?',
        answer: 'We have 24/7 emergency support, local contacts, and partnerships with medical facilities. Emergency contact numbers are provided upon arrival.'
      },
      {
        question: 'Are activities supervised?',
        answer: 'All adventure activities are supervised by certified professionals with safety equipment provided. Party events have designated team members ensuring everyone\'s wellbeing.'
      }
    ]
  }
];

// Office locations
const officeLocations = [
  {
    city: 'London',
    address: '123 Oxford Street, London W1D 2HX',
    phone: '+44 20 7123 4567',
    email: 'london@memora.com',
    hours: 'Mon-Fri: 9AM-6PM GMT'
  },
  {
    city: 'Berlin',
    address: 'Unter den Linden 77, 10117 Berlin',
    phone: '+49 30 1234 5678',
    email: 'berlin@memora.com',
    hours: 'Mon-Fri: 9AM-6PM CET'
  },
  {
    city: 'Amsterdam',
    address: 'Damrak 70, 1012 LM Amsterdam',
    phone: '+31 20 123 4567',
    email: 'amsterdam@memora.com',
    hours: 'Mon-Fri: 9AM-6PM CET'
  },
  {
    city: 'Cyprus',
    address: 'Makarios Avenue 45, Nicosia 1065',
    phone: '+357 22 123 456',
    email: 'cyprus@memora.com',
    hours: 'Mon-Sun: 24/7 Support'
  }
];

// Contact form types
const inquiryTypes = [
  { id: 'booking', label: 'New Booking Inquiry' },
  { id: 'support', label: 'Customer Support' },
  { id: 'partnership', label: 'Partnership Opportunities' },
  { id: 'media', label: 'Media & Press' },
  { id: 'feedback', label: 'Feedback & Reviews' },
  { id: 'other', label: 'Other' }
];

// Enhanced Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    inquiryType: 'booking',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setSubmitStatus('idle');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        university: '',
        inquiryType: 'booking',
        subject: '',
        message: '',
        preferredContact: 'email',
        urgency: 'normal'
      });
    }, 3000);
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/20 rounded-2xl p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4">Message Sent Successfully!</h3>
        <p className="text-gray-300 mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours via your preferred contact method.
        </p>
        <div className="space-y-2 text-sm text-gray-400">
          <p>📧 Check your email for a confirmation</p>
          <p>⚡ Urgent inquiries receive priority response</p>
          <p>🤖 Chat with Lora for instant answers</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Send us a Message</h3>
        <p className="text-gray-400">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">University/Organization</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
          />
        </div>

        {/* Inquiry Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Inquiry Type *</label>
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
            >
              {inquiryTypes.map((type) => (
                <option key={type.id} value={type.id} className="bg-black">
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Urgency</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
            >
              <option value="low" className="bg-black">Low - General inquiry</option>
              <option value="normal" className="bg-black">Normal - Standard response</option>
              <option value="high" className="bg-black">High - Need quick response</option>
              <option value="urgent" className="bg-black">Urgent - Emergency/Travel issue</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            placeholder="Brief description of your inquiry..."
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            placeholder="Tell us more about your inquiry, questions, or how we can help..."
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 resize-none"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Preferred Contact Method</label>
          <div className="grid grid-cols-3 gap-3">
            {['email', 'phone', 'whatsapp'].map((method) => (
              <label key={method} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="preferredContact"
                  value={method}
                  checked={formData.preferredContact === method}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={cn(
                  "w-full p-3 rounded-lg border text-center transition-all duration-300",
                  formData.preferredContact === method
                    ? "bg-purple-600/20 border-purple-500/40 text-purple-300"
                    : "bg-white/5 border-purple-500/20 text-gray-400 hover:border-purple-500/30"
                )}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </div>
              </label>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

// FAQ Component
function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('booking');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const activeQuestions = faqCategories.find(cat => cat.id === activeCategory)?.questions || [];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
        <p className="text-gray-400">Quick answers to common questions</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 justify-center">
        {faqCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setExpandedQuestion(null);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300",
              activeCategory === category.id
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            )}
          >
            <category.icon className="w-4 h-4" />
            {category.title}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {activeQuestions.map((qa, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-lg border border-purple-500/20 overflow-hidden"
          >
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <span className="text-white font-medium">{qa.question}</span>
              <motion.div
                animate={{ rotate: expandedQuestion === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <HelpCircle className="w-5 h-5 text-purple-400" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {expandedQuestion === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-purple-500/20"
                >
                  <div className="p-4 text-gray-300">
                    {qa.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Meteors number={10} />
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-[350px] h-[350px] bg-pink-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16 relative">
            {/* Decorative Orbiting Elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none hidden lg:block">
              <OrbitingCircles
                className="h-[40px] w-[40px] border-purple-500/20"
                duration={20}
                delay={0}
                radius={150}
              >
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </OrbitingCircles>
              <OrbitingCircles
                className="h-[40px] w-[40px] border-pink-500/20"
                duration={25}
                delay={5}
                radius={180}
                reverse
              >
                <Mail className="w-6 h-6 text-pink-400" />
              </OrbitingCircles>
              <OrbitingCircles
                className="h-[40px] w-[40px] border-cyan-500/20"
                duration={30}
                delay={10}
                radius={210}
              >
                <Phone className="w-6 h-6 text-cyan-400" />
              </OrbitingCircles>
            </div>

            <BlurFade delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6">
                GET IN <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TOUCH</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
                Have questions about your Cyprus adventure? We&apos;re here to help make your trip unforgettable.
              </p>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactOptions.map((option, index) => (
              <BlurFade key={option.id} delay={0.1 * (index + 1)}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={cn(
                    "relative p-8 rounded-2xl border border-purple-500/20 cursor-pointer group transition-all duration-300 overflow-hidden",
                    "bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm hover:border-purple-500/40"
                  )}
                >
                  {/* Background gradient */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                    option.color
                  )} />
                  
                  <div className="relative z-10">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br",
                      option.color,
                      "bg-opacity-20"
                    )}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{option.title}</h3>
                    <p className="text-gray-400 mb-4">{option.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-white font-medium">{option.value}</p>
                      <span className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r",
                        option.color
                      )}>
                        {option.highlight}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative py-16 bg-gradient-to-br from-purple-950/10 to-pink-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <BlurFade delay={0.1}>
              <ContactForm />
            </BlurFade>

            {/* FAQ Section */}
            <BlurFade delay={0.2}>
              <FAQSection />
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Offices</h2>
              <p className="text-gray-400">Find us across Europe and Cyprus</p>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officeLocations.map((office, index) => (
              <BlurFade key={office.city} delay={0.1 * (index + 1)}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/5 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-3">{office.city}</h3>
                    
                    <div className="space-y-3 text-sm text-gray-400">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{office.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>{office.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>{office.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}