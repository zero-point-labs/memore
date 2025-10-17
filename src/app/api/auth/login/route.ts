import { NextRequest, NextResponse } from 'next/server';
import { serverAccount } from '@/lib/appwrite-server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create session using server-side Appwrite
    const session = await serverAccount.createEmailPasswordSession(email, password);
    
    // Get user details
    const user = await serverAccount.get();

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
        $id: user.$id,
        name: user.name,
        email: user.email,
        emailVerification: user.emailVerification,
        prefs: user.prefs
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Login failed',
        details: error
      },
      { status: 401 }
    );
  }
}

