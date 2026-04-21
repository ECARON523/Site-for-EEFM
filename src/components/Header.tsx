import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ShoppingBasket, LogIn, LogOut, PlusCircle, User as UserIcon, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { currentUser, logout } = useAuthStore();
  const { recipes } = useRecipeStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredResults = searchQuery.trim() 
    ? recipes.filter(r => {
        const lowerQuery = searchQuery.toLowerCase();
        if (lowerQuery.includes(',')) {
          const ingredients = lowerQuery.split(',').map(i => i.trim()).filter(i => i !== '');
          return ingredients.every(ing => 
            r.ingredients.some(ri => ri.name.toLowerCase().includes(ing))
          );
        }
        return r.title.toLowerCase().includes(lowerQuery) ||
          r.category.toLowerCase().includes(lowerQuery) ||
          r.description.toLowerCase().includes(lowerQuery) ||
          r.ingredients.some(i => i.name.toLowerCase().includes(lowerQuery));
      }).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-bg-surface border-b border-border-color transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary text-black font-black text-lg sm:text-xl leading-none p-1.5 sm:p-2 rounded-lg flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
            <span>CIVS</span>
          </div>
        </Link>

        {/* Add Recipe Button */}
        <button 
          onClick={() => currentUser ? navigate('/submit') : navigate('/login')}
          className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-border-color hover:bg-bg-surface-light transition-colors text-sm font-medium text-text-primary"
        >
          Отправить рецепт
          <PlusCircle className="w-4 h-4" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden sm:block" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative flex items-center w-full h-10 rounded-full bg-bg-surface-light overflow-hidden">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Поиск по рецептам и материалам" 
              className="w-full bg-transparent pl-4 pr-10 text-sm focus:outline-none text-text-primary"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Live Search Results */}
          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-bg-surface rounded-2xl shadow-xl border border-border-color overflow-hidden z-50">
              {filteredResults.map(recipe => (
                <Link
                  key={recipe.id}
                  to={`/recipe/${recipe.id}`}
                  onClick={() => setShowResults(false)}
                  className="flex items-center gap-3 p-3 hover:bg-bg-surface-light transition-colors border-b border-border-color last:border-0"
                >
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title} 
                    className="w-12 h-12 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-bold text-text-primary">{recipe.title}</div>
                    <div className="text-xs text-text-muted">{recipe.category}</div>
                  </div>
                </Link>
              ))}
              <button
                onClick={handleSearch}
                className="w-full p-3 text-center text-sm font-bold text-primary hover:bg-bg-surface-light transition-colors border-t border-border-color"
              >
                Смотреть все результаты
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <ThemeToggle />
          <Link to="/ai" className="text-primary hover:text-primary-hover transition-colors">
            <Sparkles className="w-6 h-6" />
          </Link>
          
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to={`/profile/${currentUser.id}`} className="flex items-center gap-2">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-bg-surface-light flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-text-muted" />
                  </div>
                )}
                <span className="text-sm font-medium hidden md:block text-text-primary">{currentUser.name}</span>
              </Link>
              {currentUser.role === 'admin' && (
                <Link to="/admin" className="text-xs font-bold text-blue-600 uppercase tracking-wider hidden lg:block">Admin</Link>
              )}
              <button onClick={logout} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-color hover:bg-bg-surface-light transition-colors text-sm font-medium text-text-primary">
              Войти
              <LogIn className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
