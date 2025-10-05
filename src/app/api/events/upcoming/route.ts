import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '@/services/eventService';

// GET /api/events/upcoming - Get upcoming events
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    const events = await eventService.getUpcomingEvents(limit);

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}

