import { cn } from '@/lib/utils';
import { Home, List, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const BottomTab = () => {
  // 現在のパスをステートで管理
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const onPageLoad = () => {
      setCurrentPath(window.location.pathname);
    };

    document.addEventListener('astro:page-load', onPageLoad);
    return () => document.removeEventListener('astro:page-load', onPageLoad);
  }, []);

  const tabs = [
    { href: '/', label: 'Input', icon: Home },
    { href: '/history', label: 'History', icon: List },
    { href: '/settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <nav className="pb-safe fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === '/' ? currentPath === '/' : currentPath.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <a
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center py-1 transition-colors outline-none',
                isActive ? 'text-teal-600' : 'text-gray-400 hover:text-gray-500'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 m-auto h-12 w-16 rounded-2xl bg-teal-50"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  className={cn('mb-0.5 size-6 transition-transform', isActive && 'scale-110')}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-[10px] leading-none font-medium',
                    isActive ? 'font-bold' : ''
                  )}
                >
                  {tab.label}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
