import { NextRequest, NextResponse } from 'next/server';
import { getGuideData } from '@/lib/guide-cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const calculator = searchParams.get('calculator') || '';
  const category = searchParams.get('category') || '';

  try {
    const allItems = await getGuideData();

    let filtered = allItems;
    if (calculator) filtered = filtered.filter(item => item.calculator === calculator);
    if (category) filtered = filtered.filter(item => item.category === category);
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.name_in_bitrix?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const limited = filtered.slice(0, 100);

    return NextResponse.json({ success: true, data: limited, total });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}