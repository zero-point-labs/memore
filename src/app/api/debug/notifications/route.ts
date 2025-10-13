import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases } from '@/lib/appwrite-server';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'notifications';

export async function GET(request: NextRequest) {
  try {
    // Get recent notifications
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      []
    );

    const notifications = response.documents.map(notification => ({
      id: notification.$id,
      userId: notification.userId,
      bookingId: notification.bookingId,
      type: notification.type,
      method: notification.method,
      recipient: notification.recipient,
      subject: notification.subject,
      status: notification.status,
      createdAt: notification.$createdAt
    }));

    return NextResponse.json({
      success: true,
      count: notifications.length,
      notifications: notifications
    });

  } catch (error) {
    console.error('Error getting notifications debug info:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
