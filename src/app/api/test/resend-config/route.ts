import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const apiKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 10) || 'Not found';
    
    return NextResponse.json({
      hasApiKey,
      apiKeyPrefix: hasApiKey ? `${apiKeyPrefix}...` : 'Not found',
      message: hasApiKey ? 'API key is configured' : 'API key is missing'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
