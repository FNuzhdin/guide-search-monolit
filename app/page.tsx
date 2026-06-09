'use client';

import { useSearch } from '@/hooks/useSearch';
import { SearchInput } from '@/components/search/SearchInput';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ProductList } from '@/components/products/ProductList';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCalculator,
    setSelectedCalculator,
    selectedCategory,
    setSelectedCategory,
    results,
    loading,
    calculators,
    categories,
  } = useSearch();

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">📚 Справочник материалов</h1>
      
      <div className="space-y-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
        <FilterPanel
          calculators={calculators}
          categories={categories}
          selectedCalculator={selectedCalculator}
          selectedCategory={selectedCategory}
          onCalculatorChange={setSelectedCalculator}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      <Separator />
      
      <div className="text-sm text-muted-foreground">
        Найдено: {results.length} материалов
      </div>
      
      <ProductList items={results} loading={loading} />
    </main>
  );
}