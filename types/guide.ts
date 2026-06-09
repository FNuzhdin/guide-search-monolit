export interface GuideItem {
  calculator: string;
  category: string;
  name: string;
  unit: string;
  product_weight: string | null;
  product_volume: string | null;
  id: string;
  name_in_bitrix: string;
  guide_id: number;
  // остальные поля (опционально)
  [key: string]: unknown;
}

export interface SearchParams {
  search?: string;
  calculator?: string;
  category?: string;
}

export interface ApiResponse {
  success: boolean;
  data: GuideItem[];
}