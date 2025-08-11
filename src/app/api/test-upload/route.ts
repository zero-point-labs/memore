import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/appwrite';

export async function GET() {
  try {
    // Test basic configuration
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
    
    return NextResponse.json({
      success: true,
      message: 'Storage configuration loaded',
      config: {
        endpoint: endpoint ? 'Set' : 'Missing',
        projectId: projectId ? 'Set' : 'Missing',
        bucketId: bucketId ? 'Set' : 'Missing'
      }
    });
  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Received file:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    return NextResponse.json({
      success: true,
      message: 'File received successfully',
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error('Upload test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}