import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/appwrite-server';
import { Users } from 'node-appwrite';

export async function GET(request: NextRequest) {
  try {
    const users = new Users(serverClient);
    
    // Get all users from Appwrite Auth
    const response = await users.list();

    const authUsers = response.users.map(user => ({
      id: user.$id,
      email: user.email,
      name: user.name,
      emailVerification: user.emailVerification,
      registration: user.registration
    }));

    return NextResponse.json({
      success: true,
      count: authUsers.length,
      authUsers: authUsers
    });

  } catch (error) {
    console.error('Error getting auth users debug info:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get auth users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
