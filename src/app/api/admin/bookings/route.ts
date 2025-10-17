import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { headers } from 'next/headers';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const EVENT_BOOKINGS_COLLECTION_ID = 'event_bookings';
const EVENTS_COLLECTION_ID = 'events';
const USER_PROFILES_COLLECTION_ID = 'user_profiles';

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

    // TODO: Add admin role verification here
    // For now, we'll allow any authenticated user to access admin endpoints
    // In production, you should verify the user has admin privileges

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const ticketType = searchParams.get('ticketType');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query array
    const queries = [
      Query.limit(limit),
      Query.offset(offset)
    ];

    // Add filters
    if (eventId) {
      queries.push(Query.equal('eventId', eventId));
    }
    
    if (status && ['confirmed', 'cancelled', 'completed'].includes(status)) {
      queries.push(Query.equal('bookingStatus', status));
    }
    
    if (ticketType && ['general', 'vip'].includes(ticketType)) {
      queries.push(Query.equal('ticketType', ticketType));
    }

    // Add sorting
    const sortField = sortBy === 'createdAt' ? '$createdAt' : sortBy;
    const orderMethod = sortOrder === 'desc' ? Query.orderDesc : Query.orderAsc;
    queries.push(orderMethod(sortField));

    // Get bookings
    const bookingsResponse = await databases.listDocuments(
      DATABASE_ID,
      EVENT_BOOKINGS_COLLECTION_ID,
      queries
    );

    // Get related data for each booking
    const bookingsWithDetails = await Promise.all(
      bookingsResponse.documents.map(async (booking) => {
        try {
          // Get event details
          const event = await databases.getDocument(
            DATABASE_ID,
            EVENTS_COLLECTION_ID,
            booking.eventId
          );

          // Get user profile details
          const userProfile = await databases.getDocument(
            DATABASE_ID,
            USER_PROFILES_COLLECTION_ID,
            booking.userProfileId
          );

          return {
            ...booking,
            event: {
              id: event.$id,
              title: event.title,
              eventDate: event.eventDate,
              venue: event.venueInfo.venue,
              eventType: event.eventType
            },
            user: {
              id: userProfile.userId,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              email: userProfile.email,
              phone: userProfile.phone
            }
          };
        } catch (error) {
          console.error(`Error fetching details for booking ${booking.$id}:`, error);
          return {
            ...booking,
            event: {
              id: booking.eventId,
              title: 'Event Not Found',
              eventDate: null,
              venue: 'Unknown',
              eventType: 'unknown'
            },
            user: {
              id: booking.userId,
              firstName: 'Unknown',
              lastName: 'User',
              email: 'unknown@example.com',
              phone: 'N/A'
            }
          };
        }
      })
    );

    // Calculate summary statistics
    const stats = {
      total: bookingsResponse.total,
      confirmed: bookingsResponse.documents.filter(b => b.bookingStatus === 'confirmed').length,
      cancelled: bookingsResponse.documents.filter(b => b.bookingStatus === 'cancelled').length,
      completed: bookingsResponse.documents.filter(b => b.bookingStatus === 'completed').length,
      totalRevenue: bookingsResponse.documents
        .filter(b => b.bookingStatus === 'confirmed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        bookings: bookingsWithDetails,
        stats,
        pagination: {
          total: bookingsResponse.total,
          limit,
          offset,
          hasMore: bookingsResponse.documents.length === limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update booking status
export async function PUT(request: NextRequest) {
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

    // TODO: Add admin role verification here

    const body = await request.json();
    const { bookingId, bookingStatus, notes } = body;

    if (!bookingId || !bookingStatus) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: bookingId, bookingStatus' },
        { status: 400 }
      );
    }

    if (!['confirmed', 'cancelled', 'completed'].includes(bookingStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking status' },
        { status: 400 }
      );
    }

    // Get the booking
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

    // Update booking status
    const updateData: any = { bookingStatus };
    if (notes) {
      updateData.adminNotes = notes;
    }

    const updatedBooking = await databases.updateDocument(
      DATABASE_ID,
      EVENT_BOOKINGS_COLLECTION_ID,
      bookingId,
      updateData
    );

    return NextResponse.json({
      success: true,
      data: {
        bookingId: updatedBooking.$id,
        bookingStatus: updatedBooking.bookingStatus,
        message: 'Booking status updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a booking (admin only)
export async function DELETE(request: NextRequest) {
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

    // TODO: Add admin role verification here

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing bookingId parameter' },
        { status: 400 }
      );
    }

    // Get the booking to verify it exists
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

    // Delete the booking
    await databases.deleteDocument(
      DATABASE_ID,
      EVENT_BOOKINGS_COLLECTION_ID,
      bookingId
    );

    // Update event capacity (add back the deleted tickets)
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
      console.error('Error updating event capacity after deletion:', error);
      // Don't fail the deletion if capacity update fails
    }

    return NextResponse.json({
      success: true,
      data: {
        bookingId,
        message: 'Booking deleted successfully'
      }
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
