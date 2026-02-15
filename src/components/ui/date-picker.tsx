import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
}

export const DatePicker = ({ date, onDateChange, className }: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  // 日付選択時の処理
  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors hover:text-teal-600',
            !date && 'text-gray-400',
            className
          )}
        >
          <span className={cn('text-base', !date && 'text-gray-400')}>
            {date ? format(date, 'yyyy/MM/dd (eee)', { locale: ja }) : '日付を選択'}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
