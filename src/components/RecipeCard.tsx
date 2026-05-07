import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X, Trash2, Edit2, Minus, Plus } from 'lucide-react';
import { Recipe, User } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { useCartStore } from '../store/useCartStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { AdminEditModal } from './AdminEditModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { IngredientIcon } from './IngredientIcon';

interface RecipeCardProps {
  key?: string | number;
  recipe: Recipe;
  author?: User; 
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { currentUser } = useAuthStore();
  const { deleteRecipe } = useRecipeStore();
  const { addNotification } = useNotificationStore();
  
  // Подключаем хранилище корзины
  const { items: cartItems, addItem, updateQuantity, removeItem } = useCartStore();

  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser?.id === recipe.authorId;

  // Ищем этот товар в корзине
  const cartItem = cartItems.find(item => item.id === recipe.id);
  const displayPrice = recipe.price || 550;

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
      addNotification("Не удалось удалить блюдо", "error");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ 
      id: recipe.id, 
      title: recipe.title, 
      price: displayPrice, 
      imageUrl: recipe.imageUrl,
      department: recipe.department // ТЕПЕРЬ ПЕРЕДАЕМ ЦЕХ
    });
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(recipe.id, cartItem.quantity - 1);
      } else {
        removeItem(recipe.id);
      }
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartItem) {
      updateQuantity(recipe.id, cartItem.quantity + 1);
    }
  };

  return (
    <>
      <div className="bg-bg-surface rounded-2xl overflow-hidden border border-border-color shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
        
        {/* Блок с картинкой */}
        <div className="relative block aspect-[4/3] sm:aspect-video overflow-hidden">
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
          
          {/* Админские кнопки поверх картинки */}
          {(isAdmin || isOwner) && (
             <div className="absolute top-3 right-3 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setEditModal(true)} className="bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                 <Edit2 className="w-4 h-4" />
               </button>
               <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-500/80 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          )}
          
          {/* Плашки категории и времени */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-2">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-sm border border-white/10">
              {recipe.category}
            </div>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white flex items-center gap-1.5 shadow-sm border border-white/10">
            <Clock className="w-3.5 h-3.5" />{recipe.cookTime + recipe.prepTime} мин
          </div>
        </div>

        {/* Информационный блок */}
        <div className="p-4 flex flex-col flex-1">
          <Link to={`/recipe/${recipe.id}`}>
            <h3 className="text-base sm:text-lg font-bold text-text-primary leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">
              {recipe.title}
            </h3>
          </Link>
          
          <p className="text-xs sm:text-sm text-text-muted line-clamp-2 mb-4 flex-1">
            {recipe.description}
          </p>
          
          <button onClick={() => setShowIngredients(true)} className="self-start text-xs font-medium text-text-muted hover:text-text-primary underline underline-offset-4 mb-4">
            Состав блюда
          </button>
          
          {/* Подвал с ценой и кнопками корзины */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border-color min-h-[56px]">
            <div className="font-black text-lg sm:text-xl text-text-primary">
              {displayPrice} ₽
            </div>
            
            {/* ИСПРАВЛЕННЫЙ, РОВНЫЙ СЧЕТЧИК */}
            {cartItem ? (
              <div className="flex items-center h-10 w-[110px] bg-bg-surface-light rounded-full border border-border-color overflow-hidden">
                <button 
                  onClick={handleDecrease} 
                  className="w-10 h-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 flex items-center justify-center font-bold text-text-primary text-sm">
                  {cartItem.quantity}
                </span>
                <button 
                  onClick={handleIncrease} 
                  className="w-10 h-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center h-10 bg-bg-surface-light hover:bg-primary hover:text-black text-text-primary border border-border-color px-5 rounded-full text-sm font-bold transition-all active:scale-95"
              >
                В корзину
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно "Состав блюда" */}
      {showIngredients && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-surface rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-border-color flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary">Состав блюда</h3>
              <button onClick={() => setShowIngredients(false)} className="text-text-muted hover:text-text-primary transition-colors">
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
                          <div className="text-right text-text-muted">{ing.amount} {ing.unit}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-border-color bg-bg-surface-light">
              <button 
                onClick={(e) => {
                  handleAddToCart(e);
                  setShowIngredients(false);
                }}
                className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Добавить в корзину за {displayPrice} ₽
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Модалки Админа */}
      {editModal && (
        <AdminEditModal 
          isOpen={editModal} 
          onClose={() => setEditModal(false)} 
          title="Редактировать блюдо" 
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
            <h3 className="text-xl font-bold text-text-primary mb-2">Удалить блюдо?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-border-color rounded-xl font-bold text-text-primary hover:bg-bg-surface-light transition-colors">Отмена</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}