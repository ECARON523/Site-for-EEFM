import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const RecipeCategory = lazy(() => import('./pages/RecipeCategory'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const SubmitRecipe = lazy(() => import('./pages/SubmitRecipe'));
const AllRecipes = lazy(() => import('./pages/AllRecipes'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Layout = lazy(() => import('./components/Layout'));

export const routeConfig: RouteObject[] = [
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'recipe/:id', element: <RecipeDetail /> },
      { path: 'recipes/all', element: <AllRecipes /> },
      { path: 'recipes/:categoryId', element: <RecipeCategory /> },
      { path: 'search', element: <SearchResults /> },
      { path: 'profile/:id', element: <Profile /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'submit', element: <SubmitRecipe /> },
    ],
  },
];