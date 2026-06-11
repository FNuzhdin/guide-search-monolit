import { NextResponse } from 'next/server';
import { getUniqueCalculators, getUniqueCategories } from '@/lib/guide-cache';

export async function GET() {
  try {
    const [calculators, categories] = await Promise.all([
      getUniqueCalculators(),
      getUniqueCategories(),
    ]);
    return NextResponse.json({ success: true, calculators, categories });
  } catch (error) {
    console.error('Metadata error:', error);
    return NextResponse.json({ error: 'Failed to load metadata' }, { status: 500 });
  }
}