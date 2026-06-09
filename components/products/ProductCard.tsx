import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GuideItem } from '@/types/guide';

export function ProductCard({ product }: { product: GuideItem }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-base">{product.name}</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{product.calculator}</Badge>
          <Badge variant="outline">{product.category}</Badge>
          <Badge>{product.unit}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm text-muted-foreground">
          {product.product_weight && <span>⚖️ {product.product_weight} кг</span>}
          {product.product_volume && <span>📦 {product.product_volume} м³</span>}
          <span>🆔 {product.guide_id}</span>
        </div>
      </CardContent>
    </Card>
  );
}