import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpDown, SlidersHorizontal, X, Check } from 'lucide-react';
import { useRecipeStore } from '../store/useRecipeStore';
import { useUserStore } from '../store/useUserStore';
import RecipeCard from '../components/RecipeCard';
import { cn } from '../lib/utils';

const CATEGORY_DATA: Record<string, { title: string, image: string, keywords: string[], whatToCook: string[], popular: string[], description?: string }> = {
  breakfast: {
    title: 'ЗАВТРАК',
    image: 'https://static.1000.menu/img/content-v2/21/62/89008/polnyi-angliiskii-zavtrak_1723808108_14_v5xiw0v_max.jpg',
    keywords: ['завтрак', 'яичниц', 'омлет', 'каш', 'блин', 'оладь', 'сырник'],
    whatToCook: ['Завтраки из яиц', 'Каши', 'Блины и оладьи', 'Сырники', 'Бутерброды'],
    popular: ['Просто', 'Быстро', 'Ваши рецепты', 'Полезно', 'Дети']
  },
  lunch: {
    title: 'ОБЕД',
    image: 'https://avatars.mds.yandex.net/i?id=2f450003cd1e99fb11d367f28be68f16a6ee7302-5257701-images-thumbs&n=13',
    keywords: ['обед', 'суп', 'борщ', 'второе', 'мясо', 'гарнир'],
    whatToCook: ['Первые блюда', 'Вторые блюда', 'Салаты', 'Гарниры'],
    popular: ['Сытно', 'Ваши рецепты', 'Русская кухня', 'Обед']
  },
  dinner: {
    title: 'УЖИН',
    image: 'https://www.koolinar.ru/all_image/article/5/5342/article-9f042aae-a14d-4c98-8e2d-09bb4aa03ff3_large.jpg',
    keywords: ['ужин', 'легк', 'рыб', 'овощ', 'куриц', 'паст'],
    whatToCook: ['Легкий ужин', 'Блюда из птицы', 'Блюда из рыбы', 'Паста'],
    popular: ['Быстро', 'Ваши рецепты', 'Ужин', 'Романтика']
  },
  healthy: {
    title: 'ЗДОРОВАЯ ЕДА',
    image: 'https://avatars.mds.yandex.net/i?id=4026682aa5268956c548de2394387816_l-5873252-images-thumbs&n=13',
    keywords: ['пп', 'зож', 'здоров', 'диетич', 'без сахар', 'низкокалорийн'],
    whatToCook: ['Блюда на пару', 'Салаты', 'Овощные блюда', 'Смузи'],
    popular: ['ЗОЖ', 'Низкокалорийный', 'Полезно', 'Вегетарианское']
  },
  snacks: {
    title: 'ЗАКУСКИ',
    image: 'https://avatars.mds.yandex.net/i?id=0de1ec634bc127f4e01127399dded8a8_l-4960599-images-thumbs&n=13',
    keywords: ['закуск', 'бутерброд', 'канапе', 'паштет', 'ролл'],
    whatToCook: ['Закуски с хлебом или лавашем', 'Закуски с чесноком', 'Закуски с помидорами', 'Закуски из овощей и грибов', 'Закуски с рыбой', 'Закуски из сыра'],
    popular: ['Салаты с яйцом', 'Просто', 'Ваши рецепты', 'Есть распространенные аллергены', 'Закуски с хлебом или лавашем', 'Перекус']
  },
  salads: {
    title: 'САЛАТЫ',
    image: 'https://i.ytimg.com/vi/1ib4cs1tS1g/maxresdefault.jpg',
    keywords: ['салат', 'винегрет', 'оливье', 'цезарь'],
    whatToCook: ['Салаты с яйцом', 'Салаты с овощами', 'Салаты с майонезом', 'Салаты с чесноком', 'Овощные салаты', 'Салаты с растительным маслом'],
    popular: ['Салаты с яйцом', 'Салаты с овощами', 'Просто', 'Ваши рецепты', 'Есть распространенные аллергены', 'Ужин', 'Сборник рецептов']
  },
  soups: {
    title: 'ПЕРВЫЕ БЛЮДА',
    image: 'https://img.povar.ru/mobile/a3/c5/ee/ef/postnii_sup_s_gribami-897522.jpg',
    keywords: ['суп', 'борщ', 'щи', 'солянка', 'бульон', 'окрошка', 'рассольник'],
    whatToCook: ['Супы', 'Борщ', 'Щи', 'Солянка', 'Крем-суп'],
    popular: ['Супы', 'Ваши рецепты', 'Просто', 'Обед', 'Сезон картошки', 'Сезон моркови', 'Есть распространенные аллергены', 'Русская кухня']
  },
  main: {
    title: 'ВТОРЫЕ БЛЮДА',
    image: 'https://avatars.mds.yandex.net/i?id=a79d7c13f271a5123a8e4308deee066f4c568c00-5309142-images-thumbs&n=13',
    keywords: ['втор', 'мясн', 'куриц', 'говядин', 'свинин', 'рыб', 'котлет', 'пельмен', 'бефстроганов', 'гуляш', 'жарко'],
    whatToCook: ['Мучные вторые блюда', 'Мясные блюда', 'Блюда из птицы', 'Блюда из картофеля', 'Блюда из рыбы', 'Блюда из яиц', 'Блюда из круп'],
    popular: ['Салаты с яйцом', 'Ваши рецепты', 'Просто', 'Есть распространенные аллергены', 'Ужин', 'Обед', 'Русская кухня']
  },
  sides: {
    title: 'ГАРНИРЫ',
    image: 'https://avatars.mds.yandex.net/i?id=2258afc7c65d711646bc4fbd7d72b61cad111b47-5608305-images-thumbs&n=13',
    keywords: ['гарнир', 'пюре', 'рис', 'гречк', 'макарон', 'овощ', 'картофел'],
    whatToCook: ['Гарниры из овощей', 'Гарниры из круп', 'Гарниры со стручковой фасолью', 'Гарниры с красной фасолью', 'Гарниры с кускусом', 'Гарниры с белой фасолью'],
    popular: ['Салаты с яйцом', 'Ваши рецепты', 'Просто', 'Гарниры из овощей', 'Есть распространенные аллергены', 'Русская кухня', 'Низкокалорийный']
  },
  desserts: {
    title: 'ДЕСЕРТЫ',
    image: 'https://avatars.mds.yandex.net/i?id=5844e644714b792a5250bc58640c0bc9ab3703db-2032062-images-thumbs&n=13',
    keywords: ['десерт', 'торт', 'пирожн', 'морожен', 'сладк', 'крем', 'пудинг', 'желе'],
    whatToCook: ['Десерты из теста', 'Десерты со сметаной', 'Фруктовые десерты', 'Десерты с творогом', 'Торты', 'Холодные десерты', 'Варенье', 'Пирожные'],
    popular: ['Ваши рецепты', 'Просто', 'Есть распространенные аллергены', 'Сборник рецептов', 'Русская кухня', 'Десерты из теста', 'Перекус', 'Завтрак']
  },
  baking: {
    title: 'ВЫПЕЧКА',
    image: 'https://avatars.mds.yandex.net/i?id=3006f19fb621eada1974a727a870924a_l-12461673-images-thumbs&n=13',
    description: 'Рецепты выпечки — как приготовить домашнюю выпечку: пироги, булочки, печенье, советы по дрожжевому тесту и безглютеновым вариантам. Читать далее',
    keywords: ['выпечк', 'пирог', 'блин', 'оладь', 'булочк', 'хлеб', 'печень', 'кекс', 'тест'],
    whatToCook: ['Выпечка с яйцом', 'Пироги', 'Выпечка с сыром', 'Выпечка с фруктами', 'Выпечка со сметаной', 'Выпечка из слоеного теста', 'Выпечка с творогом'],
    popular: ['Ваши рецепты', 'Есть распространенные аллергены', 'Просто', 'Выпечка с яйцом', 'Сборник рецептов', 'Русская кухня', 'Перекус', 'Пироги']
  }
};

