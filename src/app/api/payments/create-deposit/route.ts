import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe, eurosToCents } from '@/lib/stripe';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { serverBookingService } from '@/services/server/bookingService';
import { serverGlobalSettingsService } from '@/services/server/globalSettingsService';
import { serverPaymentScheduleService } from '@/services/server/paymentScheduleService';
import { tripService } from '@/services/tripService';

export async function POST(request: NextRequest) {
  try {
    const stripe = getServerStripe();
    const body = await request.json();
    
    const {
      tripId,
      userId,
      amount,
      totalAmount,
      bookingData,
      savePaymentMethod = true
    } = body;

    // Validate required fields
    if (!tripId || !userId || !amount || !bookingData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email address
    if (!bookingData.email || !bookingData.email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Get or create user profile using server-side service
    let userProfile;
    try {
      userProfile = await serverUserProfileService.getByUserId(userId);
    } catch (error) {
      console.log('User profile not found, will create new one');
      userProfile = null;
    }
    
    if (!userProfile) {
      try {
        console.log('Creating user profile with data:', {
          userId,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          phoneCountryCode: bookingData.phoneCountryCode,
          university: bookingData.university || '',
          studentStatus: bookingData.studentStatus,
          emailOptIn: bookingData.emailOptIn ?? true,
          smsOptIn: bookingData.smsOptIn ?? true,
          marketingOptIn: bookingData.marketingOptIn ?? false
        });

        // Create user profile from booking data using server service
        userProfile = await serverUserProfileService.create({
          userId,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          phoneCountryCode: bookingData.phoneCountryCode,
          university: bookingData.university || '',
          studentStatus: bookingData.studentStatus,
          emailOptIn: bookingData.emailOptIn ?? true,
          smsOptIn: bookingData.smsOptIn ?? true,
          marketingOptIn: bookingData.marketingOptIn ?? false
        });
        console.log('Created new user profile:', userProfile.$id);
      } catch (profileError) {
        console.error('Detailed error creating user profile:', profileError);
        console.error('Profile error details:', {
          message: profileError instanceof Error ? profileError.message : 'Unknown error',
          code: (profileError as any)?.code,
          type: (profileError as any)?.type
        });
        return NextResponse.json(
          { error: `Failed to create user profile: ${profileError instanceof Error ? profileError.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

    // Get trip details
    const trip = await tripService.getTrip(tripId);
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Get global settings for balance due date calculation
    const balanceDueDate = await serverGlobalSettingsService.calculateBalanceDueDate(trip.startDate);

    // Create or get Stripe customer
    let stripeCustomerId = userProfile.stripeCustomerId;
    
    if (!stripeCustomerId) {
      // No customer ID, create new customer
      const customer = await stripe.customers.create({
        email: userProfile.email,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        phone: `${userProfile.phoneCountryCode}${userProfile.phone}`,
        metadata: {
          userId: userId,
          userProfileId: userProfile.$id
        }
      });
      
      stripeCustomerId = customer.id;
      
      // Update user profile with Stripe customer ID
      await serverUserProfileService.updateStripeCustomerId(userId, stripeCustomerId);
    } else {
      // Verify the customer exists in Stripe, create new one if not
      try {
        await stripe.customers.retrieve(stripeCustomerId);
        console.log('Existing Stripe customer found:', stripeCustomerId);
      } catch (customerError) {
        console.log('Stripe customer not found, creating new one:', stripeCustomerId);
        
        // Customer doesn't exist, create a new one
        const customer = await stripe.customers.create({
          email: userProfile.email,
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          phone: `${userProfile.phoneCountryCode}${userProfile.phone}`,
          metadata: {
            userId: userId,
            userProfileId: userProfile.$id
          }
        });
        
        stripeCustomerId = customer.id;
        
        // Update user profile with new Stripe customer ID
        await serverUserProfileService.updateStripeCustomerId(userId, stripeCustomerId);
      }
    }

    // Check for existing pending bookings to prevent duplicates
    try {
      const existingBookings = await serverBookingService.getByUserId(userId);
      const pendingBooking = existingBookings.find(b => 
        b.tripId === tripId && 
        (b.bookingStatus === 'pending' || b.paymentStatus === 'processing')
      );
      
      if (pendingBooking) {
        console.log(`Found existing pending booking: ${pendingBooking.$id}`);
        return NextResponse.json(
          { error: 'You already have a pending booking for this trip. Please complete or cancel it first.' },
          { status: 409 }
        );
      }
    } catch (error) {
      console.warn('Could not check for existing bookings:', error);
    }

    // Calculate payment amounts using the total amount from the client
    const paymentAmounts = totalAmount 
      ? await serverGlobalSettingsService.calculatePaymentAmounts(totalAmount)
      : await serverGlobalSettingsService.calculatePaymentAmounts(
          trip.pricing[bookingData.packageType as keyof typeof trip.pricing] as number
        );

    // Create booking record using server service
    const booking = await serverBookingService.create({
      tripId,
      userId,
      userProfileId: userProfile.$id,
      packageType: bookingData.packageType,
      roomPreference: bookingData.roomPreference,
      transportPreference: bookingData.transportPreference,
      specialRequests: bookingData.specialRequests || '',
      totalAmount: paymentAmounts.depositAmount + paymentAmounts.balanceAmount,
      depositAmount: paymentAmounts.depositAmount,
      balanceAmount: paymentAmounts.balanceAmount,
      currency: 'EUR',
      stripeCustomerId,
      balanceDueDate,
      bookingStatus: 'pending',
      paymentStatus: 'pending'
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: eurosToCents(amount),
      currency: 'eur',
      customer: stripeCustomerId,
      setup_future_usage: savePaymentMethod ? 'off_session' : undefined,
      metadata: {
        bookingId: booking.$id,
        tripId,
        userId,
        paymentType: 'deposit'
      },
      description: `Deposit for ${trip.title} - ${userProfile.firstName} ${userProfile.lastName}`,
      receipt_email: userProfile.email,
    });

    // Update booking with payment intent ID
    await serverBookingService.updatePaymentInfo(booking.$id, {
      depositPaymentIntentId: paymentIntent.id,
      paymentStatus: 'processing'
    });

    // Create balance payment schedule for automatic collection
    await serverPaymentScheduleService.createBalanceSchedule(
      booking.$id,
      userId,
      paymentAmounts.balanceAmount,
      balanceDueDate,
      undefined // Payment method will be attached after successful deposit
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.$id
    });

  } catch (error) {
    console.error('Error creating deposit payment:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
