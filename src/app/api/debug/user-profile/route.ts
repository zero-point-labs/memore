import { NextRequest, NextResponse } from 'next/server';
import { account, databases } from '@/lib/appwrite';
import { serverUserProfileService } from '@/services/server/userProfileService';

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const user = await account.get();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user profile
    let userProfile;
    try {
      userProfile = await serverUserProfileService.getByUserId(user.$id);
    } catch (error) {
      console.log('No user profile found for user:', user.$id);
    }

    return NextResponse.json({
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
        emailVerification: user.emailVerification,
        registration: user.registration
      },
      userProfile: userProfile ? {
        id: userProfile.$id,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        phoneCountryCode: userProfile.phoneCountryCode
      } : null
    });

  } catch (error) {
    console.error('Error getting user debug info:', error);
    return NextResponse.json(
      { error: 'Failed to get user info' },
      { status: 500 }
    );
  }
}
