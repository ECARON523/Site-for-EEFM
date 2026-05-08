import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Mail, Lock, User as UserIcon, Github } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Login() {
  const { loginWithGoogle, loginWithGithub, loginWithApple, loginWithEmail, registerWithEmail, isLoggingIn } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setError('');

    try {
      if (isLoginMode) {
        await loginWithEmail(email, password);
        addNotification('Вы успешно вошли!', 'success');
      } else {
        if (!name.trim()) throw new Error('Пожалуйста, введите ваше имя');
        if (password.length < 6) throw new Error('Пароль должен быть не менее 6 символов');
        await registerWithEmail(email, password, name);
        addNotification('Регистрация прошла успешно!', 'success');
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Пожалуйста, введите ваше имя' || err.message === 'Пароль должен быть не менее 6 символов') {
        setError(err.message);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Неверный email или пароль');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Пользователь с таким email уже существует');
      } else {
        setError('Произошла ошибка. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const handleProviderLogin = async (providerFn: () => Promise<void>, providerName: string) => {
    if (isLoggingIn) return;
    try {
      setError('');
      await providerFn();
      navigate('/');
    } catch (err: any) {
      if (err.code !== 'auth/cancelled-popup-request' && err.code !== 'auth/popup-closed-by-user') {
        if (err.code === 'auth/account-exists-with-different-credential') {
          setError(`Аккаунт с таким email уже привязан к другому сервису. Выберите правильный способ входа.`);
        } else {
          setError(`Не удалось войти через ${providerName}.`);
        }
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-bg-surface p-8 rounded-3xl shadow-xl border border-border-color w-full max-w-md">
        
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="bg-primary text-black font-black text-3xl leading-none p-3 rounded-xl inline-flex flex-col items-center justify-center w-16 h-16 mb-4 shadow-lg shadow-primary/20">
            <span>CI</span>
            <span>VS</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
            {isLoginMode ? 'С возвращением' : 'Создать аккаунт'}
          </h1>
        </div>

        {/* Переключатель Вход/Регистрация */}
        <div className="flex bg-bg-surface-light p-1 rounded-xl mb-8 border border-border-color">
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setError(''); }}
            className={cn(
              "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
              isLoginMode ? "bg-bg-surface text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
            )}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setError(''); }}
            className={cn(
              "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
              !isLoginMode ? "bg-bg-surface text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
            )}
          >
            Регистрация
          </button>
        </div>

        {/* Вывод ошибок */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Форма Email/Пароль */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {!isLoginMode && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full bg-bg-surface-light border border-border-color text-text-primary rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block pl-11 p-3.5 outline-none transition-all"
                required={!isLoginMode}
              />
            </div>
          )}
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-bg-surface-light border border-border-color text-text-primary rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block pl-11 p-3.5 outline-none transition-all"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full bg-bg-surface-light border border-border-color text-text-primary rounded-xl focus:ring-2 focus:ring-primary focus:border-primary block pl-11 p-3.5 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary-hover text-black font-black py-4 rounded-xl transition-transform active:scale-[0.98] mt-2 shadow-lg shadow-primary/20 flex items-center justify-center uppercase tracking-widest text-sm"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              isLoginMode ? 'Войти' : 'Создать аккаунт'
            )}
          </button>
        </form>

        {/* Разделитель */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-color"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-bg-surface text-text-muted font-medium uppercase tracking-wider text-[10px]">
              Или войти через
            </span>
          </div>
        </div>

        {/* Социальные сети (3 в ряд) */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* Google */}
          <button
            type="button"
            onClick={() => handleProviderLogin(loginWithGoogle, 'Google')}
            disabled={isLoggingIn}
            className="flex items-center justify-center py-3 bg-bg-surface-light hover:bg-white border border-border-color hover:border-gray-200 rounded-xl transition-all group"
            title="Войти через Google"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleProviderLogin(loginWithGithub, 'GitHub')}
            disabled={isLoggingIn}
            className="flex items-center justify-center py-3 bg-[#24292F] hover:bg-black border border-transparent rounded-xl transition-all group"
            title="Войти через GitHub"
          >
            <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleProviderLogin(loginWithApple, 'Apple')}
            disabled={isLoggingIn}
            className="flex items-center justify-center py-3 bg-white hover:bg-gray-100 border border-transparent rounded-xl transition-all group"
            title="Войти через Apple"
          >
            <svg className="w-5 h-5 text-black group-hover:scale-110 transition-transform" viewBox="0 0 170 170" fill="currentColor">
              <path d="M110.84,18.06c-8.4,0-19.32,5.25-25.2,11.55c-5.25,5.67-9.66,14.49-8.19,23.31 c9.24,0.63,19.32-4.83,24.99-11.34C108.11,35.07,112.1,26.46,110.84,18.06z M131.63,124.95c-9.03,13.02-18.69,26.04-33.18,26.46 c-13.86,0.42-18.48-8.19-34.02-8.19c-15.54,0-20.79,7.77-33.6,8.4c-13.65,0.42-24.99-14.49-34.23-28.14 C-10.71,90.51,5.67,49.77,29.82,49.35c11.76-0.21,22.68,7.98,30.03,7.98c7.14,0,20.37-9.45,34.44-8.19 c11.55,0.63,22.05,5.67,28.77,14.91c-24.57,14.91-20.79,48.09,6.72,59.22C130.37,123.9,130.79,124.53,131.63,124.95z"/>
            </svg>
          </button>

        </div>

      </div>
    </div>
  );
}