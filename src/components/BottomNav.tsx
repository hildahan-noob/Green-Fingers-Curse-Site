import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unreadTasksCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, unreadTasksCount = 0 }) => {
  const tabs = [
    {
      id: 'store' as ActiveTab,
      label: 'Store',
      icon: 'storefront',
    },
    {
      id: 'journal' as ActiveTab,
      label: 'Care Journal',
      icon: 'potted_plant',
    },
    {
      id: 'savings' as ActiveTab,
      label: 'Savings',
      icon: 'percent',
    },
    {
      id: 'chat' as ActiveTab,
      label: 'AI Advice',
      icon: 'chat_bubble',
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tasks',
      icon: 'event_repeat',
      badge: unreadTasksCount > 0 ? unreadTasksCount : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2.5 bg-white dark:bg-[#1a1c1c] border-t border-[#e2e2e2] dark:border-gray-800 shadow-lg">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTab(t.id)}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-[#e91e63] font-bold scale-105'
                : 'text-[#5f5e5e] dark:text-gray-400 hover:text-[#e91e63]'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`material-symbols-outlined text-2xl transition-transform ${
                  isActive ? 'fill-1 scale-110' : ''
                }`}
              >
                {t.icon}
              </span>
              {t.badge && (
                <span className="absolute -top-1 -right-2 bg-[#e91e63] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {t.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
