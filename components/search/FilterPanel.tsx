'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface Props {
    calculators: string[];
    categories: string[];
    selectedCalculator: string;
    selectedCategory: string;
    onCalculatorChange: (val: string) => void;
    onCategoryChange: (val: string) => void;
}

export function FilterPanel({
    calculators,
    categories,
    selectedCalculator,
    selectedCategory,
    onCalculatorChange,
    onCategoryChange,
}: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // не рендерить на сервере
    return (
        <div className="flex gap-4">
            <Select value={selectedCalculator || 'all'} onValueChange={(val) => onCalculatorChange(val === 'all' ? '' : val)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Все калькуляторы" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {calculators.map(calc => (
                        <SelectItem key={calc} value={calc}>{calc}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedCategory || 'all'}
                onValueChange={(val) => onCategoryChange(val === 'all' ? '' : val)}
                disabled={!selectedCalculator}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}