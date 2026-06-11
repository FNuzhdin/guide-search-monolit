import { useState, useEffect, useCallback } from 'react';
import { GuideItem } from '@/types/guide';
import { useDebounce } from './useDebounce';

export function useSearch() {
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCalculator, setSelectedCalculator] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [results, setResults] = useState<GuideItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [calculators, setCalculators] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 300);

    const fetchResults = useCallback(async () => {
        setLoading(true);
        setError(null)
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (selectedCalculator) params.append('calculator', selectedCalculator);
            if (selectedCategory) params.append('category', selectedCategory);
            params.append('limit', limit.toString());
            params.append('page', page.toString());

            const res = await fetch(`/api/search?${params.toString()}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP ${res.status}`);
            }
            const json = await res.json();
            if (json.success) {
                setResults(json.data);
                setTotal(json.total);
                setTotalPages(json.totalPages);
            } else {
                setResults([]);
                setTotal(0);
                setTotalPages(1);
                setError(json.error || 'Ошибка сервера')
            }
        } catch (err) {
            console.error(err);
            setResults([]);
            setTotal(0);
            setTotalPages(1);
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, selectedCalculator, selectedCategory, limit, page]);

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
                setSelectedCategory('');
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

    // При изменении параметров сбрасываем страницу до 1
    useEffect(() => {
        setPage(1);
    }, [searchTerm, selectedCalculator, selectedCategory, limit]);

    return {
        searchTerm,
        setSearchTerm,
        selectedCalculator,
        setSelectedCalculator,
        selectedCategory,
        setSelectedCategory,
        results,
        total,
        loading,
        calculators,
        categories,
        categoriesLoading,
        limit,
        setLimit,
        page,
        setPage,
        totalPages,
        error,
        fetchResults
    };
}