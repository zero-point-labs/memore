import { getServerStripe } from '@/lib/stripe';
import { BookingDocument } from '@/types/booking';
import { TripDocument } from '@/types/trip';

// Helper function to get base URL with proper protocol
function getBaseUrl(): string {
  // In production, use the environment variable or default to the domain
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://memora-experience.com';
  }
  
  // In development, use localhost with protocol
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export interface PaymentLinkOptions {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  paymentType: 'deposit' | 'balance' | 'manual_charge';
  tripId?: string;
  expiresAt?: Date;
}

export interface PaymentLinkResult {
  sessionId: string;
  url: string;
  expiresAt: Date;
}

/**
 * Create a Stripe Checkout Session for payment links
 */
export async function createPaymentLink(options: PaymentLinkOptions): Promise<PaymentLinkResult> {
  const stripe = getServerStripe();
  
  // Calculate expiration (24 hours from now)
  const expiresAt = options.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: options.currency.toLowerCase(),
          product_data: {
            name: options.description,
            description: `Payment for booking ${options.bookingId}`,
          },
          unit_amount: Math.round(options.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    customer_email: options.customerEmail,
    expires_at: Math.floor(expiresAt.getTime() / 1000), // Stripe expects Unix timestamp
    success_url: `${getBaseUrl()}/book/${options.tripId || 'payment'}/success?session_id={CHECKOUT_SESSION_ID}&payment_type=${options.paymentType}`,
    cancel_url: `${getBaseUrl()}/account?payment_cancelled=true`,
    metadata: {
      bookingId: options.bookingId,
      userId: options.userId,
      paymentType: options.paymentType,
      tripId: options.tripId || '',
    },
  });

  if (!session.id || !session.url) {
    throw new Error('Failed to create checkout session');
  }

  return {
    sessionId: session.id,
    url: session.url,
    expiresAt,
  };
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(sessionId: string) {
  const stripe = getServerStripe();
  return await stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Create payment link for booking balance
 */
export async function createBalancePaymentLink(
  booking: BookingDocument,
  trip: TripDocument,
  customerEmail: string
): Promise<PaymentLinkResult> {
  return createPaymentLink({
    bookingId: booking.$id,
    userId: booking.userId,
    amount: booking.balanceAmount,
    currency: booking.currency || 'EUR',
    description: `Balance Payment - ${trip.title}`,
    customerEmail,
    paymentType: 'balance',
    tripId: booking.tripId,
  });
}

/**
 * Create payment link for manual charge
 */
export async function createManualChargePaymentLink(
  booking: BookingDocument,
  amount: number,
  description: string,
  customerEmail: string,
  tripTitle?: string
): Promise<PaymentLinkResult> {
  return createPaymentLink({
    bookingId: booking.$id,
    userId: booking.userId,
    amount,
    currency: booking.currency || 'EUR',
    description: description || `Manual Charge - ${tripTitle || 'Booking'}`,
    customerEmail,
    paymentType: 'manual_charge',
    tripId: booking.tripId,
  });
}
