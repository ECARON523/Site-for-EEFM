import { useState, useEffect, useRef } from 'react';
import { Search, LogIn, LogOut, User as UserIcon, X, Menu, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { useCartStore } from '../store/useCartStore';
import ThemeToggle from './ThemeToggle';
import CartDrawer from './CartDrawer';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { currentUser, logout } = useAuthStore();
  const { recipes } = useRecipeStore();
  
  const totalItems = useCartStore(state => state.getTotalItems());
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredResults = searchQuery.trim() 
    ? recipes.filter(r => {
        const lowerQuery = searchQuery.toLowerCase();
        return r.title.toLowerCase().includes(lowerQuery) ||
          r.category.toLowerCase().includes(lowerQuery);
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
    <>
      <header className="sticky top-0 z-40 bg-bg-surface border-b border-border-color transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text-primary">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-primary text-black font-black text-lg sm:text-xl leading-none p-1.5 sm:p-2 rounded-lg flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                <span>CIVS</span>
              </div>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl relative hidden sm:block" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative flex items-center w-full h-10 rounded-full bg-bg-surface-light overflow-hidden border border-border-color focus-within:border-primary transition-colors">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Поиск блюд..." 
                className="w-full bg-transparent pl-4 pr-10 text-sm focus:outline-none text-text-primary"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-10 text-text-muted hover:text-text-primary">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="submit" className="absolute right-3 text-text-muted hover:text-text-primary">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {showResults && filteredResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-surface rounded-2xl shadow-xl border border-border-color overflow-hidden z-50">
                {filteredResults.map(recipe => (
                  <Link
                    key={recipe.id}
                    to={`/recipe/${recipe.id}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 p-3 hover:bg-bg-surface-light transition-colors border-b border-border-color last:border-0"
                  >
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-sm font-bold text-text-primary">{recipe.title}</div>
                      <div className="text-xs text-text-muted">{recipe.price || 550} ₽</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-text-primary hover:bg-bg-surface-light rounded-full transition-colors group outline-none"
            >
              <ShoppingBag className="w-6 h-6 group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full border-2 border-bg-surface">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="w-px h-6 bg-border-color mx-1 hidden sm:block"></div>

            <ThemeToggle />
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to={`/profile/${currentUser.id}`} className="flex items-center gap-2">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-bg-surface-light border border-border-color flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-text-muted" />
                    </div>
                  )}
                </Link>

                {/* ВЕРНУЛ КНОПКУ АДМИНА СЮДА */}
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider hidden lg:block transition-colors">
                    Admin
                  </Link>
                )}

                <button onClick={logout} className="text-text-muted hover:text-text-primary">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-color hover:bg-bg-surface-light transition-colors text-sm font-bold text-text-primary">
                Войти
                <LogIn className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}