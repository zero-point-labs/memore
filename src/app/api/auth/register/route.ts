import { NextRequest, NextResponse } from 'next/server';
import { serverAccount } from '@/lib/appwrite-server';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Create user account using server-side Appwrite
    const user = await serverAccount.create(ID.unique(), email, password, name);
    
    // Create session for the new user
    const session = await serverAccount.createEmailPasswordSession(email, password);
    
    // Get updated user details
    const currentUser = await serverAccount.get();

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('appwrite-session', session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({
      success: true,
      user: {
        $id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
        emailVerification: currentUser.emailVerification,
        prefs: currentUser.prefs
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Registration failed',
        details: error
      },
      { status: 400 }
    );
  }
}

