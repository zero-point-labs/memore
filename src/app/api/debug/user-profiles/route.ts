import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases } from '@/lib/appwrite-server';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'user_profiles';

export async function GET(request: NextRequest) {
  try {
    // Get all user profiles
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      []
    );

    const profiles = response.documents.map(profile => ({
      id: profile.$id,
      userId: profile.userId,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      createdAt: profile.$createdAt
    }));

    return NextResponse.json({
      success: true,
      count: profiles.length,
      profiles: profiles
    });

  } catch (error) {
    console.error('Error getting user profiles debug info:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get user profiles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
