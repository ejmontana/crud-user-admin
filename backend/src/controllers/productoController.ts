import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ProductoDetalle } from '../types/producto';
import path from 'path';
import fs from 'fs';

export const productoController = {
  
  async createProducto(req: Request, res: Response) {
    try {
      const { Nombre, Descripcion, Precio, Stock }: ProductoDetalle = req.body;
      const Imagen = req.file ? `/uploads/${req.file.filename}` : null;

      if (!Nombre || !Precio || Stock === undefined) {
        return res.status(400).json({ message: 'Todos los campos requeridos deben estar presentes', status: 400 });
      }

      const result = await pool.request()
        .input('Nombre', Nombre)
        .input('Descripcion', Descripcion)
        .input('Precio', Precio)
        .input('Stock', Stock)
        .input('Imagen', Imagen)
        .query(`
          INSERT INTO Productos (Nombre, Descripcion, Precio, Stock, Imagen)
          VALUES (@Nombre, @Descripcion, @Precio, @Stock, @Imagen);
        `);

      return res.status(201).json({ message: 'Producto creado exitosamente', status: 201 });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error creando producto', error, status: 500 });
    }
  },

  async getAllProductos(req: Request, res: Response) {
    try {
      const result = await pool.request().query('SELECT * FROM Productos');
      res.json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching productos', error: error.message });
    }
  },

  async getProductoById(req: Request, res: Response) {
    try {
      const result = await pool.request()
        .input('id', req.params.id)
        .query('SELECT * FROM Productos WHERE ProductoID = @id');

      if (!result.recordset[0]) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      res.json(result.recordset[0]);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching producto', error });
    }
  },

  async updateProducto(req: Request, res: Response) {
    try {
      const { Nombre, Descripcion, Precio, Stock }: ProductoDetalle = req.body;
      const Imagen = req.file ? `/uploads/${req.file.filename}` : null;

      let query = `
        UPDATE Productos 
        SET 
          Nombre = @Nombre,
          Descripcion = @Descripcion,
          Precio = @Precio,
          Stock = @Stock
      `;

      const request = pool.request()
        .input('ProductoID', req.params.id)
        .input('Nombre', Nombre)
        .input('Descripcion', Descripcion)
        .input('Precio', Precio)
        .input('Stock', Stock);

      if (Imagen) {
        query += `, Imagen = @Imagen`;
        request.input('Imagen', Imagen);
      }

      query += ` WHERE ProductoID = @ProductoID`;

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      return res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error actualizando producto', error, status: 500 });
    }
  },

  async deleteProducto(req: Request, res: Response) {
    try {
      const result = await pool.request()
        .input('id', req.params.id)
        .query('DELETE FROM Productos WHERE ProductoID = @id');

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al eliminar producto', error });
    }
  }
};