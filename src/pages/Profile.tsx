import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { useNotificationStore } from '../store/useNotificationStore';
import RecipeCard from '../components/RecipeCard';
import { Pencil, Save, X, Pin, Bookmark, Camera, Loader2, ListTodo, Trash2, CheckCircle2, Circle, Users } from 'lucide-react';
import { compressImage, cn } from '../lib/utils';
import { MOCK_USERS } from '../data/mockData';

export default function Profile() {
  const { id } = useParams();
  const { currentUser } = useAuthStore();
  const { users, toggleFollow, updateProfile } = useUserStore();
  const { recipes, fetchRecipesByAuthor } = useRecipeStore();
  const { removeFromShoppingList, toggleShoppingItem, clearShoppingList } = useShoppingListStore();
  const { addNotification } = useNotificationStore();

  const profileUser = users.find(u => u.id === id) || MOCK_USERS.find(u => u.id === id);
  const isOwnProfile = currentUser?.id === profileUser?.id;
  
  const [activeTab, setActiveTab] = useState<'recipes' | 'saved' | 'shopping' | 'following'>('recipes');
  
  useEffect(() => {
    setActiveTab('recipes');
    if (id) {
      fetchRecipesByAuthor(id);
    }
  }, [id, fetchRecipesByAuthor]);
  
  const userRecipes = useMemo(() => recipes.filter(r => 
    r.authorId === profileUser?.id && (isOwnProfile ? true : r.status === 'approved')
  ), [recipes, profileUser?.id, isOwnProfile]);
  const pinnedRecipes = useMemo(() => recipes.filter(r => profileUser?.pinnedRecipeIds?.includes(r.id)), [recipes, profileUser?.pinnedRecipeIds]);
  const savedRecipes = useMemo(() => recipes.filter(r => profileUser?.savedRecipeIds?.includes(r.id)), [recipes, profileUser?.savedRecipeIds]);
  const followedUsers = useMemo(() => users.filter(u => profileUser?.followingIds?.includes(u.id)), [users, profileUser?.followingIds]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profileUser?.name || '',
    avatar: profileUser?.avatar || '',
    bio: profileUser?.bio || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  if (!profileUser && !users.length) {
    return <div className="p-8 text-center text-text-muted flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      Загрузка профиля...
    </div>;
  }

  if (!profileUser) {
    return <div className="p-8 text-center text-text-muted">Пользователь не найден</div>;
  }

  const isFollowing = currentUser?.followingIds.includes(profileUser.id);

  const handleSave = () => {
    if (currentUser) {
      updateProfile(currentUser.id, editForm);
    }
    setIsEditing(false);
  };

  const exportShoppingList = () => {
    if (!profileUser?.shoppingList || profileUser.shoppingList.length === 0) return;
    
    const text = profileUser.shoppingList
      .map(item => `${item.name}: ${item.amount} ${item.unit} ${item.checked ? '(куплено)' : ''}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addNotification('Файл слишком большой. Пожалуйста, выберите изображение до 10 МБ.', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      // Aggressive compression for avatar to keep it small
      const base64 = await compressImage(file, 200, 200, 0.6);
      setEditForm({ ...editForm, avatar: base64 });
      setIsUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
    } catch (err) {
      console.error("Avatar processing error:", err);
      addNotification('Ошибка при обработке аватара', 'error');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="bg-bg-surface rounded-3xl p-4 sm:p-8 mb-8 sm:mb-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 border border-border-color shadow-sm">
        {isEditing ? (
          <div className="flex-1 w-full space-y-4">
            <input 
              value={editForm.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})}
              className="w-full p-2 border border-border-color rounded-lg bg-bg-surface-light text-text-primary"
              placeholder="Никнейм"
            />
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 p-2 border border-border-color rounded-lg bg-bg-surface-light hover:bg-bg-surface transition-colors">
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary"/>
                      <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <Camera className="w-5 h-5 text-text-muted"/>
                  )}
                  <span className="text-sm text-text-muted">
                    {isUploading ? 'Загрузка...' : 'Загрузить аватар'}
                  </span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                  disabled={isUploading}
                />
              </label>
              {editForm.avatar && (
                <img src={editForm.avatar} alt="Preview" className="w-10 h-10 rounded-full object-cover" />
              )}
            </div>
            <textarea 
              value={editForm.bio} 
              onChange={e => setEditForm({...editForm, bio: e.target.value})}
              className="w-full p-2 border border-border-color rounded-lg bg-bg-surface-light text-text-primary"
              placeholder="Информация о себе"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 sm:flex-none bg-primary px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-black"><Save className="w-4 h-4"/> Сохранить</button>
              <button onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none bg-bg-surface-light px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-text-primary"><X className="w-4 h-4"/> Отмена</button>
            </div>
          </div>
        ) : (
          <>
            {profileUser.avatar && (
              <img 
                src={profileUser.avatar} 
                alt={profileUser.name} 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-text-primary mb-2">{profileUser.name}</h1>
              <p className="text-sm sm:text-base text-text-muted mb-2">{profileUser.bio}</p>
              <p className="text-xs sm:text-sm text-text-muted mb-6">
                {profileUser.role === 'admin' ? 'Администратор' : 'Кулинарный автор'}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-text-primary">{userRecipes.length}</div>
                  <div className="text-[10px] sm:text-sm text-text-muted uppercase tracking-wider">Рецептов</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-text-primary">{profileUser.followersCount}</div>
                  <div className="text-[10px] sm:text-sm text-text-muted uppercase tracking-wider">Подписчиков</div>
                </div>
                {isOwnProfile && (
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-text-primary">{profileUser.followingIds?.length || 0}</div>
                    <div className="text-[10px] sm:text-sm text-text-muted uppercase tracking-wider">Подписок</div>
                  </div>
                )}
              </div>
            </div>
            {isOwnProfile && (
              <button onClick={() => setIsEditing(true)} className="bg-bg-surface-light p-3 rounded-full hover:bg-bg-surface text-text-primary transition-colors">
                <Pencil className="w-5 h-5"/>
              </button>
            )}
            {!isOwnProfile && currentUser && (
              <button 
                onClick={() => toggleFollow(currentUser.id, profileUser.id)}
                className={`w-full sm:w-auto px-8 py-3 rounded-full font-bold transition-colors ${
                  isFollowing 
                    ? 'bg-bg-surface-light text-text-primary hover:bg-bg-surface' 
                    : 'bg-primary text-black hover:bg-primary-hover'
                }`}
              >
                {isFollowing ? 'Отписаться' : 'Подписаться'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-4 sm:gap-8 border-b border-border-color mb-8 sm:mb-12 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('recipes')}
          className={cn(
            "pb-4 text-[10px] sm:text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
            activeTab === 'recipes' ? "text-text-primary" : "text-text-muted hover:text-text-primary"
          )}
        >
          Рецепты
          {activeTab === 'recipes' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
        </button>
        {isOwnProfile && (
          <>
            <button 
              onClick={() => setActiveTab('saved')}
              className={cn(
                "pb-4 text-[10px] sm:text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === 'saved' ? "text-text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              Сохраненное
              {activeTab === 'saved' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('shopping')}
              className={cn(
                "pb-4 text-[10px] sm:text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === 'shopping' ? "text-text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              Список покупок
              {activeTab === 'shopping' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('following')}
              className={cn(
                "pb-4 text-[10px] sm:text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === 'following' ? "text-text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              Подписки
              {activeTab === 'following' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'recipes' && (
        <>
          {/* Pinned Recipes */}
          {pinnedRecipes.length > 0 && (
            <>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-2"><Pin className="w-6 h-6"/> Закрепленные рецепты</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {pinnedRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} author={profileUser} />
                ))}
              </div>
            </>
          )}

          <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Рецепты автора</h2>
          {userRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {userRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} author={profileUser} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-bg-surface rounded-2xl text-text-muted mb-12">
              У этого автора пока нет опубликованных рецептов.
            </div>
          )}
        </>
      )}

      {activeTab === 'saved' && isOwnProfile && (
        <>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-primary fill-primary"/> Сохраненные рецепты
          </h2>
          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedRecipes.map(recipe => {
                const author = users.find(u => u.id === recipe.authorId);
                return author ? <RecipeCard key={recipe.id} recipe={recipe} author={author} /> : null;
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-bg-surface rounded-2xl text-text-muted">
              У вас пока нет сохраненных рецептов.
            </div>
          )}
        </>
      )}

      {activeTab === 'shopping' && isOwnProfile && (
        <>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <ListTodo className="w-6 h-6 text-primary"/> Список покупок
            </h2>
            <div className="flex gap-4">
              {profileUser.shoppingList && profileUser.shoppingList.length > 0 && (
                <button 
                  onClick={exportShoppingList}
                  className="text-primary font-bold text-sm hover:underline"
                >
                  Экспорт (.txt)
                </button>
              )}
              {profileUser.shoppingList && profileUser.shoppingList.length > 0 && (
                <button 
                  onClick={() => clearShoppingList(currentUser.id)}
                  className="text-red-500 font-bold text-sm hover:underline"
                >
                  Очистить список
                </button>
              )}
            </div>
          </div>

          {profileUser.shoppingList && profileUser.shoppingList.length > 0 ? (
            <div className="bg-bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden">
              {profileUser.shoppingList.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center justify-between p-4 border-b border-border-color last:border-0 transition-colors",
                    item.checked ? "bg-black/20" : "hover:bg-bg-surface-light"
                  )}
                >
                  <button 
                    onClick={() => toggleShoppingItem(currentUser.id, currentUser.shoppingList || [], item.id)}
                    className="flex items-center gap-4 flex-1 text-left"
                  >
                    {item.checked ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-text-muted" />
                    )}
                    <div className={cn(
                      "flex flex-col",
                      item.checked && "opacity-50"
                    )}>
                      <span className={cn("font-bold text-text-primary", item.checked && "line-through")}>
                        {item.name}
                      </span>
                      <span className="text-sm text-text-muted">
                        {item.amount} {item.unit}
                      </span>
                    </div>
                  </button>
                  <button 
                    onClick={() => removeFromShoppingList(currentUser.id, currentUser.shoppingList || [], item.id)}
                    className="p-2 text-text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-bg-surface rounded-3xl border border-dashed border-border-color">
              <ListTodo className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Ваш список пуст</h3>
              <p className="text-text-muted">Добавляйте ингредиенты из рецептов, чтобы ничего не забыть в магазине.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'following' && isOwnProfile && (
        <>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary"/> Мои подписки
          </h2>
          {followedUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {followedUsers.map(followedUser => (
                <Link 
                  key={followedUser.id} 
                  to={`/profile/${followedUser.id}`}
                  className="bg-bg-surface p-4 rounded-2xl border border-border-color flex items-center gap-4 hover:bg-bg-surface-light transition-colors group"
                >
                  {followedUser.avatar && (
                    <img 
                      src={followedUser.avatar} 
                      alt={followedUser.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-border-color group-hover:border-primary transition-colors" 
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-text-primary truncate">{followedUser.name}</div>
                    <div className="text-xs text-text-muted uppercase tracking-wider">{followedUser.followersCount} подп.</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-bg-surface rounded-2xl text-text-muted">
              Вы пока ни на кого не подписаны.
            </div>
          )}
        </>
      )}
    </div>
  );
}
