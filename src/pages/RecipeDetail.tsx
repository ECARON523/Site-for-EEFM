import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Flame, Minus, Plus, Trash2, Printer, Timer as TimerIcon, Pencil, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { cn } from '../lib/utils';
import { IngredientIcon } from '../components/IngredientIcon';
import Timer from '../components/Timer';
import RecipeCard from '../components/RecipeCard';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { recipes, deleteRecipe } = useRecipeStore();
  const { addNotification } = useNotificationStore();
  
  const recipe = recipes.find(r => r.id === id);
  
  const [portions, setPortions] = useState(recipe?.portions || 1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);

  const similarRecipes = useMemo(() => {
    if (!recipe) return [];
    return recipes
      .filter(r => r.id !== recipe.id && r.category === recipe.category && r.status === 'approved')
      .slice(0, 3);
  }, [recipes, recipe]);

  if (!recipe) {
    return <div className="p-8 text-center text-text-muted">Блюдо не найдено</div>;
  }

  const portionRatio = portions / recipe.portions;
  
  // Доступ только для персонала (кухня или админ)
  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'kitchen';
  // Права на редактирование
  const canEdit = currentUser?.role === 'admin' || currentUser?.id === recipe.authorId;

  // УМНОЕ АВТО-ОПРЕДЕЛЕНИЕ ЦЕХА (Если его нет в базе)
  const determineDepartment = () => {
    if (recipe.department) return recipe.department;
    const cat = recipe.category.toLowerCase();
    const title = recipe.title.toLowerCase();
    if (cat.includes('десерт') || cat.includes('выпечк') || title.includes('торт') || title.includes('чизкейк') || title.includes('брауни') || title.includes('крем-брюле') || title.includes('тирамису') || title.includes('сырник')) return 'Десерты';
    if (cat.includes('салат') || cat.includes('закуск') || title.includes('салат')) return 'Холодный цех';
    if (cat.includes('напит') || title.includes('кофе') || title.includes('чай')) return 'Бар';
    return 'Горячий цех'; 
  };
  const actualDepartment = determineDepartment();

  const handleDelete = async () => {
    try {
      await deleteRecipe(recipe.id);
      navigate('/');
    } catch (error) {
      addNotification("Не удалось удалить блюдо", "error");
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
              <div><strong>Цех:</strong> ${actualDepartment}</div>
              <div><strong>Порции:</strong> ${portions}</div>
            </div>

            <h2>Ингредиенты</h2>
            <div>
              ${recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients.map(ing => `
                <div class="ingredient">
                  <span>${ing.name}</span>
                  <span>${Math.round(ing.amount * portionRatio)} ${ing.unit}</span>
                </div>
              `).join('') : '<p>Ингредиенты не указаны</p>'}
            </div>

            ${isStaff ? `
            <h2>Шаги приготовления (Только для Кухни)</h2>
            <div>
              ${recipe.steps && recipe.steps.length > 0 ? recipe.steps.map((step, index) => `
                <div class="step">
                  <div class="step-num">Шаг ${index + 1}</div>
                  <div>${step.description}</div>
                </div>
              `).join('') : '<p>Шаги не указаны</p>'}
            </div>
            ` : ''}
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
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Helmet>
        <title>{recipe.title} | CIVS Меню</title>
      </Helmet>

      {/* Back Button */}
      <button onClick={() => { window.history.length > 1 ? navigate(-1) : navigate('/recipes/all'); }} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-6 group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Назад в меню</span>
      </button>

      {/* Breadcrumbs */}
      <div className="text-sm text-text-muted mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-text-primary">Меню</Link>
        <span>/</span>
        <span className="text-text-primary font-medium">{actualDepartment}</span>
      </div>

      {/* Hero Image */}
      {recipe.imageUrl && (
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-video mb-8">
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white font-black uppercase tracking-wider text-sm border border-white/10 shadow-lg">
            {actualDepartment}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-color hover:bg-bg-surface-light text-sm font-bold text-text-muted transition-colors print:hidden">
          <Printer className="w-4 h-4" /> Печать
        </button>
        {canEdit && (
          <>
            <Link to={`/submit?edit=${recipe.id}`} className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-900/30 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 text-sm font-bold transition-colors"><Pencil className="w-4 h-4" /> Редактировать</Link>
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-900/30 bg-red-900/20 text-red-500 hover:bg-red-900/30 text-sm font-bold transition-colors"><Trash2 className="w-4 h-4" /> Удалить</button>
          </>
        )}
      </div>

      {/* Title & Description */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary mb-4 sm:mb-6 leading-tight">{recipe.title}</h1>
      {recipe.price && <div className="text-3xl font-black text-primary mb-6">{recipe.price} ₽</div>}
      <p className="text-base sm:text-lg text-text-muted mb-8 leading-relaxed">{recipe.description}</p>

      {/* Nutritional Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-primary rounded-2xl p-4 text-center border-2 border-primary text-black">
          <div className="text-xs font-bold uppercase mb-1">Калории</div>
          <div className="text-xl font-black">{Math.round((recipe.nutritionalInfo?.calories || 0) * portionRatio)}</div>
          <div className="text-xs">ккал</div>
        </div>
        <div className="bg-bg-surface rounded-2xl p-4 text-center border border-border-color text-text-primary">
          <div className="text-xs font-bold uppercase text-text-muted mb-1">Белки</div>
          <div className="text-xl font-black">{Math.round((recipe.nutritionalInfo?.protein || 0) * portionRatio)}</div>
          <div className="text-xs text-text-muted">грамм</div>
        </div>
        <div className="bg-bg-surface rounded-2xl p-4 text-center border border-border-color text-text-primary">
          <div className="text-xs font-bold uppercase text-text-muted mb-1">Жиры</div>
          <div className="text-xl font-black">{Math.round((recipe.nutritionalInfo?.fat || 0) * portionRatio)}</div>
          <div className="text-xs text-text-muted">грамм</div>
        </div>
        <div className="bg-bg-surface rounded-2xl p-4 text-center border border-border-color text-text-primary">
          <div className="text-xs font-bold uppercase text-text-muted mb-1">Углеводы</div>
          <div className="text-xl font-black">{Math.round((recipe.nutritionalInfo?.carbs || 0) * portionRatio)}</div>
          <div className="text-xs text-text-muted">грамм</div>
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-text-muted text-center mb-8">Показатели рассчитаны на выбранное количество порций</p>

      {/* Recipe Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-6 border border-border-color rounded-2xl mb-12 bg-bg-surface">
        {isStaff && (
          <>
            <div>
              <div className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Общее время</div>
              <div className="flex items-center gap-2 text-text-primary"><Clock className="w-5 h-5 text-primary" /><span className="text-base font-black">{recipe.prepTime + recipe.cookTime} минут</span></div>
            </div>
            <div>
              <div className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">На подготовку</div>
              <div className="flex items-center gap-2 text-text-primary"><Clock className="w-5 h-5 text-yellow-500" /><span className="text-base font-black">{recipe.prepTime} минут</span></div>
            </div>
          </>
        )}
        <div>
          <div className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Сложность</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => <Flame key={star} className={cn("w-5 h-5", star <= recipe.difficulty ? "text-orange-500 fill-orange-500" : "text-border-color")} />)}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Острота</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((pepper) => <span key={pepper} className={cn("text-lg", pepper <= (recipe.spiciness || 0) ? "" : "opacity-20 grayscale")}>🌶️</span>)}
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <section>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-text-primary">Состав блюда</h2>
        <div className="flex items-center gap-4 mb-8 bg-bg-surface-light p-4 rounded-2xl border border-border-color w-fit">
          <span className="font-bold text-text-muted uppercase tracking-wider text-sm">Порции:</span>
          <div className="flex items-center bg-bg-surface border border-border-color rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => setPortions(Math.max(1, portions - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-bg-surface-light text-text-muted transition-colors"><Minus className="w-4 h-4" /></button>
            <div className="w-12 h-10 flex items-center justify-center font-black text-text-primary text-lg">{portions}</div>
            <button onClick={() => setPortions(portions + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-bg-surface-light text-text-muted transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="space-y-6 mb-12 bg-bg-surface p-6 sm:p-8 rounded-3xl border border-border-color shadow-sm">
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            Object.entries(
              recipe.ingredients.reduce((acc, ing) => {
                const cat = ing.category || 'Основные';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(ing);
                return acc;
              }, {} as Record<string, typeof recipe.ingredients>)
            ).map(([category, ingredients], catIdx) => (
              <div key={catIdx}>
                <h3 className="text-sm font-black text-text-muted uppercase tracking-widest mb-4">{category}</h3>
                <div className="space-y-3">
                  {ingredients.map((ing, idx) => {
                    const scaledAmount = Number((ing.amount * portionRatio).toFixed(1));
                    return (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-border-color/50 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-bg-surface-light rounded-lg flex items-center justify-center border border-border-color shrink-0">
                            <IngredientIcon name={ing.name} className="w-5 h-5 text-text-muted" />
                          </div>
                          <span className="font-bold text-text-primary text-sm sm:text-base">{ing.name}</span>
                        </div>
                        <div className="text-right whitespace-nowrap pl-4">
                          <span className="font-black text-text-primary mr-1.5">{scaledAmount}</span>
                          <span className="text-text-muted text-sm font-medium">{ing.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
             <div className="text-center text-text-muted py-8 font-bold">Ингредиенты не указаны</div>
          )}
        </div>
      </section>

      {/* Steps Section */}
      {isStaff && recipe.steps && recipe.steps.length > 0 && (
        <section className="mt-16 border-t border-border-color pt-16">
          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tight text-text-primary flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span> Технологическая карта
            </h2>
            <p className="text-blue-400 font-bold text-sm mt-2 uppercase tracking-wider">Доступно только для персонала кухни</p>
          </div>
          
          <div className="space-y-12">
            {[...recipe.steps].sort((a, b) => a.order - b.order).map((step) => (
              <div key={step.id} className="group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={cn("flex-1", !step.imageUrl && "max-w-3xl")}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-lg font-black text-blue-500">{step.order}</div>
                    </div>
                    <p className="text-text-primary leading-relaxed text-lg bg-bg-surface-light p-6 rounded-2xl border border-border-color font-medium">
                      {step.description}
                      {(() => {
                        const timeMatch = step.description.match(/(\d+)\s*(минут|мин|часа|час)/i);
                        if (timeMatch) {
                          let mins = parseInt(timeMatch[1]);
                          if (timeMatch[2].startsWith('час')) mins *= 60;
                          return (
                            <button onClick={() => setActiveTimer(mins)} className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-black transition-colors print:hidden uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95">
                              <TimerIcon className="w-4 h-4" /> Запустить таймер ({mins} мин)
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </p>
                  </div>
                  {step.imageUrl && (
                    <div className="md:w-5/12">
                      <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md border border-border-color">
                        <img src={step.imageUrl} alt={`Шаг ${step.order}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 text-text-primary">Похожие позиции меню</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarRecipes.map(r => ( <RecipeCard key={r.id} recipe={r} /> ))}
          </div>
        </section>
      )}

      {activeTimer && <Timer initialMinutes={activeTimer} onClose={() => setActiveTimer(null)} />}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-surface rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-border-color">
            <h3 className="text-xl font-black uppercase tracking-tight text-text-primary mb-2">Удалить блюдо?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-3 border border-border-color rounded-xl font-bold text-text-primary hover:bg-bg-surface-light transition-colors uppercase tracking-wider text-sm">Отмена</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-black hover:bg-red-600 transition-colors uppercase tracking-wider text-sm">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}