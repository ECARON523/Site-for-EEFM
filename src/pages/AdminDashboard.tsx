import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useRecipeStore } from '../store/useRecipeStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Eye, FileText, Users, Pencil, Maximize2, BarChart3, TrendingUp } from 'lucide-react';
import { AdminEditModal } from '../components/AdminEditModal';
import { RecipePreviewModal } from '../components/RecipePreviewModal';
import { Recipe } from '../types';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const { currentUser } = useAuthStore();
  const { users, updateUserRole } = useUserStore();
  const { recipes, updateRecipeStatus, updateRecipe } = useRecipeStore();
  const { addNotification } = useNotificationStore();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [previewingRecipe, setPreviewingRecipe] = useState<Recipe | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const pendingRecipes = recipes.filter(r => r.status === 'pending');
  const approvedRecipes = recipes.filter(r => r.status === 'approved');
  const rejectedRecipes = recipes.filter(r => r.status === 'rejected');
  
  const totalViews = recipes.reduce((acc, r) => acc + r.views, 0);

  const categoryData = Object.entries(recipes.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(([name, count]) => ({ name, count }));

  const growthData = recipes.slice(-10).map((r, i) => ({ name: `Р ${i+1}`, views: r.views }));

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-8 text-text-primary">Панель управления</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-bg-surface p-6 rounded-2xl border border-border-color shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text-primary">{totalViews}</div>
            <div className="text-sm text-text-muted uppercase tracking-wider">Просмотров</div>
          </div>
        </div>
        <div className="bg-bg-surface p-6 rounded-2xl border border-border-color shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-900/30 text-yellow-400 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text-primary">{pendingRecipes.length}</div>
            <div className="text-sm text-text-muted uppercase tracking-wider">Новых заявок</div>
          </div>
        </div>
        <div className="bg-bg-surface p-6 rounded-2xl border border-border-color shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text-primary">{approvedRecipes.length}</div>
            <div className="text-sm text-text-muted uppercase tracking-wider">Одобрено</div>
          </div>
        </div>
        <div className="bg-bg-surface p-6 rounded-2xl border border-border-color shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-text-primary">{rejectedRecipes.length}</div>
            <div className="text-sm text-text-muted uppercase tracking-wider">Отклонено</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-bg-surface p-6 rounded-2xl border border-border-color shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Популярность категорий
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Bar dataKey="count" fill="#EAB308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-bg-surface p-6 rounded-2xl border border-border-color shadow-sm">
          <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Просмотры последних рецептов
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Moderation Queue */}
      <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3 text-text-primary">
        <FileText className="w-6 h-6 text-primary" />
        Очередь модерации
      </h2>
      
      <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm overflow-hidden">
        {pendingRecipes.length > 0 ? (
          <ul className="divide-y divide-border-color">
            {pendingRecipes.map(recipe => {
              const author = users.find(u => u.id === recipe.authorId);
              return (
                <li key={recipe.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-bg-surface-light transition-colors">
                  {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="w-32 aspect-video object-cover rounded-xl" referrerPolicy="no-referrer" />}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">{recipe.title}</h3>
                    <p className="text-sm text-text-muted line-clamp-2 mb-2">{recipe.description}</p>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Users className="w-4 h-4" />
                      {author?.name || 'Неизвестный автор'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                    <button 
                      onClick={() => setPreviewingRecipe(recipe)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-bg-surface-light hover:bg-border-color text-text-primary rounded-full text-sm font-bold transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                      Просмотреть
                    </button>
                    <button 
                      onClick={() => setEditingRecipe(recipe)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded-full text-sm font-bold transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Редактировать
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          await updateRecipeStatus(recipe.id, 'approved');
                        } catch (err) {
                          console.error('Ошибка при одобрении рецепта', err);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-full text-sm font-bold transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Одобрить
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          await updateRecipeStatus(recipe.id, 'rejected');
                        } catch (err) {
                          console.error('Ошибка при отклонении рецепта', err);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-full text-sm font-bold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Отклонить
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-12 text-center text-text-muted">
            Очередь модерации пуста. Все рецепты проверены! 🎉
          </div>
        )}
      </div>

      {/* User Management */}
      <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-border-color flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Управление пользователями</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface-light text-text-muted text-sm">
                <th className="p-4 font-medium">Пользователь</th>
                <th className="p-4 font-medium">Роль</th>
                <th className="p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-bg-surface-light transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center text-xs font-bold text-text-muted border border-border-color">
                        {user.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span className="text-text-primary font-medium">{user.name || 'Без имени'}</span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                      user.role === 'admin' ? "bg-primary/20 text-primary" : "bg-bg-surface-light text-text-muted"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.id !== currentUser.id && (
                      <button
                        onClick={async () => {
                          try {
                            const newRole = user.role === 'admin' ? 'user' : 'admin';
                            await updateUserRole(user.id, newRole);
                          } catch (err) {
                            console.error('Ошибка при изменении роли', err);
                            addNotification('Не удалось изменить роль пользователя', 'error');
                          }
                        }}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {user.role === 'admin' ? 'Сделать пользователем' : 'Назначить админом'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingRecipe && (
        <AdminEditModal
          isOpen={!!editingRecipe}
          onClose={() => setEditingRecipe(null)}
          title="Редактировать рецепт"
          fields={[
            { name: 'title', label: 'Название', type: 'text', value: editingRecipe.title },
            { name: 'description', label: 'Описание', type: 'textarea', value: editingRecipe.description }
          ]}
          onSave={async (data) => {
            try {
              await updateRecipe(editingRecipe.id, data, true);
            } catch (err) {
              console.error('Ошибка при обновлении рецепта', err);
            }
          }}
        />
      )}

      {previewingRecipe && (
        <RecipePreviewModal
          isOpen={!!previewingRecipe}
          onClose={() => setPreviewingRecipe(null)}
          recipe={previewingRecipe}
        />
      )}
    </div>
  );
}
