import { NextRequest, NextResponse } from 'next/server';
import { GuideItem, ApiResponse } from '@/types/guide';

export const revalidate = 3600;

const API_BASE = process.env.API_BASE || 'https://test.monolit-calculator.ru';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const calculator = searchParams.get('calculator') || '';
  const category = searchParams.get('category') || '';

  // Используем абсолютный URL
  const res = await fetch(`${API_BASE}/api/adminka/guide`, {
    next: { revalidate: 3600 },
  });
  
  const json: ApiResponse = await res.json();
  
  if (!json.success) {
    return NextResponse.json({ error: 'Failed to load guide' }, { status: 500 });
  }

  let items = json.data;

  if (calculator) {
    items = items.filter(item => item.calculator === calculator);
  }
  if (category) {
    items = items.filter(item => item.category === category);
  }
  if (search) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.name_in_bitrix?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search)
    );
  }

  const limited = items.slice(0, 100);
  
  return NextResponse.json({ success: true, data: limited });
}