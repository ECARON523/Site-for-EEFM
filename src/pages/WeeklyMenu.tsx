import React, { useRef, useEffect } from 'react';
import { useRecipeStore } from '../store/useRecipeStore';
import { useUserStore } from '../store/useUserStore';
import RecipeCard from '../components/RecipeCard';
import { Utensils, ChevronRight, Calendar, ChevronLeft } from 'lucide-react';
import { Recipe, User } from '../types';

interface ScrollableSectionProps {
  title: string;
  description: string;
  items: Recipe[];
  users: User[];
}

const ScrollableSection: React.FC<ScrollableSectionProps> = ({ title, description, items, users }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const GAP = 24;

  // Triple items for infinite effect
  const displayItems = items.length > 0 ? [...items, ...items, ...items] : [];

  const getScrollStep = () => {
    if (!scrollRef.current) return 0;
    const firstItem = scrollRef.current.querySelector('.snap-start');
    return firstItem ? firstItem.clientWidth + GAP : 0;
  };

  useEffect(() => {
    if (scrollRef.current && items.length > 0) {
      const step = getScrollStep();
      scrollRef.current.scrollLeft = items.length * step;
    }
  }, [items.length]);

  const handleScroll = () => {
    if (!scrollRef.current || items.length === 0) return;
    const { scrollLeft } = scrollRef.current;
    const step = getScrollStep();
    const totalWidth = items.length * step;

    if (scrollLeft < totalWidth / 2) {
      scrollRef.current.scrollLeft = scrollLeft + totalWidth;
    } 
    else if (scrollLeft > totalWidth * 1.5) {
      scrollRef.current.scrollLeft = scrollLeft - totalWidth;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const step = getScrollStep();
      const scrollTo = direction === 'left' ? scrollLeft - step : scrollLeft + step;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-text-primary">{title}</h2>
        <p className="text-text-muted max-w-3xl">{description}</p>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-bg-surface-light/90 backdrop-blur-sm rounded-full shadow-xl border border-border-color flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-bg-surface hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-bg-surface-light/90 backdrop-blur-sm rounded-full shadow-xl border border-border-color flex items-center justify-center text-text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-bg-surface hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
        </button>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x"
        >
          {displayItems.map((recipe, index) => {
            const author = users.find(u => u.id === recipe.authorId) || users[0];
            return (
              <div key={`${recipe.id}-${index}`} className="w-[85vw] sm:w-[400px] md:w-[480px] shrink-0 snap-start">
                <RecipeCard recipe={recipe} author={author} />
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="w-full py-12 text-center bg-bg-surface rounded-3xl border-2 border-dashed border-border-color">
              <p className="text-text-muted font-medium">Рецепты для этой категории скоро появятся</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function WeeklyMenu() {
  const { recipes } = useRecipeStore();
  const { users } = useUserStore();

  const breakfastRecipes = recipes.filter(r => r.category === 'Завтрак' || r.category === 'Блюда из творога').slice(0, 7);
  const lunchRecipes = recipes.filter(r => r.category === 'Обед' || r.category === 'Суп').slice(0, 7);
  const dinnerRecipes = recipes.filter(r => r.category === 'Ужин' || r.category === 'Гарнир').slice(0, 7);

  const sections = [
    {
      title: 'НА ЗАВТРАК',
      description: 'Блюда, которые зарядят бодростью и прекрасно подойдут в качестве завтраков на всю неделю. Пусть день начнется с хорошего настроения, а готовка не займет много времени.',
      items: breakfastRecipes
    },
    {
      title: 'НА ОБЕД',
      description: 'Сытные и наваристые блюда для полноценного обеда. В подборке собраны как классические супы, так и вторые блюда, которые дадут силы на весь оставшийся день.',
      items: lunchRecipes
    },
    {
      title: 'НА УЖИН',
      description: 'Легкие, но питательные блюда для завершения дня. Мы подобрали рецепты, которые не перегружают организм перед сном, но при этом остаются очень вкусными.',
      items: dinnerRecipes
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 scrollbar-hide">
      {/* Banner */}
      <div className="relative h-64 rounded-3xl overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&h=400&fit=crop" 
          alt="Weekly Menu Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span>Меню на неделю</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">МЕНЮ НА НЕДЕЛЮ</h1>
          <p className="text-white/90 max-w-2xl">
            Мы собрали для вас разнообразное и полезное меню на неделю. В нем — проверенные рецепты, которые могут стать основой для рациона или вдохновением в поисках нового и необычного.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {sections.map((section) => (
          <ScrollableSection 
            key={section.title}
            title={section.title}
            description={section.description}
            items={section.items}
            users={users}
          />
        ))}
      </div>
    </div>
  );
}
