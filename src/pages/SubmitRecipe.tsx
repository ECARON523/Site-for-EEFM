import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Camera, 
  Trash2, 
  ChevronDown, 
  PlusCircle,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { RecipeCategory, Ingredient, RecipeStep } from '../types';
import { cn, compressImage } from '../lib/utils';

const CATEGORIES: RecipeCategory[] = [
  'Завтрак', 'Обед', 'Ужин', 'Здоровая еда', 'Закуски', 'Десерты', 
  'Пироги с рыбой', 'Блюда из творога', 'Суп', 'Гарнир'
];

const COMMON_INGREDIENTS = [
  'Курица', 'Говядина', 'Свинина', 'Рыба', 'Картофель', 'Морковь', 'Лук', 'Чеснок',
  'Помидоры', 'Огурцы', 'Перец', 'Баклажаны', 'Кабачки', 'Капуста', 'Брокколи',
  'Рис', 'Гречка', 'Макароны', 'Мука', 'Сахар', 'Соль', 'Масло подсолнечное',
  'Масло сливочное', 'Оливковое масло', 'Яйца', 'Молоко', 'Сметана', 'Сыр',
  'Творог', 'Сливки', 'Зелень', 'Укроп', 'Петрушка', 'Базилик', 'Грибы',
  'Мед', 'Лимон', 'Яблоки', 'Бананы', 'Клубника', 'Орехи', 'Шоколад'
];

const COMMON_UNITS = [
  'г', 'кг', 'мл', 'л', 'шт', 'ст. л.', 'ч. л.', 'зубчик', 'головка', 'пучок', 'по вкусу', 'щепотка', 'стакан', 'банка', 'упаковка', 'кусок', 'ножка', 'крылышко', 'грудка'
];

