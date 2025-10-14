'use client';

import { useState, useEffect, useCallback } from 'react';
import { clientTripService } from '@/services/tripService.client';
import { TripDocument } from '@/types/trip';

export interface TripNavigationState {
  allTrips: TripDocument[];
  currentTripIndex: number;
  currentTrip: TripDocument | null;
  isLoading: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  direction: 'next' | 'previous' | null;
  totalTrips: number;
}

export interface TripNavigationActions {
  goToNext: () => void;
  goToPrevious: () => void;
  goToTrip: (index: number) => void;
  refreshTrips: () => Promise<void>;
}

export function useTripNavigation(): TripNavigationState & TripNavigationActions {
  const [state, setState] = useState<TripNavigationState>({
    allTrips: [],
    currentTripIndex: 0,
    currentTrip: null,
    isLoading: true,
    hasNext: false,
    hasPrevious: false,
    direction: null,
    totalTrips: 0,
  });

  // Prevent hydration mismatch by ensuring client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch and organize all trips chronologically
  const fetchTrips = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Get all trips organized by date
      const { upcoming, previous } = await clientTripService.getAllTripsByDate();
      
      // Combine trips: previous (reverse chronological), then upcoming (chronological)
      // This puts upcoming trips after previous ones, so the next trip is in the "middle"
      const allTrips = [...previous.reverse(), ...upcoming];
      
      // Find the first upcoming trip (this should be our starting point - the "next" trip)
      let currentIndex = 0;
      if (upcoming.length > 0) {
        // Find the index of the first upcoming trip in the combined array
        currentIndex = previous.length; // upcoming trips start after all previous trips
      } else {
        // No upcoming trips, start with the most recent past trip
        currentIndex = Math.max(0, allTrips.length - 1);
      }
      
      setState(prev => ({
        ...prev,
        allTrips,
        currentTripIndex: currentIndex,
        currentTrip: allTrips[currentIndex] || null,
        totalTrips: allTrips.length,
        hasNext: currentIndex < allTrips.length - 1,
        hasPrevious: currentIndex > 0,
        isLoading: false,
        direction: null,
      }));
    } catch (error) {
      console.error('Error fetching trips for navigation:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        allTrips: [],
        currentTrip: null,
        totalTrips: 0,
        hasNext: false,
        hasPrevious: false,
      }));
    }
  }, []);

  // Navigate to next trip
  const goToNext = useCallback(() => {
    setState(prev => {
      if (!prev.hasNext) return prev;
      
      const newIndex = prev.currentTripIndex + 1;
      return {
        ...prev,
        currentTripIndex: newIndex,
        currentTrip: prev.allTrips[newIndex],
        hasNext: newIndex < prev.allTrips.length - 1,
        hasPrevious: newIndex > 0,
        direction: 'next',
      };
    });

    // Clear direction after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, direction: null }));
    }, 300);
  }, []);

  // Navigate to previous trip
  const goToPrevious = useCallback(() => {
    setState(prev => {
      if (!prev.hasPrevious) return prev;
      
      const newIndex = prev.currentTripIndex - 1;
      return {
        ...prev,
        currentTripIndex: newIndex,
        currentTrip: prev.allTrips[newIndex],
        hasNext: newIndex < prev.allTrips.length - 1,
        hasPrevious: newIndex > 0,
        direction: 'previous',
      };
    });

    // Clear direction after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, direction: null }));
    }, 300);
  }, []);

  // Navigate to specific trip by index
  const goToTrip = useCallback((index: number) => {
    setState(prev => {
      if (index < 0 || index >= prev.allTrips.length) return prev;
      
      const direction = index > prev.currentTripIndex ? 'next' : 'previous';
      
      return {
        ...prev,
        currentTripIndex: index,
        currentTrip: prev.allTrips[index],
        hasNext: index < prev.allTrips.length - 1,
        hasPrevious: index > 0,
        direction: index !== prev.currentTripIndex ? direction : null,
      };
    });

    // Clear direction after animation
    setTimeout(() => {
      setState(prev => ({ ...prev, direction: null }));
    }, 300);
  }, []);

  // Refresh trips data
  const refreshTrips = useCallback(async () => {
    await fetchTrips();
  }, [fetchTrips]);

  // Initial fetch - only run on client to prevent hydration issues
  useEffect(() => {
    if (isClient) {
      fetchTrips();
    }
  }, [isClient, fetchTrips]);

  return {
    ...state,
    goToNext,
    goToPrevious,
    goToTrip,
    refreshTrips,
  };
}

// Helper function to determine trip status
export function getTripStatus(trip: TripDocument): 'upcoming' | 'current' | 'past' {
  const now = new Date();
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  if (now < startDate) {
    return 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    return 'current';
  } else {
    return 'past';
  }
}

// Helper function to get trip position in timeline
export function getTripPosition(trip: TripDocument, allTrips: TripDocument[]): {
  isNext: boolean;
  isLatest: boolean;
  position: number;
  total: number;
} {
  const position = allTrips.findIndex(t => t.$id === trip.$id);
  const upcomingTrips = allTrips.filter(t => getTripStatus(t) === 'upcoming');
  
  return {
    isNext: position === 0 && getTripStatus(trip) === 'upcoming',
    isLatest: position === 0,
    position: position + 1,
    total: allTrips.length,
  };
}
