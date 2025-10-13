import { NextRequest, NextResponse } from 'next/server';
import { serverNotificationService } from '@/services/server/notificationService';
import { serverBookingService } from '@/services/server/bookingService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { tripService } from '@/services/tripService';

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID required' },
        { status: 400 }
      );
    }

    // Find booking by payment intent ID
    const bookingsResponse = await serverBookingService.getAll();
    const booking = bookingsResponse.bookings.find(b => 
      b.depositPaymentIntentId === paymentIntentId || 
      b.balancePaymentIntentId === paymentIntentId
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found for this payment intent' },
        { status: 404 }
      );
    }

    // Get user profile
    const userProfile = await serverUserProfileService.getByUserId(booking.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get trip details
    const trip = await tripService.getTrip(booking.tripId);
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Send booking confirmation email
    const notification = await serverNotificationService.sendBookingConfirmation({
      userId: booking.userId,
      bookingId: booking.$id,
      customerName: `${userProfile.firstName} ${userProfile.lastName}`,
      customerEmail: userProfile.email,
      tripTitle: trip.title,
      tripDate: trip.startDate,
      depositAmount: booking.depositAmount,
      balanceAmount: booking.balanceAmount,
      balanceDueDate: booking.balanceDueDate
    });

    return NextResponse.json({
      success: true,
      message: 'Booking confirmation email sent manually!',
      details: {
        bookingId: booking.$id,
        customerEmail: userProfile.email,
        tripTitle: trip.title,
        notificationId: notification.$id
      }
    });

  } catch (error) {
    console.error('Error sending manual booking confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to send booking confirmation' },
      { status: 500 }
    );
  }
}
