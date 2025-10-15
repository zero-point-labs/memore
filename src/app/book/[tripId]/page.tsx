'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Euro, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  User,
  School,
  Car,
  Bus,
  Bed,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { tripService } from '@/services/tripService';
import { TripDocument } from '@/types/trip';
import { StudentStatus, RoomPreference, TransportPreference } from '@/types/booking';

// Country data for phone numbers
const countries = [
  { code: '+357', name: 'Cyprus', flag: '🇨🇾', key: 'CY' },
  { code: '+30', name: 'Greece', flag: '🇬🇷', key: 'GR' },
  { code: '+1', name: 'United States', flag: '🇺🇸', key: 'US' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', key: 'GB' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', key: 'DE' },
  { code: '+33', name: 'France', flag: '🇫🇷', key: 'FR' },
];

// Cyprus Universities
const cyprusUniversities = [
  'University of Cyprus',
  'Open University of Cyprus', 
  'Cyprus University of Technology',
  'Frederick University',
  'European University Cyprus',
  'University of Nicosia',
  'Neapolis University Paphos',
  'UCLan Cyprus',
  'American University of Cyprus',
  'University of Limassol',
  'Other'
];

interface BookingFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  
  // Student Information
  studentStatus: StudentStatus;
  university: string;
  
  // Trip Preferences
  packageType: string;
  roomPreference: RoomPreference;
  transportPreference: TransportPreference;
  
  // Additional Information
  specialRequests: string;
  emergencyContact: string;
  
  // Communication Preferences
  emailOptIn: boolean;
  smsOptIn: boolean;
  marketingOptIn: boolean;
}

