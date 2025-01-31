import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.user = decoded;

    if (req.user.userWithoutPassword.EstadoID !== 1) {
      return res.status(403).json({ message: 'User is not active' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.userWithoutPassword.RoleID !== 1) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};