import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '@/services/eventService';

// GET /api/events/slug/[slug] - Get event by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const event = await eventService.getEventBySlug(resolvedParams.slug);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

