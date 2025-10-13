import { NextRequest, NextResponse } from 'next/server';
import { serverBookingService } from '@/services/server/bookingService';
import { serverNotificationService } from '@/services/server/notificationService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { tripService } from '@/services/tripService';

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await serverBookingService.getById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
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
      message: 'Booking confirmation email sent!',
      notificationId: notification.$id,
      sentTo: userProfile.email
    });

  } catch (error) {
    console.error('Error simulating booking email:', error);
    return NextResponse.json(
      { error: 'Failed to send booking email' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Simulate booking confirmation endpoint',
    usage: 'POST with { bookingId: "your-booking-id" }',
    note: 'This manually triggers the booking confirmation email that would normally be sent via Stripe webhook'
  });
}
