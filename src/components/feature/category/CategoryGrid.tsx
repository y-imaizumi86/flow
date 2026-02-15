import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

interface CategoryGridProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const CategoryGrid = ({ categories = [], selectedId, onSelect }: CategoryGridProps) => {
  const IconMap = Icons as unknown as Record<string, LucideIcon>;

  if (!categories) {
    return <div className="p-4 text-center text-sm text-gray-400">Loading categories...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {categories.map((category) => {
        const isSelected = selectedId === category.id;
        const Icon = (category.icon && IconMap[category.icon]) || Icons.HelpCircle;

        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="group flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-95"
          >
            <div
              className={cn(
                'relative flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm transition-all duration-300',
                category.color || 'bg-gray-100 text-gray-600',
                isSelected ? 'scale-110 shadow-lg ring-4 ring-teal-500/30' : ''
              )}
            >
              <Icon className="h-8 w-8" />

              {isSelected && (
                <div className="animate-in zoom-in spin-in-12 absolute -top-1 -right-1 rounded-full bg-teal-600 p-1 text-white shadow-md duration-300">
                  <Check className="h-3 w-3" strokeWidth={4} />
                </div>
              )}
            </div>

            <span
              className={cn(
                'w-full truncate px-1 text-center text-xs font-medium tracking-wide transition-colors',
                isSelected ? 'font-bold text-teal-700' : 'text-gray-400'
              )}
            >
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
