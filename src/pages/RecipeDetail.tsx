import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Clock, Flame, Minus, Plus, ShoppingBasket, Pin, Trash2, Printer, Timer as TimerIcon, Pencil, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { cn } from '../lib/utils';
import { IngredientIcon } from '../components/IngredientIcon';
import Timer from '../components/Timer';
import RecipeCard from '../components/RecipeCard';

import { MOCK_USERS } from '../data/mockData';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { users, toggleFollow, toggleLikeRecipe, togglePinRecipe } = useUserStore();
  const { recipes, deleteRecipe } = useRecipeStore();
  const { addToShoppingList } = useShoppingListStore();
  const { addNotification } = useNotificationStore();
  
  const recipe = recipes.find(r => r.id === id);
  const author = users.find(u => u.id === recipe?.authorId) || MOCK_USERS.find(u => u.id === recipe?.authorId);
  
  const [portions, setPortions] = useState(recipe?.portions || 1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

  const similarRecipes = useMemo(() => {
    if (!recipe) return [];
    return recipes
      .filter(r => r.id !== recipe.id && r.category === recipe.category && r.status === 'approved')
      .slice(0, 3);
  }, [recipes, recipe]);

  if (!recipe || !author) {
    return <div className="p-8 text-center text-text-muted">Рецепт не найден</div>;
  }

  const isFollowing = currentUser?.followingIds.includes(author.id);
  const isLiked = currentUser?.likedRecipeIds?.includes(recipe.id);
  const isPinned = currentUser?.pinnedRecipeIds?.includes(recipe.id);
  const portionRatio = portions / recipe.portions;
  const isAdmin = currentUser?.role === 'admin';

  const handleDelete = async () => {
    try {
      await deleteRecipe(recipe.id);
      navigate('/');
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      addNotification("Не удалось удалить рецепт", "error");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; }
              img { max-width: 100%; height: auto; border-radius: 12px; margin-bottom: 20px; }
              h1 { font-size: 32px; margin-bottom: 10px; }
              h2 { font-size: 24px; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              p { line-height: 1.6; color: #555; }
              .meta { display: flex; gap: 20px; margin-bottom: 30px; color: #666; font-size: 14px; }
              .ingredient { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .step { margin-bottom: 20px; }
              .step-num { font-weight: bold; margin-bottom: 5px; }
            </style>
          </head>
          <body>
            ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}" />` : ''}
            <h1>${recipe.title}</h1>
            <p>${recipe.description}</p>
            
            <div class="meta">
              <div><strong>Время:</strong> ${recipe.prepTime + recipe.cookTime} мин</div>
              <div><strong>Порции:</strong> ${portions}</div>
            </div>

            <h2>Ингредиенты</h2>
            <div>
              ${recipe.ingredients.map(ing => `
                <div class="ingredient">
                  <span>${ing.name}</span>
                  <span>${Math.round(ing.amount * portionRatio)} ${ing.unit}</span>
                </div>
              `).join('')}
            </div>

            <h2>Шаги приготовления</h2>
            <div>
              ${recipe.steps.map((step, index) => `
                <div class="step">
                  <div class="step-num">Шаг ${index + 1}</div>
                  <div>${step.description}</div>
                </div>
              `).join('')}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Helmet>
        <title>{recipe.title} | CIVS</title>
        <meta name="description" content={recipe.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Recipe",
            "name": recipe.title,
            "description": recipe.description,
            "author": {
              "@type": "Person",
              "name": author.name
            },
            "prepTime": `PT${recipe.prepTime}M`,
            "cookTime": `PT${recipe.cookTime}M`,
            "totalTime": `PT${recipe.prepTime + recipe.cookTime}M`,
            "recipeYield": recipe.portions,
            "recipeCategory": recipe.category,
            "image": recipe.imageUrl
          })}
        </script>
      </Helmet>

      {/* Back Button */}
      <button 
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/recipes/all');
          }
        }}
        className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Назад к списку</span>
      </button>

      {/* Breadcrumbs */}
      <div className="text-sm text-text-muted mb-6 flex items-center gap-2">
        <Link to="/?tab=Рецепты" className="hover:text-text-primary">Рецепты</Link>
        <span>/</span>
        <Link to={`/recipes/${recipe.category === 'Завтрак' ? 'breakfast' : 
                          recipe.category === 'Обед' ? 'lunch' : 
                          recipe.category === 'Ужин' ? 'dinner' : 
                          recipe.category === 'Здоровая еда' ? 'healthy' : 
                          recipe.category === 'Закуски' ? 'snacks' : 
                          recipe.category === 'Десерты' ? 'desserts' : 
                          recipe.category === 'Салаты' ? 'salads' :
                          recipe.category === 'Суп' ? 'soups' :
                          recipe.category === 'Гарнир' ? 'sides' :
                          recipe.category === 'Выпечка' ? 'baking' :
                          recipe.category === 'Соусы и маринады' ? 'sauces' : 'all'}`} 
              className="hover:text-text-primary">
          {recipe.category}
        </Link>
      </div>

      {/* Hero Image */}
      {recipe.imageUrl && (
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-video mb-8">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <button 
          onClick={() => {
            if (currentUser) {
              toggleLikeRecipe(currentUser.id, recipe.id);
            }
          }}
          className={cn(
            "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors",
            isLiked 
              ? "border-red-900/30 bg-red-900/20 text-red-400 hover:bg-red-900/30" 
              : "border-border-color hover:bg-bg-surface-light text-text-muted hover:text-red-400"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isLiked && "fill-current")} />
          {recipe.likesCount || 0}
        </button>
        {currentUser?.id === author.id && (
          <Link 
            to={`/submit?edit=${recipe.id}`}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-blue-900/30 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 text-xs sm:text-sm font-medium transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Редактировать
          </Link>
        )}
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-border-color hover:bg-bg-surface-light text-xs sm:text-sm font-medium text-text-muted print:hidden"
        >
          <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Печать
        </button>
        {currentUser?.id === author.id && (
          <button 
            onClick={() => togglePinRecipe(currentUser.id, recipe.id)}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors",
              isPinned
                ? "border-yellow-900/30 bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/30"
                : "border-border-color hover:bg-bg-surface-light text-text-muted hover:text-yellow-500"
            )}
          >
            <Pin className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isPinned && "fill-current")} />
            {isPinned ? 'Открепить' : 'Закрепить'}
          </button>
        )}
        {(isAdmin || currentUser?.id === author.id) && (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-red-900/30 bg-red-900/20 text-red-500 hover:bg-red-900/30 text-xs sm:text-sm font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Удалить
          </button>
        )}
      </div>

      {/* Title & Description */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary mb-4 sm:mb-6 leading-tight">
        {recipe.title}
      </h1>
      <p className="text-base sm:text-lg text-text-muted mb-8 leading-relaxed">
        {recipe.description}
      </p>

      {/* Author Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-bg-surface rounded-2xl mb-8 border border-border-color gap-4">
        <Link to={`/profile/${author.id}`} className="flex items-center gap-4">
          {author.avatar && <img src={author.avatar} alt={author.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />}
          <div>
            <div className="font-bold text-text-primary text-sm sm:text-base">{author.name}</div>
            {author.bio && <div className="text-xs sm:text-sm text-text-muted line-clamp-1">{author.bio}</div>}
          </div>
        </Link>
        {currentUser?.id !== author.id && (
          <button 
            onClick={() => toggleFollow(currentUser.id, author.id)}
            className={cn(
              "w-full sm:w-auto px-6 py-2 rounded-full text-sm font-bold transition-colors border-2",
              isFollowing 
                ? "bg-bg-surface-light border-border-color text-text-primary hover:bg-border-color"
                : "bg-transparent border-primary text-primary hover:bg-primary/10"
            )}
          >
            {isFollowing ? 'Отписаться' : 'Подписаться'}
          </button>
        )}
      </div>

      {/* Nutritional Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-primary rounded-2xl p-3 sm:p-4 text-center border-2 border-primary text-black">
          <div className="text-[10px] sm:text-xs font-bold uppercase mb-1">Калории</div>
          <div className="text-lg sm:text-xl font-black">{Math.round((recipe.nutritionalInfo?.calories || 0) * portionRatio)}</div>
          <div className="text-[10px] sm:text-xs">ккал</div>
        </div>
        <div className="bg-transparent rounded-2xl p-3 sm:p-4 text-center border-2 border-primary text-primary">
          <div className="text-[10px] sm:text-xs font-bold uppercase mb-1">Белки</div>
          <div className="text-lg sm:text-xl font-black">{Math.round((recipe.nutritionalInfo?.protein || 0) * portionRatio)}</div>
          <div className="text-[10px] sm:text-xs">грамм</div>
        </div>
        <div className="bg-transparent rounded-2xl p-3 sm:p-4 text-center border-2 border-primary text-primary">
          <div className="text-[10px] sm:text-xs font-bold uppercase mb-1">Жиры</div>
          <div className="text-lg sm:text-xl font-black">{Math.round((recipe.nutritionalInfo?.fat || 0) * portionRatio)}</div>
          <div className="text-[10px] sm:text-xs">грамм</div>
        </div>
        <div className="bg-transparent rounded-2xl p-3 sm:p-4 text-center border-2 border-primary text-primary">
          <div className="text-[10px] sm:text-xs font-bold uppercase mb-1">Углеводы</div>
          <div className="text-lg sm:text-xl font-black">{Math.round((recipe.nutritionalInfo?.carbs || 0) * portionRatio)}</div>
          <div className="text-[10px] sm:text-xs">грамм</div>
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-text-muted text-center mb-8">Показатели рассчитаны на потребность одного взрослого</p>

      {/* Recipe Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-6 border border-border-color rounded-2xl mb-12 bg-bg-surface">
        <div>
          <div className="text-xs sm:text-sm font-bold text-text-primary mb-2">Будет готово через</div>
          <div className="flex items-center gap-2 text-text-muted">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-sm sm:text-base font-medium">{recipe.prepTime + recipe.cookTime} минут</span>
          </div>
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold text-text-primary mb-2">Время на кухне</div>
          <div className="flex items-center gap-2 text-text-muted">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="text-sm sm:text-base font-medium">{recipe.prepTime} минут</span>
          </div>
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold text-text-primary mb-2">Сложность</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Flame 
                key={star} 
                className={cn("w-4 h-4 sm:w-5 sm:h-5", star <= recipe.difficulty ? "text-orange-500 fill-orange-500" : "text-border-color")} 
              />
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold text-text-primary mb-2">Острота</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((pepper) => (
              <span key={pepper} className={cn("text-base sm:text-lg", pepper <= (recipe.spiciness || 0) ? "" : "opacity-30 grayscale")}>🌶️</span>
            ))}
          </div>
        </div>
        {recipe.cuisine && (
          <div>
            <div className="text-xs sm:text-sm font-bold text-text-primary mb-2">Кухня</div>
            <div className="text-text-muted text-sm sm:text-base font-medium">{recipe.cuisine}</div>
          </div>
        )}
        {recipe.allergens && recipe.allergens.length > 0 && (
          <div>
            <div className="text-xs sm:text-sm font-bold text-text-primary mb-2">Аллергены</div>
            <div className="text-text-muted text-sm sm:text-base font-medium">{recipe.allergens.join(', ')}</div>
          </div>
        )}
      </div>

      {/* Ingredients Section */}
      <section>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-text-primary">Продукты для рецепта</h2>
        
        <div className="flex items-center gap-4 mb-8">
          <span className="font-bold text-text-primary">Порции</span>
          <div className="flex items-center border border-border-color rounded-full overflow-hidden">
            <button 
              onClick={() => setPortions(Math.max(1, portions - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-bg-surface-light text-text-muted transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-12 h-10 flex items-center justify-center font-bold text-text-primary border-x border-border-color">
              {portions}
            </div>
            <button 
              onClick={() => setPortions(portions + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-bg-surface-light text-text-muted transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-8 mb-12">
          {Object.entries(
            recipe.ingredients.reduce((acc, ing) => {
              const cat = ing.category || 'Основные';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(ing);
              return acc;
            }, {} as Record<string, typeof recipe.ingredients>)
          ).map(([category, ingredients], catIdx) => (
            <div key={catIdx}>
              <h3 className="text-xl font-bold text-text-primary mb-4">{category}</h3>
              <div className="space-y-4">
                {ingredients.map((ing, idx) => {
                  const scaledAmount = Number((ing.amount * portionRatio).toFixed(1));
                  return (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-dashed border-border-color">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-bg-surface-light rounded-xl flex items-center justify-center shadow-sm border border-border-color">
                          <IngredientIcon name={ing.name} className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-medium text-text-primary border-b border-border-color pb-0.5">{ing.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 flex-shrink-0 bg-bg-surface-light border border-border-color rounded-lg px-2 py-1 text-text-primary text-sm text-center">
                          {scaledAmount}
                        </div>
                        <span className="text-text-muted text-sm w-20 text-left truncate flex-shrink-0">{ing.unit}</span>
                        <button 
                          onClick={() => {
                            if (currentUser) {
                              addToShoppingList(currentUser.id, currentUser.shoppingList || [], { ...ing, amount: scaledAmount }, scaledAmount);
                              addNotification(`${ing.name} добавлен в список покупок!`, 'success');
                            } else {
                              addNotification('Пожалуйста, войдите в систему', 'info');
                            }
                          }}
                          className="p-2 flex-shrink-0 rounded-full hover:bg-bg-surface-light text-primary transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      {recipe.steps && recipe.steps.length > 0 && (
        <section className="mt-16 border-t border-border-color pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-12 flex items-center gap-3 text-text-primary">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Пошаговый рецепт
          </h2>
          <div className="space-y-16">
            {[...recipe.steps].sort((a, b) => a.order - b.order).map((step) => (
              <div key={step.id} className="group">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className={cn("flex-1", !step.imageUrl && "max-w-2xl")}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg font-black shadow-sm text-black">
                        {step.order}
                      </div>
                      <h3 className="text-xl font-bold text-text-primary">Шаг {step.order}</h3>
                    </div>
                    <p className="text-text-muted leading-relaxed text-lg bg-bg-surface p-6 rounded-2xl border border-border-color">
                      {step.description}
                      {(() => {
                        const timeMatch = step.description.match(/(\d+)\s*(минут|мин|часа|час)/i);
                        if (timeMatch) {
                          let mins = parseInt(timeMatch[1]);
                          if (timeMatch[2].startsWith('час')) mins *= 60;
                          return (
                            <button 
                              onClick={() => setActiveTimer(mins)}
                              className="inline-flex items-center gap-1.5 ml-3 px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary/30 transition-colors print:hidden"
                            >
                              <TimerIcon className="w-4 h-4" />
                              Запустить таймер ({mins} мин)
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </p>
                  </div>
                  {step.imageUrl && (
                    <div className="md:w-1/2">
                      <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md group-hover:shadow-xl transition-shadow duration-300">
                        <img 
                          src={step.imageUrl} 
                          alt={`Шаг ${step.order}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Recipes */}
      {similarRecipes.length > 0 && (
        <section className="mt-20 border-t border-border-color pt-16 print:hidden">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-text-primary">Вам также может понравиться</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarRecipes.map(r => {
              const rAuthor = users.find(u => u.id === r.authorId);
              if (!rAuthor) return null;
              return <RecipeCard key={r.id} recipe={r} author={rAuthor} />;
            })}
          </div>
        </section>
      )}

      {activeTimer && (
        <Timer initialMinutes={activeTimer} onClose={() => setActiveTimer(null)} />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-surface rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-border-color">
            <h3 className="text-xl font-bold text-text-primary mb-2">Удалить рецепт?</h3>
            <p className="text-text-muted mb-6">Это действие нельзя будет отменить. Вы уверены, что хотите удалить «{recipe.title}»?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-border-color rounded-xl font-bold text-text-primary hover:bg-bg-surface-light transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
