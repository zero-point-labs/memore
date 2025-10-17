import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/services/reviewService';

const reviewService = new ReviewService();

// GET /api/reviews/trip/[tripId] - Get reviews for a specific trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const { tripId } = await params;
    const reviews = await reviewService.getByTripId(tripId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching trip reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip reviews' },
      { status: 500 }
    );
  }
}
