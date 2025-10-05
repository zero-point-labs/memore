import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '@/services/eventService';

// GET /api/events/featured - Get featured events for homepage
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 4;

    const events = await eventService.getFeaturedEvents(limit);

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured events' },
      { status: 500 }
    );
  }
}

