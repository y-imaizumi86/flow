import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Delete } from 'lucide-react';

interface KeypadProps {
  onInput: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  className?: string;
}

export const Keypad = ({ onInput, onDelete, onSubmit, className }: KeypadProps) => {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00'];

  return (
    <div
      className={cn(
        'shadow-negative grid grid-cols-3 gap-2 border-t border-gray-100 bg-white px-4 pt-4 pb-8',
        className
      )}
    >
      {keys.map((key) => (
        <Button
          key={key}
          variant="ghost"
          className="h-12 rounded-2xl text-2xl font-medium transition-transform active:scale-95"
          onClick={() => onInput(key)}
        >
          {key}
        </Button>
      ))}

      <Button
        variant="ghost"
        className="h-12 rounded-2xl text-red-500 transition-transform hover:bg-red-100 active:scale-95"
        onClick={onDelete}
      >
        <Delete className="size-6" />
      </Button>

      <Button
        className="col-span-3 mt-2 h-12 rounded-2xl bg-teal-600 text-2xl font-bold text-white transition-transform hover:bg-teal-700 active:scale-95"
        onClick={onSubmit}
      >
        <Check className="size-6" strokeWidth={3} />
      </Button>
    </div>
  );
};
