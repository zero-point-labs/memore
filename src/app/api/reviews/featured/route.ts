import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/services/reviewService';

const reviewService = new ReviewService();

// GET /api/reviews/featured - Get featured reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const reviews = await reviewService.getFeatured(limit);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured reviews' },
      { status: 500 }
    );
  }
}