export default function BookTripPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const { profile, createProfile, isProfileComplete } = useUserProfile();
  
  const [trip, setTrip] = useState<TripDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentSettings, setPaymentSettings] = useState<{
    depositPercentage: number;
    balancePercentage: number;
  } | null>(null);
  const [paymentAmounts, setPaymentAmounts] = useState<{
    totalAmount: number;
    depositAmount: number;
    balanceAmount: number;
    depositPercentage: number;
    balancePercentage: number;
  } | null>(null);
  
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '+357',
    phone: '',
    studentStatus: 'college',
    university: '',
    packageType: 'standard',
    roomPreference: 'twin',
    transportPreference: 'bus',
    specialRequests: '',
    emergencyContact: '',
    emailOptIn: true,
    smsOptIn: true,
    marketingOptIn: false
  });

  // Fetch payment amounts with current settings
  const fetchPaymentAmounts = useCallback(async (totalAmount: number) => {
    try {
      const response = await fetch('/api/settings/payment-amounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPaymentSettings({
          depositPercentage: data.depositPercentage,
          balancePercentage: data.balancePercentage
        });
        return data;
      }
    } catch (error) {
      console.error('Error fetching payment amounts:', error);
    }
    
    // Fallback to default calculation
    const depositAmount = Math.round((totalAmount * 30) / 100);
    const balanceAmount = totalAmount - depositAmount;
    return {
      totalAmount,
      depositAmount,
      balanceAmount,
      depositPercentage: 30,
      balancePercentage: 70
    };
  }, []);

  // Load trip data
  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        const tripData = await tripService.getTrip(params.tripId as string);
        if (!tripData) {
          setError('Trip not found');
          return;
        }
        setTrip(tripData);
      } catch (err) {
        console.error('Error loading trip:', err);
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };

    if (params.tripId) {
      loadTrip();
    }
  }, [params.tripId]);

  // Auth protection - redirect non-logged-in users to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/book/${params.tripId}`);
    }
  }, [user, authLoading, router, params.tripId]);

  // Load payment amounts when trip or package type changes
  useEffect(() => {
    const loadPaymentAmounts = async () => {
      if (trip && formData.packageType) {
        const selectedPackagePrice = trip.pricing[formData.packageType as keyof typeof trip.pricing] as number;
        if (selectedPackagePrice) {
          const amounts = await fetchPaymentAmounts(selectedPackagePrice);
          setPaymentAmounts(amounts);
        }
      }
    };

    loadPaymentAmounts();
  }, [trip, formData.packageType, fetchPaymentAmounts]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || user.email,
        phoneCountryCode: profile.phoneCountryCode || '+357',
        phone: profile.phone || '',
        studentStatus: profile.studentStatus || 'college',
        university: profile.university || '',
        emailOptIn: profile.emailOptIn ?? true,
        smsOptIn: profile.smsOptIn ?? true,
        marketingOptIn: profile.marketingOptIn ?? false
      }));
    } else if (user && !profile) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '', // Don't use empty email as default
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [user, profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.email.includes('@') && formData.phone);
      case 2:
        return !!(formData.studentStatus && (formData.studentStatus === 'youth' || formData.university));
      case 3:
        return !!(formData.emergencyContact);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trip || !user) {
      setError('Missing required information');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Create or update user profile if needed
      if (!profile) {
        await createProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          phoneCountryCode: formData.phoneCountryCode,
          university: formData.university,
          studentStatus: formData.studentStatus,
          emailOptIn: formData.emailOptIn,
          smsOptIn: formData.smsOptIn,
          marketingOptIn: formData.marketingOptIn
        });
      }

      // Calculate pricing
      const selectedPackage = trip.pricing[formData.packageType as keyof typeof trip.pricing] as number;
      if (!selectedPackage) {
        throw new Error('Invalid package selected');
      }

      if (!paymentAmounts) {
        throw new Error('Payment amounts not loaded');
      }

      // Redirect to payment processing
      const bookingData = {
        tripId: trip.$id,
        formData,
        pricing: {
          totalAmount: selectedPackage,
          ...paymentAmounts
        }
      };

      // Store booking data in session storage for payment page
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Redirect to payment page
      router.push(`/book/${trip.$id}/payment`);

    } catch (err) {
      console.error('Error processing booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to process booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading trip details...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
          <p className="text-gray-400 mb-6">{error || 'Trip not found'}</p>
          <Link href="/next-trip">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Browse Other Trips
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedPackagePrice = trip.pricing[formData.packageType as keyof typeof trip.pricing] as number;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              <Link href={`/trip/${trip.$id}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Trip Details</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{currentStep}</span>
                </div>
                <span className="text-white font-medium">Step {currentStep} of 4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Trip Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-white mb-4">Trip Summary</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white">{trip.title}</h4>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <MapPin size={16} />
                        <span>{trip.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={16} />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock size={16} />
                      <span>{trip.duration} days</span>
                    </div>

                    <div className="border-t border-purple-500/20 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Package:</span>
                        <span className="text-white capitalize">{formData.packageType}</span>
                      </div>
                      
                      {paymentAmounts && (
                        <>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Total:</span>
                            <span className="text-white font-bold">€{selectedPackagePrice}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Deposit ({paymentAmounts.depositPercentage}%):</span>
                            <span className="text-purple-400">€{paymentAmounts.depositAmount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Balance ({paymentAmounts.balancePercentage}%):</span>
                            <span className="text-yellow-400">€{paymentAmounts.balanceAmount}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-purple-600/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-purple-400 text-sm">
                        <CheckCircle size={16} />
                        <span>Pay {paymentAmounts?.depositPercentage || 30}% now, {paymentAmounts?.balancePercentage || 70}% later</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Balance payment link sent 1 week before trip
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
                >
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Book Your Adventure</h1>
                    <p className="text-gray-400">Complete your booking in just a few steps</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-400'
                          }`}>
                            {step}
                          </div>
                          {step < 4 && (
                            <div className={`w-12 h-0.5 ml-2 transition-colors ${
                              currentStep > step ? 'bg-purple-600' : 'bg-gray-600'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-400">
                      {currentStep === 1 && 'Personal Information'}
                      {currentStep === 2 && 'Student Status & Preferences'}
                      {currentStep === 3 && 'Trip Details & Emergency Contact'}
                      {currentStep === 4 && 'Review & Confirm'}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-white font-medium mb-2">
                              <User className="inline w-4 h-4 mr-2" />
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-white font-medium mb-2">
                              <User className="inline w-4 h-4 mr-2" />
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">
                            <Mail className="inline w-4 h-4 mr-2" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">
                            <Phone className="inline w-4 h-4 mr-2" />
                            Phone Number *
                          </label>
                          <div className="flex gap-2">
                            <select
                              name="phoneCountryCode"
                              value={formData.phoneCountryCode}
                              onChange={handleInputChange}
                              className="px-3 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            >
                              {countries.map((country) => (
                                <option key={country.key} value={country.code} className="bg-black text-white">
                                  {country.flag} {country.code}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter phone number"
                              className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Student Status & Preferences */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-white font-medium mb-2">
                            <School className="inline w-4 h-4 mr-2" />
                            Student Status *
                          </label>
                          <select
                            name="studentStatus"
                            value={formData.studentStatus}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            required
                          >
                            <option value="college" className="bg-black text-white">College/University Student</option>
                            <option value="youth" className="bg-black text-white">Youth (18-28, Not in College)</option>
                          </select>
                        </div>

                        {formData.studentStatus === 'college' && (
                          <div>
                            <label className="block text-white font-medium mb-2">University *</label>
                            <select
                              name="university"
                              value={formData.university}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                              required
                            >
                              <option value="" className="bg-black text-white">Select your university</option>
                              {cyprusUniversities.map((uni) => (
                                <option key={uni} value={uni} className="bg-black text-white">{uni}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-white font-medium mb-2">Package Type</label>
                          <select
                            name="packageType"
                            value={formData.packageType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                          >
                            {Object.entries(trip.pricing).map(([key, price]) => (
                              key !== 'currency' && key !== 'earlyBird' && (
                                <option key={key} value={key} className="bg-black text-white">
                                  {key.charAt(0).toUpperCase() + key.slice(1)} - €{price as number}
                                </option>
                              )
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-white font-medium mb-2">
                              <Bed className="inline w-4 h-4 mr-2" />
                              Room Preference
                            </label>
                            <select
                              name="roomPreference"
                              value={formData.roomPreference}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            >
                              <option value="twin" className="bg-black text-white">Twin Beds (Shared)</option>
                              <option value="double" className="bg-black text-white">Double Bed (Shared)</option>
                              <option value="single" className="bg-black text-white">Single Room (+€50/night)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-white font-medium mb-2">
                              <Bus className="inline w-4 h-4 mr-2" />
                              Transportation
                            </label>
                            <select
                              name="transportPreference"
                              value={formData.transportPreference}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                            >
                              <option value="bus" className="bg-black text-white">Provided Bus</option>
                              <option value="own_car" className="bg-black text-white">Own Car</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Additional Details */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-white font-medium mb-2">
                            <Phone className="inline w-4 h-4 mr-2" />
                            Emergency Contact Phone *
                          </label>
                          <input
                            type="tel"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            placeholder="Emergency contact phone number"
                            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">
                            <MessageSquare className="inline w-4 h-4 mr-2" />
                            Special Requests
                          </label>
                          <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Any dietary requirements, accessibility needs, or special requests..."
                            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                          />
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-white font-medium">Communication Preferences</h4>
                          
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="emailOptIn"
                              checked={formData.emailOptIn}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-purple-600 bg-white/5 border-purple-500/20 rounded focus:ring-purple-500"
                            />
                            <span className="text-gray-300">Send me booking confirmations and trip updates via email</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="smsOptIn"
                              checked={formData.smsOptIn}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-purple-600 bg-white/5 border-purple-500/20 rounded focus:ring-purple-500"
                            />
                            <span className="text-gray-300">Send me important updates via SMS</span>
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              name="marketingOptIn"
                              checked={formData.marketingOptIn}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-purple-600 bg-white/5 border-purple-500/20 rounded focus:ring-purple-500"
                            />
                            <span className="text-gray-300">Send me information about future trips and offers</span>
                          </label>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Review & Confirm */}
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="bg-purple-900/20 rounded-lg p-6">
                          <h4 className="text-white font-bold mb-4">Booking Summary</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400">Name:</div>
                              <div className="text-white">{formData.firstName} {formData.lastName}</div>
                            </div>
                            <div>
                              <div className="text-gray-400">Email:</div>
                              <div className="text-white">{formData.email}</div>
                            </div>
                            <div>
                              <div className="text-gray-400">Phone:</div>
                              <div className="text-white">{formData.phoneCountryCode} {formData.phone}</div>
                            </div>
                            <div>
                              <div className="text-gray-400">Student Status:</div>
                              <div className="text-white capitalize">
                                {formData.studentStatus === 'college' ? 'College Student' : 'Youth (18-28)'}
                              </div>
                            </div>
                            {formData.studentStatus === 'college' && (
                              <div>
                                <div className="text-gray-400">University:</div>
                                <div className="text-white">{formData.university}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-gray-400">Package:</div>
                              <div className="text-white capitalize">{formData.packageType}</div>
                            </div>
                            <div>
                              <div className="text-gray-400">Room:</div>
                              <div className="text-white capitalize">{formData.roomPreference}</div>
                            </div>
                            <div>
                              <div className="text-gray-400">Transport:</div>
                              <div className="text-white capitalize">{formData.transportPreference}</div>
                            </div>
                          </div>
                        </div>

                        {paymentAmounts && (
                          <div className="bg-green-900/20 rounded-lg p-6">
                            <h4 className="text-white font-bold mb-4">Payment Breakdown</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Amount:</span>
                                <span className="text-white font-bold">€{selectedPackagePrice}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Deposit (30% - Pay Now):</span>
                                <span className="text-purple-400 font-bold">€{paymentAmounts.depositAmount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Balance (70% - Auto-charged later):</span>
                                <span className="text-yellow-400 font-bold">€{paymentAmounts.balanceAmount}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-blue-900/20 rounded-lg p-4">
                          <p className="text-blue-300 text-sm">
                            By proceeding, you agree to our terms and conditions. Your payment method will be saved 
                            for the automatic balance collection one week before your trip.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      {currentStep > 1 && (
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-gray-600 rounded-lg text-white font-medium hover:bg-gray-500 transition-colors"
                        >
                          Previous
                        </motion.button>
                      )}
                      
                      {currentStep < 4 ? (
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          disabled={!validateStep(currentStep)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Step
                        </motion.button>
                      ) : (
                        <motion.button
                          type="submit"
                          disabled={submitting}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Processing...' : 'Proceed to Payment'}
                        </motion.button>
                      )}
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
