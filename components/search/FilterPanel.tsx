'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface Props {
    calculators: string[];
    categories: string[];
    categoriesLoading: boolean;
    selectedCalculator: string;
    selectedCategory: string;
    onCalculatorChange: (val: string) => void;
    onCategoryChange: (val: string) => void;
}

export function FilterPanel({
    calculators,
    categories,
    categoriesLoading,
    selectedCalculator,
    selectedCategory,
    onCalculatorChange,
    onCategoryChange,
}: Props) {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // На сервере и во время первого рендера на клиенте показываем скелетон
    if (!mounted) {
        return (
            <div className="flex gap-4">
                <Skeleton className="w-[200px] h-10" />
                <Skeleton className="w-[200px] h-10" />
            </div>
        );
    }
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
                disabled={!selectedCalculator || categoriesLoading}
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

            {categoriesLoading && <Skeleton className="w-[200px] h-10" />}
        </div>
    );
}