const MORE_TAGS = [
  'Вторые блюда', 'Десерты', 'Закуски', 'Салаты', 'Выпечка', 
  'Первые блюда', 'Гарниры', 'Рецепты с любимыми продуктами'
];

export default function RecipeCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { recipes } = useRecipeStore();
  const { users } = useUserStore();
  
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [maxTime, setMaxTime] = useState<number | ''>('');
  const [difficulty, setDifficulty] = useState<number | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSort(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const data = categoryId && CATEGORY_DATA[categoryId] ? CATEGORY_DATA[categoryId] : null;

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredAndSortedRecipes = useMemo(() => {
    if (!data) return [];

    // 1. Base category filter
    let result = recipes.filter(r => {
      const textToSearch = `${r.title} ${r.description} ${r.category}`.toLowerCase();
      return data.keywords.some(kw => textToSearch.includes(kw));
    });

    // 2. Tags filter (OR logic)
    if (activeTags.length > 0) {
      result = result.filter(r => {
        const textToSearch = `${r.title} ${r.description} ${r.category} ${r.ingredients.map(i => i.name).join(' ')}`.toLowerCase();
        return activeTags.some(tag => {
          // Simple stemming for Russian words to match tags better
          const searchTag = tag.toLowerCase().replace(/(ые|ие|ы|и|ая|яя|ое|ее|ом|ем|ами|ями|ах|ях|у|ю|ой|ей)$/g, '');
          return textToSearch.includes(searchTag);
        });
      });
    }

    // 3. Explicit Filters
    if (maxTime !== '') {
      result = result.filter(r => (r.prepTime + r.cookTime) <= Number(maxTime));
    }
    if (difficulty !== null) {
      result = result.filter(r => r.difficulty <= difficulty);
    }

    // 4. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'time':
          return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
        case 'difficulty':
          return a.difficulty - b.difficulty;
        default:
          return 0;
      }
    });

    return result;
  }, [recipes, data, activeTags, maxTime, difficulty, sortBy]);

  if (!data) {
    return <div className="p-8 text-center text-text-muted">Категория не найдена</div>;
  }

  const getSortLabel = () => {
    switch(sortBy) {
      case 'newest': return 'По новизне';
      case 'popular': return 'По популярности';
      case 'time': return 'По времени';
      case 'difficulty': return 'По сложности';
      default: return 'СОРТИРОВКА';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden h-48 md:h-64 mb-6">
        {data.image && (
          <img 
            src={data.image} 
            alt={data.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider uppercase">
            {data.title}
          </h1>
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-text-muted mb-6 leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-8 border-b border-border-color pb-8">
        <div className="relative" ref={sortRef}>
          <button 
            onClick={() => setShowSort(!showSort)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-colors",
              showSort ? "border-text-primary bg-bg-surface-light text-text-primary" : "border-border-color hover:bg-bg-surface-light text-text-muted"
            )}
          >
            <ArrowUpDown className="w-4 h-4" />
            {getSortLabel().toUpperCase()}
          </button>
          
          {showSort && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-bg-surface shadow-xl rounded-2xl border border-border-color z-20 py-2 overflow-hidden">
              {[
                { id: 'newest', label: 'По новизне' },
                { id: 'popular', label: 'По популярности' },
                { id: 'time', label: 'По времени приготовления' },
                { id: 'difficulty', label: 'По сложности' }
              ].map(option => (
                <button 
                  key={option.id}
                  onClick={() => { setSortBy(option.id); setShowSort(false); }} 
                  className="w-full text-left px-5 py-3 hover:bg-bg-surface-light text-sm flex items-center justify-between"
                >
                  <span className={sortBy === option.id ? "font-bold text-text-primary" : "text-text-muted"}>
                    {option.label}
                  </span>
                  {sortBy === option.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-colors",
            showFilters || maxTime !== '' || difficulty !== null ? "border-primary bg-primary text-black" : "border-border-color hover:bg-bg-surface-light text-text-muted"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          ФИЛЬТРЫ
          {(maxTime !== '' || difficulty !== null) && (
            <span className="ml-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs">
              {(maxTime !== '' ? 1 : 0) + (difficulty !== null ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 p-6 bg-bg-surface rounded-2xl border border-border-color animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-text-primary">Фильтры</h3>
            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-bg-surface-light rounded-full transition-colors">
              <X className="w-5 h-5 text-text-muted"/>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-text-muted mb-3">Максимальное время приготовления</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={maxTime} 
                  onChange={e => setMaxTime(e.target.value ? Number(e.target.value) : '')} 
                  className="w-32 px-4 py-2.5 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                  placeholder="Мин." 
                  min="1"
                />
                <span className="text-text-muted text-sm">минут</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-text-muted mb-3">Максимальная сложность</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setDifficulty(difficulty === d ? null : d)} 
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center font-bold transition-colors text-sm", 
                      difficulty === d 
                        ? "bg-primary text-black shadow-md" 
                        : "bg-bg-surface-light border border-border-color text-text-muted hover:border-text-muted hover:bg-bg-surface"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border-color flex justify-end items-center gap-4">
            <button 
              onClick={() => { setMaxTime(''); setDifficulty(null); }} 
              className="px-4 py-2 text-text-muted hover:text-text-primary text-sm font-bold transition-colors"
            >
              Сбросить
            </button>
            <button 
              onClick={() => setShowFilters(false)} 
              className="px-6 py-2.5 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Применить
            </button>
          </div>
        </div>
      )}

      {/* Tags Sections */}
      <div className="space-y-8 mb-12">
        {/* Что готовим? */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Что готовим?</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.whatToCook.map(tag => (
              <button 
                key={tag} 
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors font-medium border",
                  activeTags.includes(tag)
                    ? "bg-primary text-black border-primary"
                    : "bg-bg-surface-light text-text-muted border-border-color hover:border-text-muted hover:bg-bg-surface"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Еще */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Еще</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {MORE_TAGS.map(tag => {
              const path = {
                'Вторые блюда': '/recipes/main',
                'Десерты': '/recipes/desserts',
                'Закуски': '/recipes/snacks',
                'Салаты': '/recipes/salads',
                'Выпечка': '/recipes/baking',
                'Первые блюда': '/recipes/soups',
                'Напитки': '/recipes/drinks',
                'Заготовки': '/recipes/preserves',
                'Гарниры': '/recipes/sides',
                'Соусы и маринады': '/recipes/sauces',
                'Рецепты с любимыми продуктами': '/'
              }[tag] || '/';
              return (
                <Link 
                  key={tag} 
                  to={path}
                  className="px-4 py-1.5 bg-bg-surface-light text-text-muted border border-border-color hover:border-text-muted hover:bg-bg-surface rounded-full text-[13px] transition-colors font-medium"
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Популярное */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Популярное</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.popular.map(tag => (
              <button 
                key={tag} 
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] transition-colors font-medium border",
                  activeTags.includes(tag)
                    ? "bg-primary text-black border-primary"
                    : "bg-bg-surface-light text-text-muted border-border-color hover:border-text-muted hover:bg-bg-surface"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Tags Summary */}
      {activeTags.length > 0 && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-text-muted font-medium mr-2">Выбрано:</span>
          {activeTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-bg-surface-light text-text-primary rounded-full text-xs font-medium border border-border-color">
              {tag}
              <button onClick={() => toggleTag(tag)} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button 
            onClick={() => setActiveTags([])}
            className="text-xs text-text-muted hover:text-text-primary underline ml-2"
          >
            Очистить все
          </button>
        </div>
      )}

      {/* Recipes Grid */}
      {filteredAndSortedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedRecipes.map(recipe => {
            const author = users.find(u => u.id === recipe.authorId);
            if (!author) return null;
            return <RecipeCard key={recipe.id} recipe={recipe} author={author} />;
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-bg-surface rounded-3xl border border-border-color">
          <div className="text-text-muted mb-3">
            <SlidersHorizontal className="w-12 h-12 mx-auto opacity-20" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">Ничего не найдено</h3>
          <p className="text-text-muted max-w-sm mx-auto mb-6">
            Попробуйте изменить параметры фильтрации или выбрать другие теги
          </p>
          <button 
            onClick={() => {
              setActiveTags([]);
              setMaxTime('');
              setDifficulty(null);
            }}
            className="px-6 py-2 bg-bg-surface-light border border-border-color text-text-primary rounded-xl font-bold hover:bg-bg-surface transition-colors"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}
    </div>
  );
}
