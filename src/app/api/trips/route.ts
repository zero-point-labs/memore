import { NextRequest, NextResponse } from 'next/server';
import { tripService } from '@/services/tripService';

// GET /api/trips - List all trips with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const options = {
      category: searchParams.get('category') || undefined,
      published: searchParams.get('published') === 'true' ? true : searchParams.get('published') === 'false' ? false : undefined,
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      bookingStatus: searchParams.get('bookingStatus') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    };

    const trips = await tripService.getTrips(options);

    return NextResponse.json({
      success: true,
      data: trips,
      count: trips.length,
      debug: {
        searchParams: Object.fromEntries(searchParams.entries()),
        options
      }
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}
