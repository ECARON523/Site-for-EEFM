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
const CalorieCalculator = lazy(() => import('./pages/CalorieCalculator'));
const WeeklyMenu = lazy(() => import('./pages/WeeklyMenu'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const AllRecipes = lazy(() => import('./pages/AllRecipes'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
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
      { path: 'services/calories', element: <CalorieCalculator /> },
      { path: 'services/weekly-menu', element: <WeeklyMenu /> },
      { path: 'ai', element: <AIAssistantPage /> },
      { path: 'about/contact', element: <ContactPage /> },
      { path: 'about/privacy', element: <PrivacyPolicyPage /> },
      { path: 'about/terms', element: <TermsOfServicePage /> },
      { path: 'about/articles', element: <Articles /> },
      { path: 'about/articles/:id', element: <ArticleDetail /> },
    ],
  },
];
