import { Models } from 'appwrite';

export interface TripItineraryItem {
  time: string;
  activity: string;
  icon: string;
  description: string;
  included: string[];
}

export interface TripItineraryDay {
  day: string;
  date: string;
  title: string;
  theme: string;
  items: TripItineraryItem[];
}

export interface TripAvailability {
  totalSpots: number;
  spotsTaken: number;
  spotsRemaining: number; // calculated automatically
  apartmentsAvailable: number;
  apartmentCapacity: number;
  waitingListCount: number;
  bookingStatus: 'open' | 'limited' | 'closed' | 'sold-out';
}

export interface TripGalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  altText?: string;
  order: number;
}

export interface TripPricing {
  standard?: number;
  premium?: number;
  vip?: number;
  currency: string;
  earlyBird?: {
    price: number;
    deadline: string;
  };
}

export interface Trip {
  id?: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number; // in days
  itinerary: TripItineraryDay[];
  gallery: string[] | TripGalleryImage[]; // Support both formats for migration
  pricing: TripPricing;
  category: 'beach-party' | 'cultural-tour' | 'adventure' | 'luxury' | 'mixed';
  highlights: string[];
  whatsIncluded: string[];
  whatsExcluded: string[];
  availability: TripAvailability;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TripDocument = Models.Document & Trip;

export interface CreateTripData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: number;
  itinerary: TripItineraryDay[];
  gallery: string[];
  pricing: TripPricing;
  category: 'beach-party' | 'cultural-tour' | 'adventure' | 'luxury' | 'mixed';
  highlights: string[];
  whatsIncluded: string[];
  whatsExcluded: string[];
  availability: TripAvailability;
  published?: boolean;
}

export type UpdateTripData = Partial<CreateTripData>;

export interface UpdateTripAvailabilityData {
  totalSpots?: number;
  spotsTaken?: number;
  apartmentsAvailable?: number;
  apartmentCapacity?: number;
  waitingListCount?: number;
  bookingStatus?: 'open' | 'limited' | 'closed' | 'sold-out';
}

export const TRIP_CATEGORIES = [
  { id: 'beach-party', label: 'Beach Party', icon: '🏖️', color: 'from-blue-600 to-cyan-600' },
  { id: 'cultural-tour', label: 'Cultural Tour', icon: '🏛️', color: 'from-yellow-600 to-orange-600' },
  { id: 'adventure', label: 'Adventure', icon: '🗻', color: 'from-green-600 to-emerald-600' },
  { id: 'luxury', label: 'Luxury', icon: '💎', color: 'from-purple-600 to-pink-600' },
  { id: 'mixed', label: 'Mixed Experience', icon: '🌟', color: 'from-pink-600 to-rose-600' },
] as const;

export const BOOKING_STATUSES = [
  { id: 'open', label: 'Open', color: 'text-green-400 bg-green-500/20' },
  { id: 'limited', label: 'Limited Spots', color: 'text-yellow-400 bg-yellow-500/20' },
  { id: 'closed', label: 'Closed', color: 'text-red-400 bg-red-500/20' },
  { id: 'sold-out', label: 'Sold Out', color: 'text-gray-400 bg-gray-500/20' },
] as const;

// Helper function to calculate spots remaining
export const calculateSpotsRemaining = (totalSpots: number, spotsTaken: number): number => {
  return Math.max(0, totalSpots - spotsTaken);
};

// Helper function to determine booking status based on availability
export const determineBookingStatus = (spotsRemaining: number, totalSpots: number): TripAvailability['bookingStatus'] => {
  if (spotsRemaining === 0) return 'sold-out';
  if (spotsRemaining <= totalSpots * 0.1) return 'limited'; // Less than 10% remaining
  return 'open';
};
