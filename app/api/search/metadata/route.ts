import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/guide';

export const revalidate = 3600;

const API_BASE = process.env.API_BASE || 'https://test.monolit-calculator.ru';

export async function GET() {
  const res = await fetch(`${API_BASE}/api/adminka/guide`, { next: { revalidate: 3600 } });
  const json: ApiResponse = await res.json();
  
  if (!json.success) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
  
  const calculators = [...new Set(json.data.map(item => item.calculator))].sort();
  const categories = [...new Set(json.data.map(item => item.category))].sort();
  
  return NextResponse.json({ success: true, calculators, categories });
}