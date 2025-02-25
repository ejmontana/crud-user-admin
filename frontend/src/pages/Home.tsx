import { Layout } from '../components/Layout'; 
import Chatbot from '../components/Chatbot';
import LocationFeatures from '../components/LocationFeatures';

export function Home() {
 
  
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