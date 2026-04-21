import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-dark text-text-primary p-8 text-center">
          <div>
            <h1 className="text-4xl font-black mb-4">Что-то пошло не так</h1>
            <p className="text-text-muted mb-8">Мы уже работаем над исправлением. Попробуйте обновить страницу.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary px-6 py-3 rounded-full font-bold text-black hover:bg-primary-hover transition-colors"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
