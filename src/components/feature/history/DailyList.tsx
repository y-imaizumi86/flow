import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { TAILWIND_TO_HEX } from '@/lib/constants';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ExpenseEditForm } from './ExpenseEditForm';
import { useState } from 'react';

interface ExpenseItem {
  id: string;
  amount: number;
  date: string;
  memo: string | null;
  categoryId: string;
  categoryName: string | null;
  categoryColor: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

interface DailyListProps {
  items: ExpenseItem[];
  categories: Category[];
}

export const DailyList = ({ items, categories }: DailyListProps) => {
  const [selectedItem, setSelectedItem] = useState<ExpenseItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const groupedItems = items.reduce(
    (acc, item) => {
      const dateKey = item.date;
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: item.date,
          total: 0,
          items: [],
        };
      }
      acc[dateKey].items.push(item);
      acc[dateKey].total += item.amount;
      return acc;
    },
    {} as Record<string, { date: string; total: number; items: ExpenseItem[] }>
  );

  const sortedDates = Object.keys(groupedItems).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MM/dd (eee)', { locale: ja });
  };

  const handleSuccess = () => {
    setIsDrawerOpen(false);
    window.location.reload();
  };

  return (
    <>
      <div className="space-y-4 pb-24">
        {sortedDates.map((dateKey) => {
          const group = groupedItems[dateKey];
          return (
            <section
              key={dateKey}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3 backdrop-blur-sm">
                <span className="text-sm font-bold text-gray-500">{formatDate(group.date)}</span>
                <span className="font-bold text-gray-900">¥{group.total.toLocaleString()}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {group.items.map((item) => {
                  const chartColor =
                    (item.categoryColor && TAILWIND_TO_HEX[item.categoryColor]) || '#9ca3af';
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDrawerOpen(true);
                      }}
                      className="group flex w-full cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-2.5 w-2.5 rounded-full ring-2 ring-white"
                          style={{ backgroundColor: chartColor }}
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-bold text-gray-900">
                            {item.categoryName}
                          </span>
                          {item.memo && (
                            <span className="max-w-30 truncate text-xs text-gray-400">
                              {item.memo}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        ¥{item.amount.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} modal={false}>
        <DrawerContent showOverlay={false}>
          <div className="mx-auto w-full max-w-md">
            <div className="max-h-[90vh]">
              {selectedItem && (
                <ExpenseEditForm
                  categories={categories}
                  initialValues={{
                    id: selectedItem.id,
                    amount: selectedItem.amount,
                    categoryId: selectedItem.categoryId,
                    date: selectedItem.date,
                    memo: selectedItem.memo || undefined,
                  }}
                  onSuccess={handleSuccess}
                />
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
