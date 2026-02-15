import { DrawerClose } from '@/components/ui/drawer';
import { AVAILABLE_COLORS, AVAILABLE_ICONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Check, Loader2, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface CategoryFormProps {
  initialValues?: {
    id?: string;
    name: string;
    icon: string;
    color: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CategoryForm = ({ initialValues, onSuccess }: CategoryFormProps) => {
  const isEditMode = !!initialValues?.id;

  const [name, setName] = useState(initialValues?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(initialValues?.icon || 'HelpCircle');
  const [selectedColor, setSelectedColor] = useState(initialValues?.color || AVAILABLE_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const IconMap = Icons as unknown as Record<string, LucideIcon>;
  const PreviewIcon = IconMap[selectedIcon] || Icons.HelpCircle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const url = isEditMode ? `/api/categories/${initialValues?.id}` : '/api/categories';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          icon: selectedIcon,
          color: selectedColor,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert('保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !initialValues?.id) return;
    if (
      !confirm(
        'このカテゴリを削除しますか？\n(紐付いている支出データはOtherカテゴリに変更されます)'
      )
    )
      return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${initialValues.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-6 p-4 pb-40">
      <div className="flex flex-col items-center gap-4 py-4">
        <DrawerClose asChild>
          <button
            type="button"
            className="absolute top-0 left-0 rounded-full p-2 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </DrawerClose>

        {isEditMode && initialValues?.id !== '6' && (
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-0 right-0 rounded-full p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-6 w-6" />
          </button>
        )}

        <div
          className={cn(
            'flex h-20 w-20 items-center justify-center rounded-full shadow-sm transition-all',
            selectedColor
          )}
        >
          <PreviewIcon className="h-10 w-10" />
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category"
          className="w-full border-none bg-transparent text-center text-2xl font-bold text-gray-900 placeholder:text-gray-300 focus:ring-0 focus:outline-none"
          disabled={initialValues?.id === '6'}
          autoFocus={!isEditMode}
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Color</label>
          <div className="grid grid-cols-6 place-items-center gap-3">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                  color,
                  selectedColor === color
                    ? 'scale-110 shadow-md ring-2 ring-gray-400'
                    : 'opacity-70 hover:opacity-100'
                )}
              >
                {selectedColor === color && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold tracking-wider text-gray-400 uppercase">Icon</label>
          <div className="grid grid-cols-6 place-items-center gap-3">
            {AVAILABLE_ICONS.map((iconName) => {
              const Icon = IconMap[iconName] || Icons.HelpCircle;
              const isSelected = selectedIcon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl border transition-all',
                    isSelected
                      ? 'border-teal-200 bg-teal-50 text-teal-700 ring-2 ring-teal-100'
                      : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!name.trim() || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 py-3 font-bold text-white shadow-lg transition-all hover:bg-teal-700 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};
