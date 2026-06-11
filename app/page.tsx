'use client';

import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Pagination } from '@/components/common/Pagination';
import { Loader2 } from 'lucide-react';
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
    page,
    setPage,
    totalPages,
    error,
    fetchResults
  } = useSearch();

  const handleRetry = () => {
    fetchResults();
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Справочник материалов</h1>

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

      {error ? (
        <ErrorAlert message={error} onRetry={handleRetry} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Загрузка...</span>
                </div>
              ) : total > 0 ? (
                <>
                  Найдено: {total} материалов
                  {total > results.length}
                </>
              ) : (
                'Ничего не найдено'
              )}
            </div>
            <LimitSelector limit={limit} onLimitChange={setLimit} />
          </div>
        </>
      )}

      <ProductList items={results} loading={loading} />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
}