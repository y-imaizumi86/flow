import { cn } from '@/lib/utils';
import { Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { CategoryGrid } from '../category/CategoryGrid';
import { Keypad } from '../keypad/Keypad';
import { DrawerClose } from '@/components/ui/drawer';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

interface ExpenseEditFormProps {
  categories: Category[];
  initialValues: {
    id: string;
    amount: number;
    categoryId: string;
    date: string;
    memo?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const ExpenseEditForm = ({
  categories,
  initialValues,
  onSuccess,
  onCancel,
  className,
}: ExpenseEditFormProps) => {
  const [amount, setAmount] = useState(initialValues.amount.toString());
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialValues.categoryId
  );
  const [date, setDate] = useState(initialValues.date);
  const [memo, setMemo] = useState(initialValues.memo || '');

  const handleInput = (value: string) => {
    if (amount === '0') {
      if (value === '00') return;
      setAmount(value);
    } else {
      if (amount.length >= 7) return;
      setAmount((prev) => prev + value);
    }
  };

  const handleDeleteChar = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategoryId) {
      alert('カテゴリを選択してください');
      return;
    }

    try {
      const res = await fetch(`/api/expenses/${initialValues.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          categoryId: selectedCategoryId,
          date,
          memo: memo,
        }),
      });

      if (!res.ok) throw new Error('Failed to update');

      if (navigator.vibrate) navigator.vibrate(50);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      alert('更新に失敗しました');
    }
  };

  const handleDeleteExpense = async () => {
    if (!confirm('この履歴を削除しますか?')) return;

    try {
      const res = await fetch(`/api/expenses/${initialValues.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');
      onSuccess?.();
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className={cn('flex h-full flex-col pb-24', className)}>
      <div className="relative flex flex-1 flex-col items-center justify-center space-y-2 p-4">
        <DrawerClose asChild>
          <button className="absolute top-2 left-2 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 active:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </DrawerClose>
        <div className="text-5xl font-bold tracking-tighter text-teal-900">
          ¥{parseInt(amount).toLocaleString()}
        </div>
        <DatePicker
          date={date ? parseISO(date) : undefined}
          onDateChange={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : '')}
          className="text-gray-400"
        />
        <button
          onClick={handleDeleteExpense}
          className="absolute top-2 right-2 rounded-full p-2 text-red-500 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="shadow-negative pb-safe rounded-t-3xl bg-white">
        <div className="no-scrollbar h-36 overflow-y-auto border-b border-gray-100 py-2">
          <CategoryGrid
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>
        <div className="px-4 py-2">
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Memo"
            className="w-full rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <Keypad
          onInput={handleInput}
          onDelete={handleDeleteChar}
          onSubmit={handleSubmit}
          className="pb-8"
        />
      </div>
    </div>
  );
};
