import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { serverDatabases } from '@/lib/appwrite-server';

// GET /api/debug/cors-test - Test CORS and collection access patterns
export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUGGING CORS AND COLLECTION ACCESS ===');
    
    const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
    
    // Test different collections to see which ones work
    const collections = ['trips', 'events', 'blogs', 'bookings'];
    const results = {};

    for (const collection of collections) {
      console.log(`Testing collection: ${collection}`);
      
      // Test with client-side databases (what frontend uses)
      try {
        const clientResponse = await databases.listDocuments(DATABASE_ID, collection, []);
        results[collection] = {
          client: {
            success: true,
            count: clientResponse.documents.length,
            total: clientResponse.total,
          }
        };
      } catch (error) {
        results[collection] = {
          client: {
            success: false,
            error: error.message,
            code: error.code,
            type: error.type,
          }
        };
      }

      // Test with server-side databases
      try {
        const serverResponse = await serverDatabases.listDocuments(DATABASE_ID, collection, []);
        results[collection] = {
          ...results[collection],
          server: {
            success: true,
            count: serverResponse.documents.length,
            total: serverResponse.total,
          }
        };
      } catch (error) {
        results[collection] = {
          ...results[collection],
          server: {
            success: false,
            error: error.message,
            code: error.code,
            type: error.type,
          }
        };
      }
    }

    // Test specific trips queries that might be failing
    const tripsQueries = {};
    
    try {
      // Test the exact query from getNextTrip
      const now = new Date().toISOString();
      const nextTripResponse = await databases.listDocuments(
        DATABASE_ID,
        'trips',
        [
          // Query.equal('published', true),
          // Query.greaterThan('startDate', now),
          // Query.orderAsc('startDate'),
          // Query.limit(1)
        ]
      );
      tripsQueries.nextTrip = {
        success: true,
        count: nextTripResponse.documents.length,
        query: 'getNextTrip equivalent',
      };
    } catch (error) {
      tripsQueries.nextTrip = {
        success: false,
        error: error.message,
        code: error.code,
        query: 'getNextTrip equivalent',
      };
    }

    try {
      // Test basic trips list (no filters)
      const allTripsResponse = await databases.listDocuments(DATABASE_ID, 'trips', []);
      tripsQueries.allTrips = {
        success: true,
        count: allTripsResponse.documents.length,
        query: 'basic list all',
      };
    } catch (error) {
      tripsQueries.allTrips = {
        success: false,
        error: error.message,
        code: error.code,
        query: 'basic list all',
      };
    }

    // Request information
    const requestInfo = {
      url: request.url,
      method: request.method,
      headers: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        'user-agent': request.headers.get('user-agent'),
      },
      nextUrl: {
        pathname: request.nextUrl.pathname,
        origin: request.nextUrl.origin,
        host: request.nextUrl.host,
        protocol: request.nextUrl.protocol,
      },
    };

    // Environment check
    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      DATABASE_ID,
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment,
      requestInfo,
      collectionTests: results,
      tripsSpecificTests: tripsQueries,
      diagnosis: {
        likelyIssue: 'CORS configuration or collection permissions',
        recommendation: 'Check Appwrite console for trips collection permissions and platform domains',
      }
    });
  } catch (error) {
    console.error('Error in CORS test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test CORS', 
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

// Add CORS headers to the response
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
