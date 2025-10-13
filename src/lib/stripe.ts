import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance (only initialize if we have the secret key)
export const stripe = typeof window === 'undefined' && process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    })
  : null;

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export const STRIPE_CONFIG = {
  depositPercentage: 30,
  balancePercentage: 70,
  currency: 'EUR',
};

// Helper function to convert euros to cents
export const eurosToCents = (euros: number): number => {
  return Math.round(euros * 100);
};

// Helper function to convert cents to euros
export const centsToEuros = (cents: number): number => {
  return cents / 100;
};

// Calculate deposit and balance amounts (client-safe)
export const calculatePaymentAmounts = (totalAmount: number) => {
  const depositAmount = Math.round((totalAmount * STRIPE_CONFIG.depositPercentage) / 100);
  const balanceAmount = totalAmount - depositAmount;
  
  return {
    totalAmount,
    depositAmount,
    balanceAmount,
    depositCents: eurosToCents(depositAmount),
    balanceCents: eurosToCents(balanceAmount),
  };
};

// Server-side only functions
export const getServerStripe = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerStripe should only be called server-side');
  }
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
  });
};