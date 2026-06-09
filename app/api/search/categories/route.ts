import { NextRequest, NextResponse } from 'next/server';
import { getCategoriesByCalculator } from '@/lib/guide-cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const calculator = searchParams.get('calculator');

  if (!calculator) {
    return NextResponse.json({ success: false, error: 'Calculator parameter is required' }, { status: 400 });
  }

  try {
    const categories = await getCategoriesByCalculator(calculator);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}