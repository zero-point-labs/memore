import { NextRequest, NextResponse } from 'next/server';
import { account } from '@/lib/appwrite';

export async function GET(request: NextRequest) {
  try {
    // Test client-side Appwrite configuration
    const config = {
      endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    };

    // Try to get current session (should fail if no session)
    let sessionTest = null;
    try {
      sessionTest = await account.get();
    } catch (error) {
      sessionTest = { error: 'No active session (expected)' };
    }

    return NextResponse.json({
      config,
      sessionTest,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        config: {
          endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
          projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
          databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        }
      },
      { status: 500 }
    );
  }
}

