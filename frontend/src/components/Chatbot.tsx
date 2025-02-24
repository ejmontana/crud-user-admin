import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

type Message = {
  sender: 'user' | 'bot';
  content: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', content: '¡Hola! ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const sendMessage = async (text: string) => {
    // Mensaje del usuario
    setMessages(prev => [...prev, { sender: 'user', content: text }]);
    setInputValue('');

    // Mensaje de carga
    const loadingMessage = { sender: 'bot', content: 'Procesando respuesta...' };
    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      // Ajusta la URL a tu nueva ruta que usa DeepSeek
      const response = await fetch('http://localhost:3030/api/chat/asistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();

      // Reemplaza el mensaje de carga con la respuesta real
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          sender: 'bot',
          content: data.response
        };
        return newMessages;
      });
    } catch (error) {
      console.log(error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          sender: 'bot',
          content: 'Error al obtener respuesta.'
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue.trim());
  };

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
        <div className="bg-[#2a303c] rounded-lg shadow-xl w-80 flex flex-col">
          <div className="p-4 bg-[#ff4757] text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2" />
              <span className="font-medium">Asistente Virtual</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-96 p-4 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-3 rounded-lg text-sm ${
                  msg.sender === 'bot'
                    ? 'bg-[#1a1f2b] text-gray-300'
                    : 'bg-[#ff4757] text-white self-end'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 p-2 border border-gray-700 rounded-l-lg focus:outline-none focus:border-[#ff4757] bg-[#1a1f2b] text-gray-300 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-[#ff4757] text-white px-4 rounded-r-lg hover:bg-[#ff6b81]"
                disabled={isLoading}
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;