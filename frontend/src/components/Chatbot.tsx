import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#ff4757] text-white p-4 rounded-full shadow-lg hover:bg-[#ff6b81] transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      ) : (
        <div className="bg-[#2a303c] rounded-lg shadow-xl w-80">
          <div className="p-4 bg-[#ff4757] text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
              <span className="font-medium">Asistente Virtual</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-96 p-4 overflow-y-auto">
            <div className="bg-[#1a1f2b] rounded-lg p-3 mb-2 text-gray-300">
              ¡Hola! ¿En qué puedo ayudarte hoy?
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                className="flex-1 p-2 border border-gray-700 rounded-l-lg focus:outline-none focus:border-[#ff4757] bg-[#1a1f2b] text-gray-300 placeholder-gray-500"
              />
              <button className="bg-[#ff4757] text-white px-4 rounded-r-lg hover:bg-[#ff6b81]">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;