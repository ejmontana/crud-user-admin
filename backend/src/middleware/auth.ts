import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

interface TokenPayload {
  userWithoutPassword: {
    Email: string;
    EstadoID: number;
    FechaCreacion: string;
    FechaModificacion: string | null;
    NombreCompleto: string;
    RoleID: number;
    Telefono: number;
    UserID: number;
    Usuario: string;
    UsuarioCreaID: number;
    UsuarioModificaID: number | null;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.user = decoded;

    const result = await pool.request()
    .input('userId', req.user?.userWithoutPassword.UserID)
    .query('SELECT TOP 1  EstadoID FROM Usuarios WHERE UserID = @userId');
  
    const user = result.recordset[0];

    if (user.EstadoID !== 1) {
      return res.status(403).json({ message: 'El usuario no esta activo' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const result = await pool.request()
  .input('userId', req.user?.userWithoutPassword.UserID)
  .query('SELECT TOP 1  RoleID FROM Usuarios WHERE UserID = @userId');

  const user = result.recordset[0];

  if (user.RoleID !== 1) {
    return res.status(403).json({ message: 'El usuario no tiene permisos' });
  }
  next();
};