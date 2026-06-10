// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGuideData } from '@/lib/guide-cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const calculator = searchParams.get('calculator') || '';
  const category = searchParams.get('category') || '';
  
  let limit = parseInt(searchParams.get('limit') || '100');
  if (isNaN(limit) || limit < 10) limit = 10;
  if (limit > 100) limit = 100;
  limit = Math.round(limit / 10) * 10;

  let page = parseInt(searchParams.get('page') || '1');
  if (isNaN(page) || page < 1) page = 1;

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
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      limit,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}