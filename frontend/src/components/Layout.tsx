import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Package, Users } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Mi Aplicación</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </button>
                <button
                  onClick={() => navigate('/productos')}
                  className="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Productos
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Panel Admin
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-600 dark:text-gray-300">
                Hola, {user?.name}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}