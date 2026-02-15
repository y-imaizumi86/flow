import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useState } from 'react';
import { CategoryForm } from './CategoryForm';

export const CategoryAddDrawer = () => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    window.location.reload();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={false}>
      <DrawerTrigger asChild>
        <button className="text-sm font-bold text-teal-600 hover:text-teal-700">+ Add</button>
      </DrawerTrigger>
      <DrawerContent showOverlay={false}>
        <div className="mx-auto w-full max-w-md">
          <div className="max-h-[90vh]">
            <CategoryForm onSuccess={handleSuccess} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
