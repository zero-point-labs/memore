import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/services/reviewService';

const reviewService = new ReviewService();

// GET /api/reviews - Get all published reviews
export async function GET(request: NextRequest) {
  try {
    const reviews = await reviewService.getAll(true);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
