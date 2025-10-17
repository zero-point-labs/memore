import { NextRequest, NextResponse } from 'next/server';
import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { headers } from 'next/headers';
import { CreateEventBookingData, generateBookingReference } from '@/types/event';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const EVENTS_COLLECTION_ID = 'events';
const EVENT_BOOKINGS_COLLECTION_ID = 'event_bookings';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
    // Get authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Extract user ID from authorization header
    const userId = authorization.replace('Bearer ', '');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      ticketType,
      quantity,
      totalPrice,
      currency = 'EUR',
      specialRequests = '',
      bookingReference
    } = body;

    // Validate required fields
    if (!ticketType || !quantity || totalPrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: ticketType, quantity, totalPrice' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Get event details to validate availability
    let event;
    try {
      event = await databases.getDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is still available for booking
    if (event.bookingStatus === 'sold-out') {
      return NextResponse.json(
        { success: false, error: 'Event is sold out' },
        { status: 400 }
      );
    }

    // Check capacity availability
    const capacityField = ticketType === 'vip' ? 'vipRemaining' : 'generalRemaining';
    const remainingCapacity = event.capacity[capacityField];
    
    if (remainingCapacity < quantity) {
      return NextResponse.json(
        { success: false, error: `Not enough ${ticketType} tickets available. Only ${remainingCapacity} remaining.` },
        { status: 400 }
      );
    }

    // For now, we'll use the userId directly instead of requiring a user profile
    // This allows bookings to work even if the user doesn't have a complete profile
    const userProfileId = userId; // Use userId as profileId for now

    // Generate booking reference if not provided
    const finalBookingReference = bookingReference || generateBookingReference();

    // Create booking data
    const bookingData: CreateEventBookingData = {
      eventId,
      userId,
      userProfileId: userProfileId,
      ticketType,
      quantity,
      totalPrice,
      currency,
      bookingStatus: 'confirmed', // Default status for non-payment bookings
      specialRequests,
      bookingReference: finalBookingReference
    };

    // Create the booking
    let booking;
    try {
      booking = await databases.createDocument(
        DATABASE_ID,
        EVENT_BOOKINGS_COLLECTION_ID,
        ID.unique(),
        bookingData
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Update event capacity
    try {
      const newCapacity = {
        ...event.capacity,
        [capacityField]: remainingCapacity - quantity
      };

      // Check if event should be marked as sold out
      const totalRemaining = newCapacity.generalRemaining + newCapacity.vipRemaining;
      const newBookingStatus = totalRemaining === 0 ? 'sold-out' : event.bookingStatus;

      await databases.updateDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        eventId,
        {
          capacity: newCapacity,
          bookingStatus: newBookingStatus
        }
      );
    } catch (error) {
      console.error('Error updating event capacity:', error);
      // Don't fail the booking if capacity update fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        bookingId: booking.$id,
        bookingReference: finalBookingReference,
        eventTitle: event.title,
        eventDate: event.eventDate,
        venue: event.venueInfo.venue,
        ticketType,
        quantity,
        totalPrice,
        currency
      }
    });

  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check booking status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
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

    // Get user's bookings for this event
    const bookings = await databases.listDocuments(
      DATABASE_ID,
      EVENT_BOOKINGS_COLLECTION_ID,
      [
        Query.equal('eventId', eventId),
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt')
      ]
    );

    return NextResponse.json({
      success: true,
      data: bookings.documents
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
