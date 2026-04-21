import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { ToastContainer } from './ToastContainer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <Header />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <Sidebar />
        <main className="flex-1 ml-0 lg:ml-8 pb-12">
          <Outlet />
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
