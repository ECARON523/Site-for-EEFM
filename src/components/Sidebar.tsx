import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  Utensils, 
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

const MENU_ITEMS = [
  { 
    icon: Utensils, 
    label: 'Меню', 
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
  }
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Добавил, чтобы клик по стрелке не перекидывал на главную страницу
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
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

    // Закрываем мобильное меню при переходе
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  }, [location.pathname, onClose]);

  return (
    <>
      {/* Затемнение фона для мобилок */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        "w-64 shrink-0 overflow-y-auto pr-4 z-50 transition-transform duration-300",
        // Классы для мобилок
        "fixed inset-y-0 left-0 bg-bg-primary pt-4",
        // Классы для компа (ИЗМЕНЕНО: добавил lg:pt-6 чтобы не прилипало к шапке)
        "lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:block lg:bg-transparent lg:pt-6",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        
        {/* Кнопка закрытия ТОЛЬКО для телефонов */}
        <div className="flex justify-end px-4 mb-4 lg:hidden">
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const isExpanded = expandedItems[item.label];
            
            return (
              <div key={item.label} className="mb-1">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 rounded-xl transition-colors group",
                    isActive
                      ? "bg-bg-surface-light dark:bg-primary/5 font-medium"
                      : "hover:bg-bg-surface-light text-text-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      "bg-primary/20 text-primary dark:bg-primary/10"
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className={cn("text-[15px]", item.subItems ? "font-bold text-text-primary" : (isActive ? "font-medium text-text-primary" : "font-medium text-text-muted"))}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
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
    </>
  );
}