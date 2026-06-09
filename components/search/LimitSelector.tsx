'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  limit: number;
  onLimitChange: (value: number) => void;
}

const LIMIT_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export function LimitSelector({ limit, onLimitChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Показывать:</span>
      <Select value={limit.toString()} onValueChange={(val) => onLimitChange(Number(val))}>
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LIMIT_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt.toString()}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">на странице</span>
    </div>
  );
}