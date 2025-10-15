import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { account } from '@/lib/appwrite';
import { serverBookingService } from '@/services/server/bookingService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { serverNotificationService } from '@/services/server/notificationService';

const stripe = getServerStripe();

// POST: Create Setup Intent for payment method update
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await account.get();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log(`Creating setup intent for user: ${user.$id}`);

    // Get user profile to find Stripe customer ID
    const userProfile = await serverUserProfileService.getByUserId(user.$id);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    let stripeCustomerId = userProfile.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userProfile.email,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        metadata: {
          userId: user.$id,
          userProfileId: userProfile.$id
        }
      });

      stripeCustomerId = customer.id;

      // Update user profile with Stripe customer ID
      await serverUserProfileService.update(userProfile.$id, {
        stripeCustomerId
      });

      console.log(`Created Stripe customer: ${stripeCustomerId}`);
    }

    // Create Setup Intent for payment method update
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      usage: 'off_session', // For future payments
      metadata: {
        userId: user.$id,
        userProfileId: userProfile.$id,
        purpose: 'payment_method_update'
      }
    });

    console.log(`Setup intent created: ${setupIntent.id}`);

    return NextResponse.json({
      success: true,
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomerId
    });

  } catch (error) {
    console.error('Error creating setup intent:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create setup intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT: Update payment method for user's bookings
export async function PUT(request: NextRequest) {
  try {
    const { paymentMethodId, reason } = await request.json();

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Get current user
    const user = await account.get();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log(`Updating payment method for user: ${user.$id}, new method: ${paymentMethodId}`);

    // Get user profile
    const userProfile = await serverUserProfileService.getByUserId(user.$id);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Verify the payment method belongs to the customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.customer !== userProfile.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Payment method does not belong to this customer' },
        { status: 403 }
      );
    }

    // Get user's active bookings (not fully paid or cancelled)
    const userBookings = await serverBookingService.getByUserId(user.$id);
    const activeBookings = userBookings.filter(booking => 
      booking.bookingStatus !== 'fully_paid' && 
      booking.bookingStatus !== 'cancelled' &&
      booking.bookingStatus !== 'refunded'
    );

    console.log(`Found ${activeBookings.length} active bookings to update`);

    // Update payment method for all active bookings
    const updatePromises = activeBookings.map(async (booking) => {
      const oldPaymentMethodId = booking.paymentMethodId;
      
      // Update booking with new payment method
      await serverBookingService.update(booking.$id, {
        paymentMethodId,
        paymentInfo: {
          ...booking.paymentInfo,
          paymentMethodUpdates: [
            ...(booking.paymentInfo?.paymentMethodUpdates || []),
            {
              date: new Date().toISOString(),
              oldMethodId: oldPaymentMethodId,
              newMethodId: paymentMethodId,
              reason: reason || 'Customer requested update'
            }
          ]
        }
      });

      return booking.$id;
    });

    const updatedBookingIds = await Promise.all(updatePromises);

    // Create notification record
    await serverNotificationService.create({
      userId: user.$id,
      type: 'payment_success', // Using existing type for now
      method: 'email',
      recipient: userProfile.email,
      subject: 'Payment Method Updated',
      content: `Payment method updated for ${updatedBookingIds.length} active booking(s)`,
      template: 'payment-method-update',
      status: 'sent'
    });

    console.log(`Payment method updated for ${updatedBookingIds.length} bookings`);

    return NextResponse.json({
      success: true,
      message: `Payment method updated for ${updatedBookingIds.length} active booking(s)`,
      updatedBookings: updatedBookingIds.length,
      paymentMethodId
    });

  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update payment method',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET: Get current payment method info
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await account.get();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user profile
    const userProfile = await serverUserProfileService.getByUserId(user.$id);
    if (!userProfile || !userProfile.stripeCustomerId) {
      return NextResponse.json({
        success: true,
        hasPaymentMethod: false,
        paymentMethod: null
      });
    }

    // Get user's most recent booking to find current payment method
    const userBookings = await serverBookingService.getByUserId(user.$id);
    const activeBookings = userBookings.filter(booking => 
      booking.bookingStatus !== 'cancelled' && 
      booking.bookingStatus !== 'refunded'
    );

    if (activeBookings.length === 0) {
      return NextResponse.json({
        success: true,
        hasPaymentMethod: false,
        paymentMethod: null
      });
    }

    // Get payment method from most recent booking
    const mostRecentBooking = activeBookings.sort((a, b) => 
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    )[0];

    if (!mostRecentBooking.paymentMethodId) {
      return NextResponse.json({
        success: true,
        hasPaymentMethod: false,
        paymentMethod: null
      });
    }

    // Retrieve payment method details from Stripe
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(mostRecentBooking.paymentMethodId);
      
      return NextResponse.json({
        success: true,
        hasPaymentMethod: true,
        paymentMethod: {
          id: paymentMethod.id,
          type: paymentMethod.type,
          card: paymentMethod.card ? {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            expMonth: paymentMethod.card.exp_month,
            expYear: paymentMethod.card.exp_year
          } : null,
          created: paymentMethod.created
        }
      });
    } catch (stripeError) {
      console.warn('Could not retrieve payment method from Stripe:', stripeError);
      return NextResponse.json({
        success: true,
        hasPaymentMethod: false,
        paymentMethod: null
      });
    }

  } catch (error) {
    console.error('Error getting payment method info:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get payment method info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
