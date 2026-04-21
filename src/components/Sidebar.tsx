import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  Utensils, 
  Bot, 
  HeartPulse, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MENU_ITEMS = [
  { 
    icon: Utensils, 
    label: 'Рецепты', 
    path: '/',
    subItems: [
      { label: 'Закуски', path: '/recipes/snacks' },
      { label: 'Салаты', path: '/recipes/salads' },
      { label: 'Первые блюда', path: '/recipes/soups' },
      { label: 'Вторые блюда', path: '/recipes/main' },
      { label: 'Гарниры', path: '/recipes/sides' },
      { label: 'Десерты', path: '/recipes/desserts' },
      { label: 'Выпечка', path: '/recipes/baking' },
    ]
  },
  { icon: Bot, label: 'Умный помощник', path: '/ai', badge: 'НОВОЕ' },
  { 
    icon: HeartPulse, 
    label: 'Полезные сервисы', 
    path: '/services',
    subItems: [
      { label: 'Меню на неделю', path: '/services/weekly-menu' },
      { label: 'Калькулятор калорий', path: '/services/calories' },
    ]
  },
  { 
    icon: Info, 
    label: 'О проекте', 
    path: '/about',
    subItems: [
      { label: 'Написать нам', path: '/about/contact' },
      { label: 'Политика конфиденциальности', path: '/about/privacy' },
      { label: 'Пользовательское соглашение', path: '/about/terms' },
    ]
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedItems(prev => {
      if (prev[label]) {
        return { ...prev, [label]: false };
      }
      return { [label]: true };
    });
  };

  useEffect(() => {
    const currentItem = MENU_ITEMS.find(item => 
      item.path === location.pathname || 
      item.subItems?.some(sub => location.pathname.startsWith(sub.path))
    );
    
    if (currentItem && currentItem.subItems) {
      setExpandedItems({ [currentItem.label]: true });
    } else if (currentItem && !currentItem.subItems) {
      setExpandedItems({});
    }
  }, [location.pathname]);

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4">
      <nav className="space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const isExpanded = expandedItems[item.label];
          const isNonClickable = ['Полезные сервисы', 'О проекте'].includes(item.label);
          
          return (
            <div key={item.label} className="mb-1">
              {isNonClickable ? (
                <div
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-xl transition-colors group cursor-default",
                    isActive
                      ? (item.label === 'Рецепты' ? "bg-bg-surface-light dark:bg-primary/5 font-medium" :
                         item.label === 'Умный помощник' ? "bg-bg-surface-light dark:bg-green-500/5 font-medium" :
                         item.label === 'Полезные сервисы' ? "bg-bg-surface-light dark:bg-red-500/5 font-medium" :
                         item.label === 'О проекте' ? "bg-bg-surface-light dark:bg-indigo-500/5 font-medium" :
                         "bg-bg-surface-light font-medium")
                      : "text-text-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      item.label === 'Рецепты' ? 'bg-primary/20 text-primary dark:bg-primary/10' :
                      item.label === 'Умный помощник' ? 'bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-500' :
                      item.label === 'Полезные сервисы' ? 'bg-red-500/20 text-red-600 dark:bg-red-500/10 dark:text-red-500' :
                      item.label === 'О проекте' ? 'bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-500' :
                      'bg-bg-surface-light text-text-muted'
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className={cn("text-[15px]", item.subItems ? "font-bold text-text-primary" : (isActive ? "font-medium text-text-primary" : "font-medium text-text-muted"))}>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && (
                      <button 
                        onClick={(e) => toggleExpand(item.label, e)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-bg-surface-light transition-colors bg-bg-surface shadow-sm border border-border-color cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-xl transition-colors group",
                    isActive
                      ? (item.label === 'Рецепты' ? "bg-bg-surface-light dark:bg-primary/5 font-medium" :
                         item.label === 'Умный помощник' ? "bg-bg-surface-light dark:bg-green-500/5 font-medium" :
                         item.label === 'Полезные сервисы' ? "bg-bg-surface-light dark:bg-red-500/5 font-medium" :
                         item.label === 'О проекте' ? "bg-bg-surface-light dark:bg-indigo-500/5 font-medium" :
                         "bg-bg-surface-light font-medium")
                      : "hover:bg-bg-surface-light text-text-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      item.label === 'Рецепты' ? 'bg-primary/20 text-primary dark:bg-primary/10' :
                      item.label === 'Умный помощник' ? 'bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-500' :
                      item.label === 'Полезные сервисы' ? 'bg-red-500/20 text-red-600 dark:bg-red-500/10 dark:text-red-500' :
                      item.label === 'О проекте' ? 'bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-500' :
                      'bg-bg-surface-light text-text-muted'
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className={cn("text-[15px]", item.subItems ? "font-bold text-text-primary" : (isActive ? "font-medium text-text-primary" : "font-medium text-text-muted"))}>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && (
                      <button 
                        onClick={(e) => toggleExpand(item.label, e)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-bg-surface-light transition-colors bg-bg-surface shadow-sm border border-border-color"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
                      </button>
                    )}
                  </div>
                </Link>
              )}
              
              {item.subItems && isExpanded && (
                <div className="pl-[52px] pr-3 py-1 flex flex-col">
                  {item.subItems.map(subItem => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={cn(
                        "block py-2 text-[14px] transition-colors",
                        location.pathname === subItem.path 
                          ? "text-text-primary font-bold" 
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
    </aside>
  );
}
