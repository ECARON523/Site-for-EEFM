import React from 'react';
import { X, Clock, Users, BarChart2, ChefHat, Info } from 'lucide-react';
import { Recipe } from '../types';

interface RecipePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export const RecipePreviewModal: React.FC<RecipePreviewModalProps> = ({ isOpen, onClose, recipe }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-bg-surface rounded-3xl w-full max-w-4xl border border-border-color shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-bg-surface-light hover:bg-border-color rounded-full transition-all text-text-muted z-10 shadow-lg"
          title="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-full md:w-1/2">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full aspect-video object-cover rounded-2xl shadow-xl border border-border-color" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <div>
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block">
                  {recipe.category}
                </span>
                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight leading-none mb-4">{recipe.title}</h2>
                <p className="text-text-muted leading-relaxed italic">"{recipe.description}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-surface-light p-4 rounded-2xl border border-border-color flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-text-muted uppercase font-bold">Время</div>
                    <div className="text-sm font-black text-text-primary">{recipe.prepTime + recipe.cookTime} мин</div>
                  </div>
                </div>
                <div className="bg-bg-surface-light p-4 rounded-2xl border border-border-color flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-text-muted uppercase font-bold">Порции</div>
                    <div className="text-sm font-black text-text-primary">{recipe.portions}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-primary" />
                Ингредиенты
              </h3>
              <ul className="space-y-4">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-border-color pb-2">
                    <span className="text-text-primary">{ing.name}</span>
                    <span className="text-primary font-bold">{ing.amount} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6 flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-primary" />
                Инструкция
              </h3>
              <div className="space-y-8">
                {recipe.steps?.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="shrink-0 w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                      {step.order}
                    </div>
                    <div className="space-y-4 flex-1">
                      <p className="text-text-primary leading-relaxed pt-1">{step.description}</p>
                      {step.imageUrl && (
                        <img 
                          src={step.imageUrl} 
                          alt={`Step ${step.order}`} 
                          className="w-full max-w-lg aspect-video object-cover rounded-xl border border-border-color shadow-lg" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {recipe.nutritionalInfo && (
            <div className="mt-12 pt-12 border-t border-border-color">
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-primary" />
                Пищевая ценность
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-bg-surface-light p-4 rounded-2xl border border-border-color text-center">
                  <div className="text-2xl font-black text-text-primary">{recipe.nutritionalInfo.calories}</div>
                  <div className="text-xs text-text-muted uppercase font-bold">Ккал</div>
                </div>
                <div className="bg-bg-surface-light p-4 rounded-2xl border border-border-color text-center">
                  <div className="text-2xl font-black text-text-primary">{recipe.nutritionalInfo.protein}г</div>
                  <div className="text-xs text-text-muted uppercase font-bold">Белки</div>
                </div>
                <div className="bg-bg-surface-light p-4 rounded-2xl border border-border-color text-center">
                  <div className="text-2xl font-black text-text-primary">{recipe.nutritionalInfo.fat}г</div>
                  <div className="text-xs text-text-muted uppercase font-bold">Жиры</div>
                </div>
                <div className="bg-bg-surface-light p-4 rounded-2xl border border-border-color text-center">
                  <div className="text-2xl font-black text-text-primary">{recipe.nutritionalInfo.carbs}г</div>
                  <div className="text-xs text-text-muted uppercase font-bold">Углеводы</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border-color flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-bg-surface-light hover:bg-border-color text-text-primary font-bold rounded-xl transition-all shadow-lg border border-border-color"
            >
              Закрыть просмотр
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
