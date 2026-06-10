import { Loader2 } from 'lucide-react';
import { GuideItem } from '@/types/guide';
import { ProductCard } from './ProductCard';

interface Props {
  items: GuideItem[];
  loading: boolean;
}

export function ProductList({ items, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Загружаем список материалов...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Ничего не найдено
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <ProductCard key={idx} product={item} />
      ))}
    </div>
  );
}