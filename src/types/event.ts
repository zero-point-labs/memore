import { Models } from 'appwrite';

export type EventType = 'club-night' | 'beach-party' | 'boat-party' | 'festival' | 'bar-crawl';
export type EventCity = 'ayia-napa' | 'limassol' | 'paphos' | 'larnaca' | 'nicosia' | 'protaras';
export type BookingStatus = 'open' | 'limited' | 'sold-out' | 'cancelled';
export type PaymentType = 'full-upfront' | 'split-50-50' | 'deposit-30-70';

export interface EventLocation {
  lat: number;
  lng: number;
}

export interface EventPricing {
  general: {
    price: number;
    currency: string;
    available: boolean;
  };
  vip?: {
    price: number;
    currency: string;
    available: boolean;
    benefits: string[];
  };
  earlyBird?: {
    price: number;
    deadline: string;
    available: boolean;
  };
}

export interface EventCapacity {
  general: number;
  vip: number;
  generalTaken: number;
  vipTaken: number;
  generalRemaining: number;
  vipRemaining: number;
}

export interface EventDetails {
  longDescription?: string;
  startTime: string;
  endTime: string;
  duration: number;
  ageRestriction: number;
  dresscode?: string;
  paymentType: PaymentType;
  cancellationPolicy?: string;
  organizer?: string;
}

export interface VenueInfo {
  venue: string;
  venueAddress?: string;
  location?: EventLocation;
}

export interface EventContent {
  includes: string[];
  requirements?: string[];
  highlights: string[];
  lineup?: string[];
  category: string[];
  featuredImage: string;
  gallery: string[];
  videoUrl?: string;
}

// Main Event interface matching Appwrite schema
export interface Event {
  id?: string;
  
  // Direct fields (searchable/filterable)
  title: string;
  slug: string;
  description: string;
  eventType: EventType;
  city: EventCity;
  eventDate: string;
  bookingStatus: BookingStatus;
  published: boolean;
  featured: boolean;
  
  // Consolidated JSON fields
  eventDetails: EventDetails;
  venueInfo: VenueInfo;
  pricing: EventPricing;
  capacity: EventCapacity;
  eventContent: EventContent;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export type EventDocument = Models.Document & Event;

export interface CreateEventData {
  title: string;
  slug?: string;
  description: string;
  eventType: EventType;
  city: EventCity;
  eventDate: string;
  bookingStatus?: BookingStatus;
  published?: boolean;
  featured?: boolean;
  eventDetails: EventDetails;
  venueInfo: VenueInfo;
  pricing: EventPricing;
  capacity: EventCapacity;
  eventContent: EventContent;
}

export type UpdateEventData = Partial<CreateEventData>;

export interface UpdateEventCapacityData {
  generalTaken?: number;
  vipTaken?: number;
  bookingStatus?: BookingStatus;
}

export const EVENT_TYPES = [
  { id: 'club-night', label: 'Club Night', icon: '🎵', color: 'from-purple-600 to-pink-600' },
  { id: 'beach-party', label: 'Beach Party', icon: '🏖️', color: 'from-blue-600 to-cyan-600' },
  { id: 'boat-party', label: 'Boat Party', icon: '⛵', color: 'from-cyan-600 to-blue-600' },
  { id: 'festival', label: 'Festival', icon: '🎪', color: 'from-yellow-600 to-orange-600' },
  { id: 'bar-crawl', label: 'Bar Crawl', icon: '🍺', color: 'from-orange-600 to-red-600' },
] as const;

export const EVENT_CITIES = [
  { id: 'ayia-napa', label: 'Ayia Napa', icon: '🌊' },
  { id: 'limassol', label: 'Limassol', icon: '🏙️' },
  { id: 'paphos', label: 'Paphos', icon: '🏛️' },
  { id: 'larnaca', label: 'Larnaca', icon: '✈️' },
  { id: 'nicosia', label: 'Nicosia', icon: '🏰' },
  { id: 'protaras', label: 'Protaras', icon: '🌅' },
] as const;

export const EVENT_BOOKING_STATUSES = [
  { id: 'open', label: 'Open', color: 'text-green-400 bg-green-500/20' },
  { id: 'limited', label: 'Limited Spots', color: 'text-yellow-400 bg-yellow-500/20' },
  { id: 'sold-out', label: 'Sold Out', color: 'text-red-400 bg-red-500/20' },
  { id: 'cancelled', label: 'Cancelled', color: 'text-gray-400 bg-gray-500/20' },
] as const;

// Helper functions
export const calculateCapacityRemaining = (total: number, taken: number): number => {
  return Math.max(0, total - taken);
};

export const determineEventBookingStatus = (
  generalRemaining: number, 
  vipRemaining: number, 
  generalTotal: number,
  vipTotal: number
): BookingStatus => {
  const totalRemaining = generalRemaining + vipRemaining;
  const totalCapacity = generalTotal + vipTotal;
  
  if (totalRemaining === 0) return 'sold-out';
  if (totalRemaining <= totalCapacity * 0.1) return 'limited';
  return 'open';
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
