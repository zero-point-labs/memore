import { NextRequest, NextResponse } from 'next/server';
import { tripService } from '@/services/tripService';

// GET /api/trips/debug - Debug trip navigation logic
export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUGGING TRIP NAVIGATION ===');
    
    // Get all trips without filters first
    const allTripsRaw = await tripService.getTrips();
    console.log('Total trips (no filters):', allTripsRaw.length);
    
    // Get only published trips
    const publishedTrips = await tripService.getTrips({ published: true });
    console.log('Published trips:', publishedTrips.length);
    
    // Get upcoming and previous separately (like the navigation hook does)
    const { upcoming, previous } = await tripService.getAllTripsByDate();
    console.log('Upcoming trips:', upcoming.length);
    console.log('Previous trips:', previous.length);
    
    // Combine like the hook does
    const allTrips = [...previous.reverse(), ...upcoming];
    console.log('Combined trips for navigation:', allTrips.length);
    
    // Current time for debugging
    const now = new Date();
    console.log('Current time:', now.toISOString());
    
    // Detailed trip info
    const tripDetails = allTripsRaw.map((trip, index) => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      const isUpcoming = startDate > now;
      const isPast = endDate < now;
      const isCurrent = startDate <= now && endDate >= now;
      
      return {
        index: index + 1,
        id: trip.$id,
        title: trip.title,
        published: trip.published,
        startDate: trip.startDate,
        endDate: trip.endDate,
        isUpcoming,
        isPast,
        isCurrent,
        status: isUpcoming ? 'upcoming' : isPast ? 'past' : 'current'
      };
    });
    
    return NextResponse.json({
      success: true,
      debug: {
        currentTime: now.toISOString(),
        totalTrips: allTripsRaw.length,
        publishedTrips: publishedTrips.length,
        upcomingCount: upcoming.length,
        previousCount: previous.length,
        navigationTripsCount: allTrips.length,
        tripDetails,
        upcomingTrips: upcoming.map(t => ({ id: t.$id, title: t.title, startDate: t.startDate })),
        previousTrips: previous.map(t => ({ id: t.$id, title: t.title, startDate: t.startDate }))
      }
    });
  } catch (error) {
    console.error('Error debugging trips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to debug trips', details: error.message },
      { status: 500 }
    );
  }
}

