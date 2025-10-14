import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases } from '@/lib/appwrite-server';

// GET /api/debug/direct-trips - Test direct trips access via server API
export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING DIRECT TRIPS ACCESS ===');
    
    const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
    
    // Test 1: Basic trips list via server API
    const tripsResponse = await serverDatabases.listDocuments(
      DATABASE_ID,
      'trips',
      []
    );

    // Test 2: Parse the first trip to see data structure
    let sampleTrip = null;
    if (tripsResponse.documents.length > 0) {
      const doc = tripsResponse.documents[0];
      try {
        sampleTrip = {
          id: doc.$id,
          title: doc.title,
          published: doc.published,
          startDate: doc.startDate,
          endDate: doc.endDate,
          // Try to parse JSON fields
          itinerary: typeof doc.itinerary === 'string' ? JSON.parse(doc.itinerary) : doc.itinerary,
          gallery: typeof doc.gallery === 'string' ? JSON.parse(doc.gallery) : doc.gallery,
          availability: typeof doc.availability === 'string' ? JSON.parse(doc.availability) : doc.availability,
        };
      } catch (parseError) {
        sampleTrip = {
          id: doc.$id,
          title: doc.title,
          parseError: parseError.message,
          rawDoc: doc,
        };
      }
    }

    // Test 3: Check if we can create a simple response that mimics the service
    const processedTrips = tripsResponse.documents.map((doc) => {
      try {
        return {
          $id: doc.$id,
          title: doc.title,
          published: doc.published,
          startDate: doc.startDate,
          endDate: doc.endDate,
          category: doc.category,
          featured: doc.featured,
          // Parse JSON fields safely
          itinerary: typeof doc.itinerary === 'string' ? JSON.parse(doc.itinerary) : doc.itinerary,
          gallery: typeof doc.gallery === 'string' ? JSON.parse(doc.gallery) : doc.gallery,
          highlights: typeof doc.highlights === 'string' ? JSON.parse(doc.highlights) : doc.highlights,
          whatsIncluded: typeof doc.whatsIncluded === 'string' ? JSON.parse(doc.whatsIncluded) : doc.whatsIncluded,
          whatsExcluded: typeof doc.whatsExcluded === 'string' ? JSON.parse(doc.whatsExcluded) : doc.whatsExcluded,
          pricing: typeof doc.pricing === 'string' ? JSON.parse(doc.pricing) : doc.pricing,
          availability: typeof doc.availability === 'string' ? JSON.parse(doc.availability) : doc.availability,
        };
      } catch (error) {
        return {
          $id: doc.$id,
          title: doc.title,
          error: `Failed to parse: ${error.message}`,
        };
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Direct trips access via server API',
      data: {
        totalTrips: tripsResponse.documents.length,
        sampleTrip,
        allTrips: processedTrips,
      },
      meta: {
        database: DATABASE_ID,
        collection: 'trips',
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error in direct trips test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to access trips directly', 
        details: error.message,
        code: error.code || 'unknown',
        type: error.type || 'unknown',
      },
      { status: 500 }
    );
  }
}
