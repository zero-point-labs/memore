import { NextRequest, NextResponse } from 'next/server';
import { serverAccount } from '@/lib/appwrite-server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Delete current session
    await serverAccount.deleteSession('current');

    // Remove session cookie
    const cookieStore = await cookies();
    cookieStore.delete('appwrite-session');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if server logout fails, clear the cookie
    const cookieStore = await cookies();
    cookieStore.delete('appwrite-session');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out (session cleared)'
    });
  }
}

