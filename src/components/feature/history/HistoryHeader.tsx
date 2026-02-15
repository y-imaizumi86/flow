import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useState } from 'react';

interface HistoryHeaderProps {
  currentYear: number;
  currentMonth: number;
  prevMonthParams: string;
  nextMonthParams: string;
}

export const HistoryHeader = ({
  currentYear = new Date().getFullYear(),
  currentMonth = new Date().getMonth() + 1,
  prevMonthParams = '',
  nextMonthParams = '',
}: HistoryHeaderProps) => {
  const [open, setOpen] = useState(false);
  const [selectingYear, setSelectingYear] = useState(currentYear);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleMonthSelect = (month: number) => {
    const formattedMonth = `${selectingYear}-${String(month).padStart(2, '0')}`;
    setOpen(false);
    window.location.search = `?month=${formattedMonth}`;
  };

  return (
    <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 p-4 text-center backdrop-blur-sm">
      <div className="flex items-center justify-center gap-4">
        <a
          href={`?month=${prevMonthParams}`}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-teal-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </a>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 font-bold tracking-tight text-gray-900 transition-colors hover:bg-gray-100">
              <span className="text-xl">
                {currentYear}.{String(currentMonth).padStart(2, '0')}
              </span>
              <Calendar className="h-4 w-4 text-gray-400" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm p-4 pb-8">
              <div className="mb-6 flex items-center justify-between px-4">
                <button
                  onClick={() => setSelectingYear((prev) => prev - 1)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-lg font-bold">{selectingYear}</span>
                <button
                  onClick={() => setSelectingYear((prev) => prev + 1)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {months.map((m) => {
                  const isCurrent = creatingIsCurrent(m, selectingYear, currentMonth, currentYear);
                  return (
                    <button
                      key={m}
                      onClick={() => handleMonthSelect(m)}
                      className={cn(
                        'flex h-12 items-center justify-center rounded-xl text-sm font-bold transition-all',
                        isCurrent
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {m}月
                    </button>
                  );
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <a
          href={`?month=${nextMonthParams}`}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-teal-600"
        >
          <ChevronRight className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

function creatingIsCurrent(
  m: number,
  selectingYear: number,
  currentMonth: number,
  currentYear: number
) {
  return m === currentMonth && selectingYear === currentYear;
}
