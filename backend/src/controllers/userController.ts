import { Request, Response } from 'express';
import { pool } from '../config/database';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UsuarioDetalle } from '../types/user';
import { stat } from 'fs';
 

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { Usuario, NombreCompleto, Telefono, Email, PasswordHash, RoleID, EstadoID = 1, UsuarioCreaID, FechaModificacion, UsuarioModificaID }: UsuarioDetalle = req.body;
      
      const hashedPassword = crypto.createHash('sha256').update(PasswordHash).digest();
      
      const result = await pool.request()
        .input('Usuario', Usuario)
        .input('NombreCompleto', NombreCompleto)
        .input('Telefono', Telefono)
        .input('Email', Email)
        .input('PasswordHash', hashedPassword)
        .input('RoleID', RoleID)
        .input('EstadoID', EstadoID)
        .input('FechaCreacion', new Date())
        .input('UsuarioCreaID', UsuarioCreaID)
        .input('FechaModificacion', FechaModificacion)
        .input('UsuarioModificaID', UsuarioModificaID)
        .query(`
          INSERT INTO Usuarios (Usuario, NombreCompleto, Telefono, PasswordHash, Email, RoleID, EstadoID, FechaCreacion, UsuarioCreaID, FechaModificacion, UsuarioModificaID)
          VALUES (@Usuario, @NombreCompleto, @Telefono, @PasswordHash, @Email, @RoleID, @EstadoID, @FechaCreacion, @UsuarioCreaID, @FechaModificacion, @UsuarioModificaID); 
        `);

      res.status(201).json({ message: 'User created successfully', id: result.recordset[0].id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating user', error });
    }
},

async login(req: Request, res: Response) {
  try {
    const { Email, PasswordHash: inputPassword } = req.body as { Email: string, PasswordHash: string };
    
    const result = await pool.request()
      .input('email', Email)
      .query('SELECT * FROM Usuarios WHERE Email = @email');
    console.log(result.recordset[0])
    const user = result.recordset[0] as UsuarioDetalle;

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  
    const inputPasswordHash = crypto.createHash('sha256').update(inputPassword).digest('hex');
    const storedPasswordHash = Buffer.from(user.PasswordHash).toString('hex');

    if (inputPasswordHash !== storedPasswordHash) {
      return res.status(401).json({ message: 'Invalid credentials', status: 401 });
    }

    const { PasswordHash, ...userWithoutPassword } = user;

    const token = jwt.sign(
      { userWithoutPassword },
      process.env.JWT_SECRET!,
      { expiresIn: '12h' }
    );

    return res.json({ token, status: 200 });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error during login', error });
  }
},

  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await pool.request()
        .query('SELECT id, username, email, role, createdAt FROM Users');
      
      res.json(result.recordset);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const result = await pool.request()
        .input('id', req.params.id)
        .query('SELECT id, username, email, role, createdAt FROM Users WHERE id = @id');

      if (!result.recordset[0]) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(result.recordset[0]);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user', error });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { username, email } = req.body;
      
      const result = await pool.request()
        .input('id', req.params.id)
        .input('username', username)
        .input('email', email)
        .query(`
          UPDATE Users 
          SET username = @username, email = @email 
          WHERE id = @id
        `);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await pool.request()
        .input('id', req.params.id)
        .query('DELETE FROM Users WHERE id = @id');

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }
};