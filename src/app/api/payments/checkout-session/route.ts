import { NextRequest, NextResponse } from 'next/server';
import { createPaymentLink } from '@/lib/stripe-checkout';
import { serverBookingService } from '@/services/server/bookingService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { tripService } from '@/services/tripService';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, description, paymentType } = await request.json();

    if (!bookingId || !amount || !paymentType) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, amount, paymentType' },
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

    // Get user profile for email
    const userProfile = await serverUserProfileService.getByUserId(booking.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get trip details for description
    let tripTitle = 'Trip';
    try {
      const trip = await tripService.getTrip(booking.tripId);
      if (trip) {
        tripTitle = trip.title;
      }
    } catch (error) {
      console.warn('Could not fetch trip details:', error);
    }

    // Create payment link
    const paymentLink = await createPaymentLink({
      bookingId: booking.$id,
      userId: booking.userId,
      amount: parseFloat(amount),
      currency: booking.currency || 'EUR',
      description: description || `Payment for ${tripTitle}`,
      customerEmail: userProfile.email,
      paymentType,
      tripId: booking.tripId,
    });

    // Update booking with payment link info
    await serverBookingService.update(bookingId, {
      paymentInfo: {
        ...booking.paymentInfo,
        paymentLinks: [
          ...(booking.paymentInfo?.paymentLinks || []),
          {
            sessionId: paymentLink.sessionId,
            url: paymentLink.url,
            amount: parseFloat(amount),
            paymentType,
            createdAt: new Date().toISOString(),
            expiresAt: paymentLink.expiresAt.toISOString(),
            status: 'pending'
          }
        ]
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: paymentLink.sessionId,
      url: paymentLink.url,
      expiresAt: paymentLink.expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    );
  }
}
