
import { Layout } from '../components/Layout';

export function Home() {
  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Bienvenido a Mi Aplicación
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Esta es una aplicación de ejemplo con autenticación y roles de usuario.
          Explora las diferentes secciones según tu nivel de acceso.
        </p>
      </div>
    </Layout>
  );
}