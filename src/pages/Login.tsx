import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      if (err.code !== 'auth/cancelled-popup-request' && err.code !== 'auth/popup-closed-by-user') {
        setError('Не удалось войти через Google. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-bg-surface p-8 rounded-3xl shadow-sm border border-border-color w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary text-black font-black text-3xl leading-none p-3 rounded-xl inline-flex flex-col items-center justify-center w-16 h-16 mb-6">
            <span>CI</span>
            <span>VS</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">Вход в аккаунт</h1>
          <p className="text-text-muted mt-2 text-sm">Войдите, чтобы сохранять рецепты и делиться своими</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="w-full bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          {isLoggingIn ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span className="text-[15px]">{isLoggingIn ? 'Вход...' : 'Продолжить с Google'}</span>
        </button>
      </div>
    </div>
  );
}
