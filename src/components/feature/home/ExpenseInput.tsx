import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { Keypad } from '../keypad/Keypad';
import { CategoryGrid } from '../category/CategoryGrid';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

interface ExpenseInputProps {
  categories: Category[];
}

export const ExpenseInput = ({ categories }: ExpenseInputProps) => {
  const [amount, setAmount] = useState('0');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [memo, setMemo] = useState('');

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
      const res = await fetch('/api/expenses', {
        method: 'POST',
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

      if (!res.ok) throw new Error('Failed to save');

      if (navigator.vibrate) navigator.vibrate(50);

      setAmount('0');
      setSelectedCategoryId(null);
      setMemo('');
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-6">
        <div className="text-6xl font-bold tracking-tighter text-teal-900">
          ¥{parseInt(amount).toLocaleString()}
        </div>
        <DatePicker
          date={date ? parseISO(date) : undefined}
          onDateChange={(d) => setDate(d ? format(d, 'yyyy-MM-dd') : '')}
          className="text-gray-400"
        />
      </div>

      <div className="shadow-negative pb-safe rounded-3xl bg-white">
        <div className="no-scrollbar h-56 overflow-y-auto border-b border-gray-100 py-2">
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
        <Keypad onInput={handleInput} onDelete={handleDeleteChar} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
