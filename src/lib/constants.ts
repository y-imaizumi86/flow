import {
  Utensils,
  TrainFront,
  ShoppingBag,
  Beer,
  Gamepad2,
  Shirt,
  Heart,
  Home,
  CreditCard,
  PiggyBank,
  Plane,
  Book,
  Music,
  Tv,
  Wifi,
  Smartphone,
  Gift,
  Smile,
  ShoppingBasket,
  Baby,
  Squirrel,
  Stethoscope,
  Pill,
  Cat,
  Dog,
  CarFront,
  Wrench,
  Zap,
  Droplet,
  Flame,
  Trash2,
  Scissors,
  MoreHorizontal,
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: '1',
    name: '食費',
    icon: Utensils,
    color: 'bg-orange-100 text-orange-600',
    activeColor: 'bg-orange-600 text-white',
    chartColor: '#f97316',
  },
  {
    id: '2',
    name: '交通費',
    icon: TrainFront,
    color: 'bg-blue-100 text-blue-600',
    activeColor: 'bg-blue-600 text-white',
    chartColor: '#3b82f6',
  },
  {
    id: '3',
    name: '日用品',
    icon: ShoppingBag,
    color: 'bg-green-100 text-green-600',
    activeColor: 'bg-green-600 text-white',
    chartColor: '#22c55e',
  },
  {
    id: '4',
    name: '交際費',
    icon: Beer,
    color: 'bg-pink-100 text-pink-600',
    activeColor: 'bg-pink-600 text-white',
    chartColor: '#ec4899',
  },
  {
    id: '5',
    name: '趣味・娯楽',
    icon: Gamepad2,
    color: 'bg-purple-100 text-purple-600',
    activeColor: 'bg-purple-600 text-white',
    chartColor: '#a855f7',
  },
  {
    id: '6',
    name: 'その他',
    icon: MoreHorizontal,
    color: 'bg-gray-100 text-gray-600',
    activeColor: 'bg-gray-600 text-white',
    chartColor: '#6b7280',
  },
] as const;

export const AVAILABLE_ICONS = [
  // Food & Drink
  'Utensils',
  'Beer',
  'ShoppingBasket',
  'ShoppingBag',

  // Transport
  'TrainFront',
  'CarFront',
  'Plane',

  // House / Utilities
  'Home',
  'Wifi',
  'Zap',
  'Droplet',
  'Flame',
  'Trash2',
  'Smartphone',

  // Daily / Life
  'Shirt',
  'Scissors',
  'Wrench',
  'Gift',
  'Smile',

  // Health / Family
  'Heart',
  'Baby',
  'Stethoscope',
  'Pill',

  // Pets
  'Cat',
  'Dog',
  'Squirrel',

  // Entertainment / Hobby
  'Gamepad2',
  'Tv',
  'Music',
  'Book',

  // Finance / Other
  'CreditCard',
  'PiggyBank',
  'MoreHorizontal',
] as const;

export const AVAILABLE_COLORS = [
  'bg-slate-100 text-slate-600',
  'bg-red-100 text-red-600',
  'bg-orange-100 text-orange-600',
  'bg-amber-100 text-amber-600',
  'bg-yellow-100 text-yellow-600',
  'bg-lime-100 text-lime-600',
  'bg-green-100 text-green-600',
  'bg-emerald-100 text-emerald-600',
  'bg-teal-100 text-teal-600',
  'bg-cyan-100 text-cyan-600',
  'bg-sky-100 text-sky-600',
  'bg-blue-100 text-blue-600',
  'bg-indigo-100 text-indigo-600',
  'bg-violet-100 text-violet-600',
  'bg-purple-100 text-purple-600',
  'bg-fuchsia-100 text-fuchsia-600',
  'bg-pink-100 text-pink-600',
  'bg-rose-100 text-rose-600',
] as const;

export const TAILWIND_TO_HEX: Record<string, string> = {
  'bg-slate-100 text-slate-600': '#475569',
  'bg-red-100 text-red-600': '#dc2626',
  'bg-orange-100 text-orange-600': '#ea580c',
  'bg-amber-100 text-amber-600': '#d97706',
  'bg-yellow-100 text-yellow-600': '#ca8a04',
  'bg-lime-100 text-lime-600': '#65a30d',
  'bg-green-100 text-green-600': '#16a34a',
  'bg-emerald-100 text-emerald-600': '#059669',
  'bg-teal-100 text-teal-600': '#0d9488',
  'bg-cyan-100 text-cyan-600': '#0891b2',
  'bg-sky-100 text-sky-600': '#0284c7',
  'bg-blue-100 text-blue-600': '#2563eb',
  'bg-indigo-100 text-indigo-600': '#4f46e5',
  'bg-violet-100 text-violet-600': '#7c3aed',
  'bg-purple-100 text-purple-600': '#9333ea',
  'bg-fuchsia-100 text-fuchsia-600': '#c026d3',
  'bg-pink-100 text-pink-600': '#db2777',
  'bg-rose-100 text-rose-600': '#e11d48',
};
