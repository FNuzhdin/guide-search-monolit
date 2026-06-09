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

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                console.log('Fetching metadata...');
                const res = await fetch('/api/search/metadata');
                console.log('Metadata response status:', res.status);
                const json = await res.json();
                console.log('Metadata json:', json);
                if (json.success) {
                    setCalculators(json.calculators);
                    setCategories(json.categories);
                }
            } catch (err) {
                console.error('Metadata fetch failed:', err);
            }
        };
        fetchMetadata();
    }, []);

    useEffect(() => {
        fetchResults();
    }, [debouncedSearch, selectedCalculator, selectedCategory, fetchResults]);



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
    };
}