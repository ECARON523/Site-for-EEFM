import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Navigate } from 'react-router-dom';
import { Users, Crown, ChefHat, User as UserIcon, ShieldAlert } from 'lucide-react';
import { Role } from '../types';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { currentUser } = useAuthStore();
  const { users, updateUserRole } = useUserStore();
  const { addNotification } = useNotificationStore();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const roleOptions: { value: Role; label: string; icon: any }[] = [
    { value: 'user', label: 'Обычный клиент', icon: UserIcon },
    { value: 'vip', label: 'VIP Клиент', icon: Crown },
    { value: 'kitchen', label: 'Кухня (Повар)', icon: ChefHat },
    { value: 'admin', label: 'Администратор', icon: ShieldAlert },
  ];

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await updateUserRole(userId, newRole);
      addNotification('Права доступа успешно изменены', 'success');
    } catch (err) {
      console.error('Ошибка при изменении роли', err);
      addNotification('Не удалось изменить права доступа', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-text-primary">Управление доступом</h1>
        <p className="text-text-muted mt-2">Назначайте роли пользователям для доступа к панели кухни или админке.</p>
      </div>

      <div className="bg-bg-surface rounded-2xl border border-border-color shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-color flex items-center gap-3 bg-bg-surface-light/50">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Пользователи системы</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface-light text-text-muted text-sm border-b border-border-color">
                <th className="p-4 font-medium w-1/2">Пользователь</th>
                <th className="p-4 font-medium w-1/2">Права доступа (Роль)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {users.map(user => {
                const currentRoleConfig = roleOptions.find(r => r.value === (user.role || 'user'));
                const Icon = currentRoleConfig?.icon || UserIcon;

                return (
                  <tr key={user.id} className="hover:bg-bg-surface-light/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-border-color" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-bg-surface-light flex items-center justify-center text-sm font-bold text-text-muted border border-border-color">
                          {user.name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <span className="text-text-primary font-medium block">{user.name || 'Без имени'}</span>
                        <span className="text-xs text-text-muted">ID: {user.id.slice(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          user.role === 'admin' ? "bg-red-500/20 text-red-500" :
                          user.role === 'vip' ? "bg-yellow-500/20 text-yellow-500" :
                          user.role === 'kitchen' ? "bg-blue-500/20 text-blue-500" :
                          "bg-bg-surface-light text-text-muted"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                          disabled={user.id === currentUser.id} // Нельзя изменить роль самому себе
                          className="bg-bg-surface border border-border-color text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {roleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}