'use client';

import { useSearch } from '@/hooks/useSearch';
import { SearchInput } from '@/components/search/SearchInput';
import { FilterPanel } from '@/components/search/FilterPanel';
import { LimitSelector } from '@/components/search/LimitSelector';
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
    total,
    limit,
    setLimit,
    loading,
    calculators,
    categories,
    categoriesLoading,
  } = useSearch();

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">📚 Справочник материалов</h1>
      
      <div className="space-y-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
        <FilterPanel
          calculators={calculators}
          categories={categories}
          categoriesLoading={categoriesLoading}
          selectedCalculator={selectedCalculator}
          selectedCategory={selectedCategory}
          onCalculatorChange={setSelectedCalculator}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      <Separator />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {loading ? (
            'Загрузка...'
          ) : total > 0 ? (
            <>
              Найдено: {total} материалов
              {total > results.length && ` (показаны ${results.length} из ${total})`}
            </>
          ) : (
            'Ничего не найдено'
          )}
        </div>
        <LimitSelector limit={limit} onLimitChange={setLimit} />
      </div>
      
      <ProductList items={results} loading={loading} />
    </main>
  );
}