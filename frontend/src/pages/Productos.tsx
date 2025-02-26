import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Product } from '../types';
import Chatbot from '../components/Chatbot';

export function Productos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3030/api/productos');
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Catálogo de Productos
        </h2>
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.ProductoID} className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-700 transition-colors">
                <img
                  src={product.ImagenURL}
                  alt={product.Nombre}
                  className="w-full h-48 object-cover"
                  crossOrigin='anonymous'
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.Nombre}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {product.Descripcion}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${product.Precio.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Stock: {product.Stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Chatbot />
    </Layout>
  );
}