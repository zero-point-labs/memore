'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Shield, 
  CreditCard, 
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getStripe } from '@/lib/stripe';
import { clientTripService } from '@/services/tripService.client';
import { userProfileService } from '@/services/userProfileService';
import { bookingService } from '@/services/bookingService';
import { notificationService } from '@/services/notificationService';

const stripePromise = getStripe();

interface PendingBooking {
  tripId: string;
  formData: any;
  pricing: {
    totalAmount: number;
    depositAmount: number;
    balanceAmount: number;
    depositPercentage: number;
    balancePercentage: number;
  };
}

// Stripe Card Element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#9ca3af',
      },
      backgroundColor: 'transparent',
    },
    invalid: {
      color: '#ef4444',
    },
  },
  hidePostalCode: false,
};

function PaymentForm({ pendingBooking }: { pendingBooking: PendingBooking }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { user } = useAuth();
  const { profile, createProfile } = useUserProfile();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'saved'>('card');
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);

  // Load trip data
  useEffect(() => {
    const loadTrip = async () => {
      try {
        const tripData = await clientTripService.getTrip(pendingBooking.tripId);
        setTrip(tripData);
      } catch (err) {
        console.error('Error loading trip:', err);
        setError('Failed to load trip details');
      }
    };

    loadTrip();
  }, [pendingBooking.tripId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user || !trip) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    if (processing) {
      return; // Prevent double submission
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on server (it will handle profile creation)
      const response = await fetch('/api/payments/create-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: pendingBooking.tripId,
          userId: user.$id,
          amount: pendingBooking.pricing.depositAmount,
          totalAmount: pendingBooking.pricing.totalAmount,
          bookingData: pendingBooking.formData,
          savePaymentMethod
        }),
      });

      const { clientSecret, error: serverError } = await response.json();

      if (serverError) {
        throw new Error(serverError);
      }

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${pendingBooking.formData.firstName} ${pendingBooking.formData.lastName}`,
            email: pendingBooking.formData.email,
            phone: `${pendingBooking.formData.phoneCountryCode}${pendingBooking.formData.phone}`,
          },
        },
        setup_future_usage: savePaymentMethod ? 'off_session' : undefined,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Clear pending booking data
        sessionStorage.removeItem('pendingBooking');
        
        // Redirect to success page
        router.push(`/book/${pendingBooking.tripId}/success?payment_intent=${paymentIntent.id}`);
      } else {
        throw new Error('Payment was not completed successfully');
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Secure Payment</h1>
          <p className="text-gray-400">Complete your booking with a secure deposit payment</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-purple-900/20 rounded-lg p-6 mb-8">
          <h3 className="text-white font-bold mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Trip:</span>
              <span className="text-white">{trip?.title || 'Loading...'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-white">€{pendingBooking.pricing.totalAmount}</span>
            </div>
            <div className="border-t border-purple-500/20 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-purple-400">Deposit ({pendingBooking.pricing.depositPercentage}%):</span>
                <span className="text-purple-400">€{pendingBooking.pricing.depositAmount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">Balance ({pendingBooking.pricing.balancePercentage}% - Payment link later):</span>
                <span className="text-yellow-400">€{pendingBooking.pricing.balanceAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <h4 className="text-white font-medium mb-4">Payment Method</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  className="w-4 h-4 text-purple-600"
                />
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span className="text-white">Credit/Debit Card</span>
              </label>
            </div>
          </div>

          {/* Card Element */}
          {paymentMethod === 'card' && (
            <div>
              <label className="block text-white font-medium mb-2">Card Details</label>
              <div className="p-4 bg-white/5 border border-purple-500/20 rounded-lg">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
          )}

          {/* Save Payment Method */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="savePaymentMethod"
              checked={savePaymentMethod}
              onChange={(e) => setSavePaymentMethod(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-white/5 border-purple-500/20 rounded mt-1"
            />
            <div>
              <label htmlFor="savePaymentMethod" className="text-white font-medium cursor-pointer">
                Save payment method for balance payment
              </label>
              <p className="text-sm text-gray-400 mt-1">
                We'll send you a payment link for the remaining {pendingBooking.pricing.balancePercentage}% one week before your trip
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-gray-300">
              Your payment is secured by Stripe. We never store your card details on our servers.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!stripe || processing}
            whileHover={{ scale: processing ? 1 : 1.02 }}
            whileTap={{ scale: processing ? 1 : 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay €{pendingBooking.pricing.depositAmount} Securely
              </>
            )}
          </motion.button>

          <p className="text-xs text-gray-400 text-center">
            By completing this payment, you agree to our terms and conditions.
            Your booking will be confirmed immediately upon successful payment.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get pending booking data from session storage
    const bookingData = sessionStorage.getItem('pendingBooking');
    
    if (!bookingData) {
      // No pending booking, redirect back to booking form
      router.push(`/book/${params.tripId}`);
      return;
    }

    try {
      const parsed = JSON.parse(bookingData);
      
      // Verify the trip ID matches
      if (parsed.tripId !== params.tripId) {
        router.push(`/book/${params.tripId}`);
        return;
      }

      setPendingBooking(parsed);
    } catch (err) {
      console.error('Error parsing booking data:', err);
      router.push(`/book/${params.tripId}`);
      return;
    } finally {
      setLoading(false);
    }
  }, [params.tripId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading payment page...</div>
      </div>
    );
  }

  if (!pendingBooking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Session Expired</h1>
          <p className="text-gray-400 mb-6">Please start your booking again</p>
          <Link href={`/book/${params.tripId}`}>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Back to Booking
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
              <Link href={`/book/${params.tripId}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Booking Form</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <Elements stripe={stripePromise}>
            <PaymentForm pendingBooking={pendingBooking} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
