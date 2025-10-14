import { NextRequest, NextResponse } from 'next/server';
import { databases, client } from '@/lib/appwrite';
import { serverDatabases, serverClient } from '@/lib/appwrite-server';

// GET /api/debug/appwrite-connection - Test Appwrite connection and configuration
export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUGGING APPWRITE CONNECTION ===');
    
    // Environment variables check
    const envVars = {
      NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      APPWRITE_API_KEY: process.env.APPWRITE_API_KEY ? '[SET]' : '[NOT SET]',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    console.log('Environment Variables:', envVars);

    // Test client-side configuration
    let clientConfig;
    try {
      clientConfig = {
        endpoint: client.config.endpoint,
        project: client.config.project,
      };
    } catch (error) {
      clientConfig = { error: error.message };
    }

    // Test server-side configuration
    let serverConfig;
    try {
      serverConfig = {
        endpoint: serverClient.config.endpoint,
        project: serverClient.config.project,
        hasApiKey: !!serverClient.config.key,
      };
    } catch (error) {
      serverConfig = { error: error.message };
    }

    // Test database connection with client
    let clientDbTest;
    try {
      const clientResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db',
        'trips',
        []
      );
      clientDbTest = {
        success: true,
        documentsCount: clientResponse.documents.length,
        total: clientResponse.total,
      };
    } catch (error) {
      clientDbTest = {
        success: false,
        error: error.message,
        code: error.code || 'unknown',
        type: error.type || 'unknown',
      };
    }

    // Test database connection with server client
    let serverDbTest;
    try {
      const serverResponse = await serverDatabases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db',
        'trips',
        []
      );
      serverDbTest = {
        success: true,
        documentsCount: serverResponse.documents.length,
        total: serverResponse.total,
      };
    } catch (error) {
      serverDbTest = {
        success: false,
        error: error.message,
        code: error.code || 'unknown',
        type: error.type || 'unknown',
      };
    }

    // Test other collections for comparison
    const collectionTests = {};
    const collectionsToTest = ['events', 'blogs', 'bookings'];
    
    for (const collection of collectionsToTest) {
      try {
        const response = await serverDatabases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db',
          collection,
          []
        );
        collectionTests[collection] = {
          success: true,
          documentsCount: response.documents.length,
          total: response.total,
        };
      } catch (error) {
        collectionTests[collection] = {
          success: false,
          error: error.message,
          code: error.code || 'unknown',
        };
      }
    }

    // Request headers analysis
    const headers = {};
    request.headers.forEach((value, key) => {
      if (key.toLowerCase().includes('host') || 
          key.toLowerCase().includes('origin') || 
          key.toLowerCase().includes('referer') ||
          key.toLowerCase().includes('user-agent')) {
        headers[key] = value;
      }
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envVars,
      clientConfig,
      serverConfig,
      databaseTests: {
        clientConnection: clientDbTest,
        serverConnection: serverDbTest,
      },
      collectionTests,
      requestHeaders: headers,
      url: request.url,
      nextUrl: {
        pathname: request.nextUrl.pathname,
        origin: request.nextUrl.origin,
        host: request.nextUrl.host,
      },
    });
  } catch (error) {
    console.error('Error in Appwrite connection debug:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to debug Appwrite connection', 
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
