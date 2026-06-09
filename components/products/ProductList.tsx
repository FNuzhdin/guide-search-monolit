import { GuideItem } from '@/types/guide';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  items: GuideItem[];
  loading: boolean;
}

export function ProductList({ items, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Ничего не найдено</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <ProductCard key={idx} product={item} />
      ))}
    </div>
  );
}