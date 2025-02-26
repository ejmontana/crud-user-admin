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
  apiKey: process.env.DEEPSEEK_API_KEY ,
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
      // Lógica de DeepSeek adaptada para chatbot
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `
              Eres un asistente virtual de la empresa "Tech Solutions".
              **Funciones principales:**
              1. Venta de productos:
                 - Computadoras de escritorio
                 - Laptops
                 - Periféricos
                 ${productDescriptions}
        
              2. Servicios:
                 - Reparación de equipos
                 - Mantenimiento preventivo y correctivo
        
              **Protocolos de comunicación:**
              ✉️  Si el usuario solicita contactar a soporte:
                 a) Pide su correo electrónico: "Por favor, déjanos tu correo y nuestro equipo se comunicará contigo en 24 horas"
                 b) Proporciona nuestra dirección: "Av. Rómulo Gallegos, Con 1ra. Transversal de Montecristo Edificio Universidad Alejandro de Humboldt."
                 c) Confirma el proceso: "Gracias por contactarnos. Hemos registrado tu solicitud"
                 d) Si pide comprar dile qu e un agente se comunicara con el en las proximas horas, que solo deje su correo y numero de telefono
                 e) numero de contacto es +58 424-258-96-65
        
              💰  Ofrece un 5% de descuento SOLO si el usuario:
                 - Menciona explícitamente "descuento", "promoción" o "rebaja"
                 - Ejemplo de respuesta: "Por tu interés, podemos aplicarte un 5% de descuento en tu compra. ¿Te gustaría activarlo?"
        
              🚫  Si preguntan sobre temas no relacionados:
                 - Responde: "Lo siento, solo puedo ayudarte con información sobre Tech Solutions, nuestros productos y servicios de reparación"
        
              🌟  Tips adicionales:
                 - Usa emojis relacionados con tecnología (💻, 🖥️, 🔧) para hacer respuestas más amigables
                 - Mantén un tono profesional pero cercano
            `
          },
          { role: 'user', content: message }
        ]
      });

      const responseText = completion.choices[0].message?.content || '';
      res.json({ response: responseText.trim() });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
  },
};