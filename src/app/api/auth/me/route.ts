import { NextRequest, NextResponse } from 'next/server';
import { serverAccount } from '@/lib/appwrite-server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check for session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Get current user using server-side account
    const user = await serverAccount.get();

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
    console.error('Get user error:', error);
    
    // Clear invalid session cookie
    const cookieStore = await cookies();
    cookieStore.delete('appwrite-session');
    
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }
}

