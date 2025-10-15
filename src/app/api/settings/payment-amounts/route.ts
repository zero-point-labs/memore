import { NextRequest, NextResponse } from 'next/server';
import { serverGlobalSettingsService } from '@/services/server/globalSettingsService';

export async function POST(request: NextRequest) {
  try {
    const { totalAmount } = await request.json();

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    // Get current payment settings and calculate amounts
    const settings = await serverGlobalSettingsService.getOrCreate();
    
    const depositAmount = Math.round((totalAmount * settings.depositPercentage) / 100);
    const balanceAmount = totalAmount - depositAmount;
    
    return NextResponse.json({
      totalAmount,
      depositAmount,
      balanceAmount,
      depositPercentage: settings.depositPercentage,
      balancePercentage: settings.balancePercentage,
      currency: settings.currency
    });

  } catch (error) {
    console.error('Error calculating payment amounts:', error);
    return NextResponse.json(
      { error: 'Failed to calculate payment amounts' },
      { status: 500 }
    );
  }
}
