import { BrowserRouter, useRoutes } from 'react-router-dom';
import { useEffect, Suspense } from 'react';
import { routeConfig } from './routes';
import { useRecipeStore } from './store/useRecipeStore';
import { useUserStore } from './store/useUserStore';
import { useAuthStore } from './store/useAuthStore';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

function AppRoutes() {
  return useRoutes(routeConfig);
}

export default function App() {
  const fetchRecipes = useRecipeStore(state => state.fetchRecipes);
  const fetchUsers = useUserStore(state => state.fetchUsers);
  const recipesLoading = useRecipeStore(state => state.recipesLoading);
  const usersLoading = useUserStore(state => state.usersLoading);
  const recipesError = useRecipeStore(state => state.recipesError);
  const usersError = useUserStore(state => state.usersError);
  const isAuthReady = useAuthStore(state => state.isAuthReady);

  useEffect(() => {
    if (isAuthReady) {
      useRecipeStore.getState().fetchRecipes();
      useUserStore.getState().fetchUsers();
    }
  }, [isAuthReady]);

  if (!isAuthReady || recipesLoading || usersLoading) {
    return <div className="flex items-center justify-center h-screen text-white">Загрузка...</div>;
  }

  if (recipesError) {
    console.error("Recipes Error:", recipesError);
  }
  if (usersError) {
    console.error("Users Error:", usersError);
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="flex items-center justify-center h-screen text-white">Загрузка...</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
