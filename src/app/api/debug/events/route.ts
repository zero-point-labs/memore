import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'events';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug Events API - Starting...');
    console.log('DATABASE_ID:', DATABASE_ID);
    console.log('COLLECTION_ID:', COLLECTION_ID);
    console.log('Environment variables:');
    console.log('- NEXT_PUBLIC_APPWRITE_ENDPOINT:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
    console.log('- NEXT_PUBLIC_APPWRITE_PROJECT_ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    console.log('- NEXT_PUBLIC_APPWRITE_DATABASE_ID:', process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);

    // Try to fetch raw documents without parsing
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      []
    );

    console.log('Raw response from Appwrite:', {
      total: response.total,
      documentsCount: response.documents.length,
      firstDocumentKeys: response.documents[0] ? Object.keys(response.documents[0]) : 'No documents'
    });

    // Try to parse the first document to see what fails
    let parseError = null;
    let parsedDocument = null;
    
    if (response.documents.length > 0) {
      try {
        const doc = response.documents[0];
        console.log('First document raw data:', {
          id: doc.$id,
          title: (doc as any).title,
          eventDetailsType: typeof (doc as any).eventDetails,
          eventDetailsValue: (doc as any).eventDetails,
          venueInfoType: typeof (doc as any).venueInfo,
          pricingType: typeof (doc as any).pricing,
          capacityType: typeof (doc as any).capacity,
          eventContentType: typeof (doc as any).eventContent,
        });

        // Try parsing each JSON field individually
        const eventDetails = JSON.parse((doc as any).eventDetails || '{}');
        const venueInfo = JSON.parse((doc as any).venueInfo || '{}');
        const pricing = JSON.parse((doc as any).pricing || '{}');
        const capacity = JSON.parse((doc as any).capacity || '{}');
        const eventContent = JSON.parse((doc as any).eventContent || '{}');

        parsedDocument = {
          ...doc,
          eventDetails,
          venueInfo,
          pricing,
          capacity,
          eventContent,
        };

        console.log('Successfully parsed first document');
      } catch (error) {
        parseError = error instanceof Error ? error.message : 'Unknown parsing error';
        console.error('Error parsing first document:', error);
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        environment: process.env.NODE_ENV,
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        totalDocuments: response.total,
        documentsReturned: response.documents.length,
        parseError,
        firstDocumentParsed: !!parsedDocument,
        appwriteEndpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      },
      rawDocuments: response.documents.slice(0, 2), // Return first 2 raw documents
      parsedDocument: parsedDocument ? [parsedDocument] : null,
    });
  } catch (error) {
    console.error('Debug Events API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        environment: process.env.NODE_ENV,
        databaseId: DATABASE_ID,
        collectionId: COLLECTION_ID,
        appwriteEndpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      }
    }, { status: 500 });
  }
}
