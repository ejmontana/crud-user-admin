import { Request, Response } from 'express';
import { pool } from '../config/database';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UsuarioDetalle } from '../types/user';


export const userController = {
async register(req: Request, res: Response) {
  try {
    const {
      Usuario,
      NombreCompleto,
      Telefono,
      Email,
      PasswordHash,
      RoleID,
      EstadoID = 1,
      UsuarioCreaID,
      FechaModificacion,
      UsuarioModificaID
    }: UsuarioDetalle = req.body;

  
  if (!Usuario || !NombreCompleto || !Telefono || !Email || !PasswordHash || !RoleID) {
    return res.status(400).json({ message: 'Todos los campos requeridos deben estar presentes', status: 400 });
  }
 
  if (Usuario.length > 50) {
    return res.status(400).json({ message: 'El campo Usuario no debe exceder 50 caracteres', status: 400 });
  }
  if (NombreCompleto.length > 300) {
    return res.status(400).json({ message: 'El campo NombreCompleto no debe exceder 300 caracteres', status: 400 });
  }
  if (Email.length > 50) {
    return res.status(400).json({ message: 'El campo Email no debe exceder 50 caracteres', status: 400 });
  }
  if (PasswordHash.length > 30) {
    return res.status(400).json({ message: 'El campo Clave no debe exceder 256 caracteres', status: 400 });
  }

  if (PasswordHash.length < 5) {
    return res.status(400).json({ message: 'El campo Clave no debe ser menor a 5 caracteres', status: 400 });
  }
  if (Telefono.length > 15) {
    return res.status(400).json({ message: 'El campo Teléfono no debe exceder 15 numeros', status: 400 });
  }



  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({ message: 'Formato de Email inválido', status: 400 });
  }

  if (!/^\d{1,15}$/.test(Telefono.toString())) {
    return res.status(400).json({ message: 'Formato de Teléfono inválido', status: 400 });
  }

  const existingEmail = await pool.request()
    .input('Email', Email)
    .query('SELECT TOP 1 Email FROM Usuarios WHERE Email = @Email');

  if (existingEmail.recordset.length > 0) {
    return res.status(400).json({ message: 'El Email está en uso', status: 400 });
  }

  const existingUsuario = await pool.request()
    .input('Usuario', Usuario)
    .query('SELECT TOP 1 Usuario FROM Usuarios WHERE Usuario = @Usuario');

  if (existingUsuario.recordset.length > 0) {
    return res.status(400).json({ message: 'El Usuario está en uso', status: 400 });
  }

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
        INSERT INTO Usuarios (
          Usuario,
          NombreCompleto,
          Telefono,
          PasswordHash,
          Email,
          RoleID,
          EstadoID,
          FechaCreacion,
          UsuarioCreaID,
          FechaModificacion,
          UsuarioModificaID
        ) VALUES (
          @Usuario,
          @NombreCompleto,
          @Telefono,
          @PasswordHash,
          @Email,
          @RoleID,
          @EstadoID,
          @FechaCreacion,
          @UsuarioCreaID,
          @FechaModificacion,
          @UsuarioModificaID
        );
      `);

    return res.status(201).json({ message: 'User created successfully', status: 201 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error creating user', error, status: 500 });
  }
},

async login(req: Request, res: Response) {
  try {
    const { Email, PasswordHash: inputPassword } = req.body as { Email: string, PasswordHash: string };
    
    const result = await pool.request()
      .input('email', Email)
      .query('SELECT * FROM Usuarios WHERE Email = @email');
    const user = result.recordset[0] as UsuarioDetalle;

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', status: 401 });
    }

    if (user.EstadoID !== 1) {
      return res.status(403).json({ message: 'User is not active', status: 403 });
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
      const query = `
          SELECT 
              US.UserID, 
              US.Usuario, 
              US.NombreCompleto, 
              US.Telefono, 
              US.Email, 
              US.RoleID, 
              US.EstadoID, 
              RO.NombreRol, 
              ES.Descripcion AS EstadoDescripcion, 
              US.FechaCreacion, 
              COALESCE(US2.NombreCompleto, 'No asignado') AS CreadoPor, 
              COALESCE(US3.NombreCompleto, 'No asignado') AS ModificadoPor, 
              US.FechaModificacion
          FROM 
              Usuarios US
          LEFT JOIN 
              Roles RO ON US.RoleID = RO.RoleID 
          LEFT JOIN 
              Estado ES ON US.EstadoID = ES.EstadoID 
          LEFT JOIN 
              Usuarios US2 ON US2.UserID = US.UsuarioCreaID 
          LEFT JOIN 
              Usuarios US3 ON US3.UserID = US.UsuarioModificaID
      `;

  
      const result = await pool.request().query(query);

      res.json(result.recordset);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
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
    const {
      Usuario,
      NombreCompleto,
      Telefono,
      Email,
      PasswordHash,
      RoleID,
      EstadoID,
      UsuarioModificaID
    }: UsuarioDetalle = req.body;

    const existingEmail = await pool.request()
      .input('Email', Email)
      .input('UserID', req.params.id)
      .query('SELECT TOP 1 Email FROM Usuarios WHERE Email = @Email AND UserID != @UserID');

      if (existingEmail.recordset.length > 0) {
        return res.status(400).json({ message: 'El Email esta en uso', status: 400 });
      }
  
      if (!Usuario || !NombreCompleto || !Telefono || !Email || !RoleID) {
        return res.status(400).json({ message: 'Todos los campos requeridos deben estar presentes', status: 400 });
      }
      
      if (Usuario.length > 50) {
        return res.status(400).json({ message: 'El campo Usuario no debe exceder 50 caracteres', status: 400 });
      }
      if (NombreCompleto.length > 300) {
        return res.status(400).json({ message: 'El campo NombreCompleto no debe exceder 300 caracteres', status: 400 });
      }
      if (Email.length > 50) {
        return res.status(400).json({ message: 'El campo Email no debe exceder 50 caracteres', status: 400 });
      }
      if (PasswordHash.length > 30) {
        return res.status(400).json({ message: 'El campo Clave no debe exceder 256 caracteres', status: 400 });
      }
      if (PasswordHash && PasswordHash.length < 5) {
        return res.status(400).json({ message: 'El campo Clave no debe ser menor a 5 caracteres', status: 400 });
      }
      
      if (Telefono.length > 15) {
        return res.status(400).json({ message: 'El campo Teléfono no debe exceder 15 numeros', status: 400 });
      }
  
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: 'Formato de Email inválido', status: 400 });
      }
  
      if (!/^\d{1,15}$/.test(Telefono.toString())) {
        return res.status(400).json({ message: 'Formato de Teléfono inválido', status: 400 });
      }

   
    const existingUsuario = await pool.request()
      .input('Usuario', Usuario)
      .input('UserID', req.params.id)
      .query('SELECT TOP 1 Usuario FROM Usuarios WHERE Usuario = @Usuario AND UserID != @UserID');

    if (existingUsuario.recordset.length > 0) {
      return res.status(400).json({ message: 'El Usuario esta en uso', status: 400 });
    }

    let query = `
      UPDATE Usuarios 
      SET 
        Usuario = @Usuario,
        NombreCompleto = @NombreCompleto,
        Telefono = @Telefono,
        Email = @Email,
        RoleID = @RoleID,
        EstadoID = @EstadoID,
        FechaModificacion = @FechaModificacion,
        UsuarioModificaID = @UsuarioModificaID
    `;

    const request = pool.request()
      .input('UserID', req.params.id)
      .input('Usuario', Usuario)
      .input('NombreCompleto', NombreCompleto)
      .input('Telefono', Telefono)
      .input('Email', Email)
      .input('RoleID', RoleID)
      .input('EstadoID', EstadoID)
      .input('FechaModificacion', new Date())
      .input('UsuarioModificaID', UsuarioModificaID);

    if (PasswordHash) {
      const hashedPassword = crypto.createHash('sha256').update(PasswordHash).digest();
      query += `, PasswordHash = @PasswordHash`;
      request.input('PasswordHash', hashedPassword);
    }

    query += ` WHERE UserID = @UserID`;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating user', error, status: 500 });
  }
},

async deleteUser(req: Request, res: Response) {
  try {
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Usuarios WHERE UserID = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Usuarios no encontrado' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
}
};