import { NextRequest, NextResponse } from 'next/server';
import { serverBookingService } from '@/services/server/bookingService';
import { serverUserProfileService } from '@/services/server/userProfileService';

export async function GET(request: NextRequest) {
  try {
    // Get recent bookings
    const bookings = await serverBookingService.getAll(5); // Get last 5 bookings
    
    const bookingDetails = await Promise.all(
      bookings.bookings.map(async (booking) => {
        let userProfile = null;
        try {
          userProfile = await serverUserProfileService.getByUserId(booking.userId);
        } catch (error) {
          console.log('No user profile found for booking:', booking.$id);
        }

        return {
          bookingId: booking.$id,
          userId: booking.userId,
          bookingStatus: booking.bookingStatus,
          paymentStatus: booking.paymentStatus,
          createdAt: booking.$createdAt,
          userProfile: userProfile ? {
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            phone: userProfile.phone
          } : null
        };
      })
    );

    return NextResponse.json({
      success: true,
      bookings: bookingDetails
    });

  } catch (error) {
    console.error('Error getting recent bookings debug info:', error);
    return NextResponse.json(
      { error: 'Failed to get booking info' },
      { status: 500 }
    );
  }
}
