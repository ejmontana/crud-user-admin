import { Request, Response } from 'express';
import OpenAI from 'openai';
import { pool } from '../config/database';

interface Product {
  ProductoID: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Stock: number;
  EstadoID: number;
  UsuarioCreaID: number;
  FechaModificacion?: Date;
  UsuarioModificaID?: number;
  FechaCreacion: Date;
  ImagenURL: string;
}

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
      const result = await pool.request().query('SELECT * FROM Productos');
      const products: Product[] = result.recordset;

      const productDescriptions = products.map(product => {
        return `${product.Nombre}: ${product.Descripcion}, Precio: $${product.Precio}, Disponible: ${product.Stock > 0 ? 'Sí' : 'No'}`;
      }).join('\n');

      console.log(productDescriptions);
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