export default function SubmitRecipe() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const { currentUser } = useAuthStore();
  const { addRecipe, recipes, updateRecipe } = useRecipeStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Обед');
  const [imageUrl, setImageUrl] = useState('');
  const [portions, setPortions] = useState(1);
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [spiciness, setSpiciness] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [nutritionalInfo, setNutritionalInfo] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });
  
  const [ingredients, setIngredients] = useState<Omit<Ingredient, 'id'>[]>([
    { name: '', amount: 0, unit: '' }
  ]);
  
  const [steps, setSteps] = useState<Omit<RecipeStep, 'id'>[]>([
    { order: 1, description: '', imageUrl: '' },
    { order: 2, description: '', imageUrl: '' },
    { order: 3, description: '', imageUrl: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stepUploadingIndex, setStepUploadingIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [activeIngredientSearch, setActiveIngredientSearch] = useState<number | null>(null);
  const [activeUnitSearch, setActiveUnitSearch] = useState<number | null>(null);

  // Draft or Edit Logic
  useEffect(() => {
    if (editId) {
      const recipeToEdit = recipes.find(r => r.id === editId);
      if (recipeToEdit) {
        // Security check: only author or admin can edit
        if (recipeToEdit.authorId !== currentUser?.id && currentUser?.role !== 'admin') {
          navigate('/');
          return;
        }
        setTitle(recipeToEdit.title);
        setDescription(recipeToEdit.description);
        setCuisine(recipeToEdit.cuisine || '');
        setCategory(recipeToEdit.category);
        setImageUrl(recipeToEdit.imageUrl);
        setPortions(recipeToEdit.portions);
        setPrepTime(recipeToEdit.prepTime);
        setCookTime(recipeToEdit.cookTime);
        setDifficulty(recipeToEdit.difficulty);
        setSpiciness(recipeToEdit.spiciness || 1);
        setNutritionalInfo(recipeToEdit.nutritionalInfo || { calories: 0, protein: 0, fat: 0, carbs: 0 });
        setIngredients(recipeToEdit.ingredients.map(ing => ({ name: ing.name, amount: ing.amount, unit: ing.unit })));
        setSteps(recipeToEdit.steps?.map(step => ({ order: step.order, description: step.description, imageUrl: step.imageUrl || '' })) || []);
      }
    } else {
      const draft = localStorage.getItem('recipe_draft');
      if (draft) {
        try {
          const data = JSON.parse(draft);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setCuisine(data.cuisine || '');
          setCategory(data.category || 'Обед');
          setImageUrl(data.imageUrl || '');
          setPortions(data.portions || 1);
          setPrepTime(data.prepTime || 0);
          setCookTime(data.cookTime || 0);
          setDifficulty(data.difficulty || 3);
          setSpiciness(data.spiciness || 1);
          setNutritionalInfo(data.nutritionalInfo || { calories: 0, protein: 0, fat: 0, carbs: 0 });
          setIngredients(data.ingredients || [{ name: '', amount: 0, unit: '' }]);
          setSteps(data.steps || [
            { order: 1, description: '', imageUrl: '' },
            { order: 2, description: '', imageUrl: '' },
            { order: 3, description: '', imageUrl: '' }
          ]);
        } catch (e) {
          console.error("Failed to load draft", e);
        }
      }
    }
  }, [editId, recipes, currentUser, navigate]);

  useEffect(() => {
    if (!editId) {
      const draftData = {
        title, description, cuisine, category, imageUrl, portions, prepTime, cookTime, difficulty, spiciness, nutritionalInfo, ingredients, steps
      };
      localStorage.setItem('recipe_draft', JSON.stringify(draftData));
    }
  }, [title, description, cuisine, category, imageUrl, portions, prepTime, cookTime, difficulty, ingredients, steps, editId]);

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveIngredientSearch(null);
      setActiveUnitSearch(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, isStep: boolean = false, stepIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB limit for original file, it will be compressed anyway
    if (file.size > 10 * 1024 * 1024) {
      setError('Файл слишком большой. Пожалуйста, выберите изображение до 10 МБ.');
      return;
    }

    if (isStep && stepIndex !== undefined) {
      setStepUploadingIndex(stepIndex);
    } else {
      setIsUploading(true);
    }
    setError(null);

    try {
      console.log("Converting image to optimized Base64...");
      // Compress the image and get Base64 string
      const base64 = await compressImage(file);
      console.log("Optimization finished. String length:", base64.length);
      
      callback(base64);
      
      if (isStep) setStepUploadingIndex(null);
      else setIsUploading(false);
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
    } catch (err) {
      console.error("Process Error:", err);
      setError('Ошибка при обработке изображения.');
      if (isStep) setStepUploadingIndex(null);
      else setIsUploading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0, unit: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: keyof Omit<Ingredient, 'id'>, value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, { order: steps.length + 1, description: '', imageUrl: '' }]);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i + 1 }));
    setSteps(newSteps);
  };

  const handleStepChange = (index: number, field: keyof Omit<RecipeStep, 'id'>, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (steps.length < 3) {
      setError('Для создания рецепта необходимо заполнить минимум 3 шага');
      setIsSubmitting(false);
      return;
    }

    try {
      const recipeData = {
        title,
        description,
        cuisine,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop',
        prepTime,
        cookTime,
        difficulty,
        spiciness,
        portions,
        ingredients: ingredients.map((ing, i) => ({ ...ing, id: `ing_${Date.now()}_${i}` })),
        steps: steps.map((step, i) => ({ ...step, id: `step_${Date.now()}_${i}` })),
        nutritionalInfo,
        authorId: currentUser!.id,
      };

      if (editId) {
        await updateRecipe(editId, recipeData, currentUser?.role === 'admin');
      } else {
        await addRecipe(recipeData);
      }
      
      if (!editId) localStorage.removeItem('recipe_draft');
      navigate(editId ? `/recipe/${editId}` : '/');
    } catch (err) {
      console.error("Submission error details:", err);
      setError(`Ошибка при отправке: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-12 text-text-primary">
        {editId ? 'Редактировать рецепт' : 'Отправить рецепт'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Area */}
        <div className="bg-bg-surface border-2 border-dashed border-border-color rounded-2xl p-12 flex flex-col items-center justify-center text-center group hover:border-primary transition-colors cursor-pointer relative overflow-hidden aspect-video">
          {imageUrl ? (
            <div className="absolute inset-0">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  type="button" 
                  onClick={() => setImageUrl('')}
                  className="bg-white p-2 rounded-full text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-bg-surface-light rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-1">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-[10px] font-bold text-primary">{uploadProgress}%</span>
                  </div>
                ) : (
                  <Camera className="w-8 h-8 text-text-muted group-hover:text-primary" />
                )}
              </div>
              <p className="text-text-muted mb-4">Выберите изображение на вашем устройстве или перетащите его в эту область</p>
              <label className={cn(
                "bg-primary text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors cursor-pointer",
                isUploading && "opacity-50 cursor-not-allowed"
              )}>
                {isUploading ? `Загрузка ${uploadProgress}%...` : 'Загрузить обложку рецепта'}
                <Plus className="w-5 h-5" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={isUploading}
                  onChange={(e) => handleFileUpload(e, setImageUrl)}
                />
              </label>
              <p className="text-xs text-text-muted mt-4">Пожалуйста, используйте только свои авторские фотографии. Допустимые форматы фотографий для загрузки: JPEG, JPG, PNG.</p>
            </>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-bg-surface rounded-2xl border border-border-color p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">Название рецепта *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Торт «Наполеон»"
              className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-muted"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">Описание рецепта *</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Расскажите, почему вы выбрали этот рецепт, каким будет готовое блюдо?"
              className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px] placeholder:text-text-muted"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Национальная кухня</label>
              <input 
                type="text" 
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="Например: русская или итальянская"
                className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Категория *</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-bg-surface">{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-bg-surface rounded-2xl border border-border-color p-8 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-tight">Параметры блюда</h3>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-primary">Порции *</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setPortions(Math.max(1, portions - 1))}
                  className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center hover:bg-bg-surface-light text-text-muted"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-bold w-8 text-center text-text-primary">{portions}</span>
                <button 
                  type="button"
                  onClick={() => setPortions(portions + 1)}
                  className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center hover:bg-bg-surface-light text-text-muted"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-primary">Острота</label>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((pepper) => (
                  <button
                    key={pepper}
                    type="button"
                    onClick={() => setSpiciness(pepper as 1 | 2 | 3 | 4 | 5)}
                    className={cn(
                      "text-2xl transition-all",
                      pepper <= spiciness ? "scale-110 opacity-100" : "scale-100 opacity-30 grayscale"
                    )}
                  >
                    🌶️
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border-color">
              <label className="block text-sm font-bold text-text-primary mb-4">Пищевая ценность (на 1 порцию)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Калории (ккал)</label>
                  <input 
                    type="number" 
                    value={nutritionalInfo.calories}
                    onChange={(e) => setNutritionalInfo({ ...nutritionalInfo, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Белки (г)</label>
                  <input 
                    type="number" 
                    value={nutritionalInfo.protein}
                    onChange={(e) => setNutritionalInfo({ ...nutritionalInfo, protein: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Жиры (г)</label>
                  <input 
                    type="number" 
                    value={nutritionalInfo.fat}
                    onChange={(e) => setNutritionalInfo({ ...nutritionalInfo, fat: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Углеводы (г)</label>
                  <input 
                    type="number" 
                    value={nutritionalInfo.carbs}
                    onChange={(e) => setNutritionalInfo({ ...nutritionalInfo, carbs: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-4">Время на кухне *</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="number" 
                      value={prepTime}
                      onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">минут</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-4">Время приготовления *</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="number" 
                      value={cookTime}
                      onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">минут</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients * /}
        <div className="bg-bg-surface rounded-2xl border border-border-color p-4 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-tight">Ингредиенты *</h3>
          <div className="space-y-4">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start relative p-4 sm:p-0 bg-bg-surface-light sm:bg-transparent rounded-xl border border-border-color sm:border-0">
                <div className="w-full sm:flex-1 relative" onClick={(e) => e.stopPropagation()}>
                  <label className="block sm:hidden text-[10px] font-bold text-text-muted uppercase mb-1">Название</label>
                  <input 
                    type="text" 
                    value={ing.name}
                    onChange={(e) => {
                      handleIngredientChange(index, 'name', e.target.value);
                      setActiveIngredientSearch(index);
                      setActiveUnitSearch(null);
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setActiveIngredientSearch(index);
                      setActiveUnitSearch(null);
                    }}
                    placeholder="Например: курица"
                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-muted"
                  />
                  {activeIngredientSearch === index && ing.name.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-bg-surface border border-border-color rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {COMMON_INGREDIENTS.filter(i => i.toLowerCase().includes(ing.name.toLowerCase())).map(match => (
                        <button
                          key={match}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIngredientChange(index, 'name', match);
                            setActiveIngredientSearch(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-bg-surface-light text-sm text-text-primary"
                        >
                          {match}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-24">
                    <label className="block sm:hidden text-[10px] font-bold text-text-muted uppercase mb-1">Кол-во</label>
                    <input 
                      type="number" 
                      value={ing.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Кол-во"
                      className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-muted"
                    />
                  </div>
                  <div className="flex-1 sm:w-32 relative" onClick={(e) => e.stopPropagation()}>
                    <label className="block sm:hidden text-[10px] font-bold text-text-muted uppercase mb-1">Ед. изм.</label>
                    <input 
                      type="text" 
                      value={ing.unit}
                      onChange={(e) => {
                        handleIngredientChange(index, 'unit', e.target.value);
                        setActiveUnitSearch(index);
                        setActiveIngredientSearch(null);
                      }}
                      onFocus={(e) => {
                        e.stopPropagation();
                        setActiveUnitSearch(index);
                        setActiveIngredientSearch(null);
                      }}
                      placeholder="Ед. изм."
                      className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-muted"
                    />
                    {activeUnitSearch === index && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-bg-surface border border-border-color rounded-xl shadow-xl max-h-48 overflow-y-auto">
                        {COMMON_UNITS.filter(u => u.toLowerCase().includes(ing.unit.toLowerCase())).map(match => (
                          <button
                            key={match}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIngredientChange(index, 'unit', match);
                              setActiveUnitSearch(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-bg-surface-light text-sm text-text-primary"
                          >
                            {match}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="sm:hidden p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="hidden sm:block p-3 text-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={handleAddIngredient}
              className="mt-4 w-full sm:w-auto bg-primary text-black px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors"
            >
              Добавить ингредиент
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight">Как приготовить / Пошаговая инструкция *</h3>
          </div>
          
          <div className="bg-green-900/20 border border-green-900/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-green-400 text-sm">
              <AlertCircle className="w-5 h-5" />
              Для создания рецепта необходимо заполнить минимум 3 шага
            </div>
            <button type="button" className="text-green-400 hover:text-green-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="bg-bg-surface rounded-2xl border border-border-color p-8 shadow-sm relative group">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">Шаг №{step.order}</h4>
                  {steps.length > 3 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-6">
                  <label className={cn(
                    "w-full aspect-video rounded-xl border-2 border-dashed border-border-color flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors overflow-hidden relative cursor-pointer",
                    step.imageUrl && "border-none",
                    stepUploadingIndex === index && "opacity-50 cursor-not-allowed"
                  )}>
                    {step.imageUrl ? (
                      <div className="absolute inset-0">
                        <img src={step.imageUrl} alt={`Step ${step.order}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleStepChange(index, 'imageUrl', '');
                            }}
                            className="bg-white p-2 rounded-full text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {stepUploadingIndex === index ? (
                          <div className="flex flex-col items-center gap-1">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            <span className="text-[10px] font-bold text-primary">{uploadProgress}%</span>
                          </div>
                        ) : (
                          <Camera className="w-6 h-6 text-text-muted" />
                        )}
                        <span className="text-sm text-text-muted font-medium text-center">
                          {stepUploadingIndex === index ? 'Загрузка...' : 'Загрузить фото'}
                        </span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={stepUploadingIndex === index}
                      onChange={(e) => handleFileUpload(e, (url) => handleStepChange(index, 'imageUrl', url), true, index)}
                    />
                  </label>
                  
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Описание шага</label>
                    <textarea 
                      value={step.description}
                      onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                      placeholder="Например: «Почистите овощи, вскипятите воду»"
                      className="w-full px-4 py-3 rounded-xl border border-border-color bg-bg-surface-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px] placeholder:text-text-muted"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={handleAddStep}
            className="w-full bg-bg-surface border border-border-color text-text-primary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-bg-surface-light transition-colors"
          >
            Добавить шаг
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-8 border-t border-border-color">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
          <button 
            type="submit"
            disabled={isSubmitting || isUploading || stepUploadingIndex !== null}
            className="w-full bg-primary text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? 'Отправка...' : (isUploading || stepUploadingIndex !== null) ? `Загрузка ${uploadProgress}%...` : (editId ? 'Сохранить изменения' : 'Отправить рецепт')}
          </button>
        </div>
      </form>
    </div>
  );
}
