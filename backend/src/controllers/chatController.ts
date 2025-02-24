import { Request, Response } from 'express';
import OpenAI from 'openai';

export const products = [
    {
      id: 1,
      name: 'PC Gamer',
      description: 'Una potente PC para juegos con tarjeta gráfica de última generación.',
      price: 1200,
      available: true,
    },
    {
      id: 2,
      name: 'Laptop Ultrabook',
      description: 'Una laptop ligera y potente para profesionales en movimiento.',
      price: 900,
      available: false,
    },
    {
      id: 3,
      name: 'Teclado Mecánico',
      description: 'Teclado mecánico con retroiluminación RGB.',
      price: 100,
      available: true,
    },
    {
      id: 4,
      name: 'Servicio de Reparación',
      description: 'Servicio de reparación y mantenimiento de computadoras.',
      price: 50,
      available: true,
    },
  ];
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '<DeepSeek API Key>',
});

export const chatController = {
  chat: async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'El mensaje es requerido.' });
      }

      // Crea una descripción de los productos para el prompt
      const productDescriptions = products.map(product => {
        return `${product.name}: ${product.description}, Precio: $${product.price}, Disponible: ${product.available ? 'Sí' : 'No'}`;
      }).join('\n');

      // Lógica de DeepSeek adaptada para tu chatbot
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `
              Eres un asistente virtual de la empresa "Tech Solutions".
              Esta empresa vende computadoras de escritorio, laptops y periféricos,
              además de ofrecer servicios de reparación y mantenimiento.
              Aquí tienes la lista de productos y servicios disponibles:
              ${productDescriptions}
              Si te preguntan sobre precios, disponibilidad o servicios, responde con la información anterior.
              Si el usuario pregunta algo fuera de estos temas, debes responder:
              "Lo siento, solo proporciono información sobre Tech Solutions, sus productos y sus servicios de reparación."
            `
          },
          { role: 'user', content: message },
        ],
      });

      const responseText = completion.choices[0].message?.content || '';
      res.json({ response: responseText.trim() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
  },
};