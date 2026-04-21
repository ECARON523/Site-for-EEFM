import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, X, Heart, Bookmark, Utensils, Leaf, Trash2, Edit2, Pencil } from 'lucide-react';
import { Recipe, User } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { AdminEditModal } from './AdminEditModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { IngredientIcon } from './IngredientIcon';
import { cn } from '../lib/utils';

interface RecipeCardProps {
  key?: string | number;
  recipe: Recipe;
  author: User;
}

export default function RecipeCard({ recipe, author }: RecipeCardProps) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { currentUser } = useAuthStore();
  const { toggleFollow, toggleLikeRecipe, toggleSaveRecipe } = useUserStore();
  const { deleteRecipe } = useRecipeStore();
  const { addNotification } = useNotificationStore();

  const isFollowing = currentUser?.followingIds.includes(author.id);
  const isLiked = currentUser?.likedRecipeIds?.includes(recipe.id);
  const isSaved = currentUser?.savedRecipeIds?.includes(recipe.id);
  const isAdmin = currentUser?.role === 'admin';

  const handleSave = async (data: any) => {
    const recipeRef = doc(db, 'recipes_v2', recipe.id);
    await updateDoc(recipeRef, {
      title: data.title,
      description: data.description
    });
  };

  const handleDelete = async () => {
    try {
      await deleteRecipe(recipe.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      addNotification("Не удалось удалить рецепт", "error");
    }
  };

  return (
    <>
      <div className="bg-bg-surface rounded-2xl overflow-hidden border border-border-color shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        {/* Author Header */}
        <div className="p-4 flex items-center justify-between gap-2">
          <Link to={`/profile/${author.id}`} className="flex items-center gap-3 group min-w-0">
            {author.avatar && <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-full object-cover shrink-0" />}
            <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors truncate">{author.name}</span>
          </Link>
          <div className="flex items-center gap-1.5 shrink-0">
            {currentUser?.id === author.id && (
              <Link 
                to={`/submit?edit=${recipe.id}`}
                className="text-blue-400 bg-blue-900/20 p-1.5 rounded hover:bg-blue-900/40 transition-colors"
                title="Редактировать"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            )}
            {isAdmin && (
              <button 
                onClick={() => setEditModal(true)} 
                className="text-blue-400 bg-blue-900/20 p-1.5 rounded hover:bg-blue-900/40 transition-colors"
                title="Редактировать (Админ)"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {(isAdmin || currentUser?.id === author.id) && (
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="text-red-400 bg-red-900/20 p-1.5 rounded hover:bg-red-900/40 transition-colors"
                title="Удалить рецепт"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (currentUser) {
                  toggleFollow(currentUser.id, author.id);
                }
              }}
              className={`transition-colors ${isFollowing ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
            >
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isFollowing ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  {isFollowing ? (
                    <>
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <polyline points="17 11 19 13 23 9" />
                    </>
                  ) : (
                    <>
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </>
                  )}
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative block aspect-[4/3] sm:aspect-video overflow-hidden group">
          <Link to={`/recipe/${recipe.id}`}>
            {recipe.imageUrl && (
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            )}
          </Link>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (currentUser) {
                toggleSaveRecipe(currentUser.id, recipe.id);
              }
            }}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              isSaved 
                ? 'bg-primary text-black shadow-lg scale-110' 
                : 'bg-black/20 text-white hover:bg-black/40'
            }`}
            title={isSaved ? "Удалить из сохраненных" : "Сохранить рецепт"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Category Pill */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-2">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-sm border border-white/10">
              {recipe.category}
            </div>
            {recipe.status !== 'approved' && (
              <div className={cn(
                "px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm",
                recipe.status === 'pending' ? "bg-yellow-400 text-black" : "bg-red-500 text-white"
              )}>
                {recipe.status === 'pending' ? 'На проверке' : 'Отклонено'}
              </div>
            )}
          </div>
          {/* Time Pill */}
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white flex items-center gap-1.5 shadow-sm border border-white/10">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {recipe.cookTime + recipe.prepTime > 60 
              ? `${Math.floor((recipe.cookTime + recipe.prepTime) / 60)} ч ${((recipe.cookTime + recipe.prepTime) % 60) || ''} м`
              : `${recipe.cookTime + recipe.prepTime} мин`
            }
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <Link to={`/recipe/${recipe.id}`}>
            <h3 className="text-base sm:text-lg font-bold text-text-primary leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">
              {recipe.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-4 flex-1">
            {recipe.description}
          </p>
          
          {/* Ingredients Button and Like Button */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <button 
              onClick={() => setShowIngredients(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-bg-surface-light hover:bg-gray-400/20 text-text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 h-4" />
              Ингредиенты
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (currentUser) {
                  toggleLikeRecipe(currentUser.id, recipe.id);
                }
              }}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                isLiked 
                  ? 'text-red-500 bg-red-900/20 hover:bg-red-900/40' 
                  : 'text-text-muted bg-bg-surface-light hover:bg-gray-400/20 hover:text-red-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {recipe.likesCount || 0}
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients Modal */}
      {showIngredients && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-surface rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-border-color flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary">Ингредиенты</h3>
              <button 
                onClick={() => setShowIngredients(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {Object.entries(
                  recipe.ingredients.reduce((acc, ing) => {
                    const cat = ing.category || 'Основные';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(ing);
                    return acc;
                  }, {} as Record<string, typeof recipe.ingredients>)
                ).map(([category, ingredients], catIdx) => (
                  <div key={catIdx}>
                    <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">{category}</h4>
                    <ul className="space-y-3">
                      {ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-bg-surface-light rounded-lg flex items-center justify-center shadow-sm border border-border-color">
                              <IngredientIcon name={ing.name} className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-text-primary font-medium">{ing.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-text-primary font-medium">{ing.amount} {ing.unit}</span>
                            {ing.weightGrams && <div className="text-xs text-text-muted">{ing.weightGrams} г</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-border-color bg-bg-surface-light">
              <Link 
                to={`/recipe/${recipe.id}`}
                className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors"
              >
                Смотреть полный рецепт
              </Link>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <AdminEditModal
          isOpen={editModal}
          onClose={() => setEditModal(false)}
          title="Редактировать рецепт"
          fields={[
            { name: 'title', label: 'Название', type: 'text', value: recipe.title },
            { name: 'description', label: 'Описание', type: 'textarea', value: recipe.description }
          ]}
          onSave={handleSave}
        />
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-surface border border-border-color rounded-2xl w-full max-w-sm p-6 shadow-2xl">
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
    </>
  );
}
