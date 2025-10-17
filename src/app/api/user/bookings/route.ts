import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { headers } from 'next/headers';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const EVENT_BOOKINGS_COLLECTION_ID = 'event_bookings';
const EVENTS_COLLECTION_ID = 'events';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const userId = authorization.replace('Bearer ', '');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query array
    const queries = [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
      Query.offset(offset)
    ];

    // Add status filter if provided
    if (status && ['confirmed', 'cancelled', 'completed'].includes(status)) {
      queries.push(Query.equal('bookingStatus', status));
    }

    // Get user's bookings
    const bookingsResponse = await databases.listDocuments(
      DATABASE_ID,
      EVENT_BOOKINGS_COLLECTION_ID,
      queries
    );

    // Get event details for each booking
    const bookingsWithEvents = await Promise.all(
      bookingsResponse.documents.map(async (booking) => {
        try {
          const event = await databases.getDocument(
            DATABASE_ID,
            EVENTS_COLLECTION_ID,
            booking.eventId
          );
          
          return {
            ...booking,
            event: {
              id: event.$id,
              title: event.title,
              eventDate: event.eventDate,
              venue: event.venueInfo.venue,
              eventType: event.eventType,
              featuredImage: event.eventContent.featuredImage
            }
          };
        } catch (error) {
          console.error(`Error fetching event ${booking.eventId}:`, error);
          return {
            ...booking,
            event: {
              id: booking.eventId,
              title: 'Event Not Found',
              eventDate: null,
              venue: 'Unknown',
              eventType: 'unknown',
              featuredImage: null
            }
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        bookings: bookingsWithEvents,
        total: bookingsResponse.total,
        hasMore: bookingsResponse.documents.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to cancel a booking
export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const userId = authorization.replace('Bearer ', '');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId, action } = body;

    if (!bookingId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: bookingId, action' },
        { status: 400 }
      );
    }

    if (action !== 'cancel') {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Only "cancel" is supported.' },
        { status: 400 }
      );
    }

    // Get the booking to verify ownership
    let booking;
    try {
      booking = await databases.getDocument(
        DATABASE_ID,
        EVENT_BOOKINGS_COLLECTION_ID,
        bookingId
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (booking.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to cancel this booking' },
        { status: 403 }
      );
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const updatedBooking = await databases.updateDocument(
      DATABASE_ID,
      EVENT_BOOKINGS_COLLECTION_ID,
      bookingId,
      {
        bookingStatus: 'cancelled'
      }
    );

    // Update event capacity (add back the cancelled tickets)
    try {
      const event = await databases.getDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        booking.eventId
      );

      const capacityField = booking.ticketType === 'vip' ? 'vipRemaining' : 'generalRemaining';
      const newCapacity = {
        ...event.capacity,
        [capacityField]: event.capacity[capacityField] + booking.quantity
      };

      // Update booking status if event was sold out
      const totalRemaining = newCapacity.generalRemaining + newCapacity.vipRemaining;
      const newBookingStatus = totalRemaining > 0 ? 'available' : event.bookingStatus;

      await databases.updateDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        booking.eventId,
        {
          capacity: newCapacity,
          bookingStatus: newBookingStatus
        }
      );
    } catch (error) {
      console.error('Error updating event capacity after cancellation:', error);
      // Don't fail the cancellation if capacity update fails
    }

    return NextResponse.json({
      success: true,
      data: {
        bookingId: updatedBooking.$id,
        status: 'cancelled',
        message: 'Booking cancelled successfully'
      }
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
