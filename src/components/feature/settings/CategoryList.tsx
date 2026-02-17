import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { Reorder, useDragControls } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CategoryForm } from './CategoryForm';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  order: number;
}

interface CategoryItemProps {
  category: Category;
  IconMap: Record<string, LucideIcon>;
  onSelect: () => void;
  onDragEnd: () => void;
}

const CategoryItem = ({ category, IconMap, onSelect, onDragEnd }: CategoryItemProps) => {
  const dragControls = useDragControls();
  const IconComponent =
    category.icon && IconMap[category.icon] ? IconMap[category.icon] : Icons.HelpCircle;

  return (
    <Reorder.Item
      value={category}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      className="relative touch-none"
    >
      <div className="group flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]">
        <button onClick={onSelect} className="flex flex-1 items-center gap-4 text-left">
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

        {/* Drag Handle */}
        <div
          className="flex h-12 w-10 cursor-grab touch-none items-center justify-center text-gray-300 hover:text-gray-500 active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <Icons.GripVertical className="size-5" />
        </div>
      </div>
    </Reorder.Item>
  );
};

interface CategoryListProps {
  items: Category[];
}

export const CategoryList = ({ items }: CategoryListProps) => {
  const [orderedItems, setOrderedItems] = useState(items);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        {orderedItems.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            IconMap={IconMap}
            onSelect={() => {
              setSelectedCategory(category);
              setIsDrawerOpen(true);
            }}
            onDragEnd={saveOrder}
          />
        ))}
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
