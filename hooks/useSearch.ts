import { useState, useEffect, useCallback } from 'react';
import { GuideItem } from '@/types/guide';
import { useDebounce } from './useDebounce';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCalculator, setSelectedCalculator] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculators, setCalculators] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCalculator) params.append('calculator', selectedCalculator);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCalculator, selectedCategory]);

  // Загрузка метаданных (калькуляторов) – один раз
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch('/api/search/metadata');
        const json = await res.json();
        if (json.success) {
          setCalculators(json.calculators);
        }
      } catch (err) {
        console.error('Metadata fetch failed:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Загрузка категорий при изменении калькулятора
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedCalculator) {
        setCategories([]);
        setSelectedCategory(''); // сбросить выбранную категорию
        return;
      }
      setCategoriesLoading(true);
      try {
        const res = await fetch(`/api/search/categories?calculator=${encodeURIComponent(selectedCalculator)}`);
        const json = await res.json();
        if (json.success) {
          setCategories(json.categories);
        } else {
          setCategories([]);
        }
        // Сбросить выбранную категорию при смене калькулятора
        setSelectedCategory('');
      } catch (err) {
        console.error('Categories fetch failed:', err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [selectedCalculator]);

  // Загрузка результатов при изменении фильтров
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
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
    categoriesLoading,
  };
}