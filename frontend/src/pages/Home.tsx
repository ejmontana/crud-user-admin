
import { useState } from 'react';
import { Layout } from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import LocationFeatures from '../components/LocationFeatures';

export function Home() {
  const [sortBy, setSortBy] = useState('featured');

  const featuredProducts = [
    {
      id: 1,
      name: 'AMD Ryzen 9 5950X',
      price: 799.99,
      category: 'Procesadores',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=500',
    },
    {
      id: 2,
      name: 'Corsair Vengeance RGB Pro 32GB',
      price: 159.99,
      category: 'Memoria RAM',
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=500',
    },
    {
      id: 3,
      name: 'ASUS ROG Strix X570-E',
      price: 329.99,
      category: 'Placas Madre',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500',
    },
  ];
  
  return (
    <Layout>
      <section className="pt-16 bg-gradient-to-r ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Tu Destino Tecnológico
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Descubre los mejores componentes y equipos para tu setup gaming y profesional
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Ver Productos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <LocationFeatures />
      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Productos Destacados</h2>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>Filtrar</span>
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="featured">Destacados</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Support Banner */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Soporte Técnico Especializado</h2>
            <p className="mt-4 text-lg text-gray-300">
              Nuestro equipo de expertos está disponible 24/7 para ayudarte con cualquier consulta
            </p>
            <button className="mt-8 bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contactar Soporte
            </button>
          </div>
        </div>
      </section>

      <Chatbot />
    </Layout>
  );
}