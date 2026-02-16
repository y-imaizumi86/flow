import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { Reorder } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CategoryForm } from './CategoryForm';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  order: number;
}

interface CategoryListProps {
  items: Category[];
}

export const CategoryList = ({ items }: CategoryListProps) => {
  const [orderedItems, setOrderedItems] = useState(items);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const IconMap = Icons as unknown as Record<string, LucideIcon>;

  const handleSuccess = () => {
    setIsDrawerOpen(false);
    window.location.reload();
  };

  const handleReorder = (newOrder: Category[]) => {
    setOrderedItems(newOrder);
  };

  const saveOrder = async () => {
    const orderData = orderedItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    try {
      await fetch('/api/categories/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: orderData }),
      });
    } catch (e) {
      console.error('Failed to save order', e);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} modal={false}>
      <Reorder.Group
        axis="y"
        values={orderedItems}
        onReorder={handleReorder}
        className="grid grid-cols-1 gap-3"
      >
        {orderedItems.map((category) => {
          const IconComponent =
            category.icon && IconMap[category.icon] ? IconMap[category.icon] : Icons.HelpCircle;

          return (
            <Reorder.Item
              key={category.id}
              value={category}
              onDragStart={() => {
                isDraggingRef.current = true;
              }}
              onDragEnd={() => {
                saveOrder();
                setTimeout(() => {
                  isDraggingRef.current = false;
                }, 200);
              }}
              className="relative"
            >
              <DrawerTrigger asChild>
                <div className="group flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]">
                  <button
                    onClick={(e) => {
                      if (isDraggingRef.current) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      setSelectedCategory(category);
                    }}
                    className="flex w-full items-center gap-4 text-left"
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full transition-shadow group-hover:shadow-md',
                        category.color
                      )}
                    >
                      <IconComponent className="size-6" />
                    </div>
                    <span className="text-base font-bold text-gray-900">{category.name}</span>
                  </button>
                </div>
              </DrawerTrigger>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <DrawerContent showOverlay={false}>
        <div className="mx-auto w-full max-w-md">
          <div className="max-h-[90vh]">
            {selectedCategory && (
              <CategoryForm
                initialValues={{
                  id: selectedCategory.id,
                  name: selectedCategory.name,
                  icon: selectedCategory.icon || 'HelpCircle',
                  color: selectedCategory.color || 'bg-gray-100 text-gray-600',
                }}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
