export interface User {
  UserID: number;
  Usuario: string;
  NombreCompleto: string;
  Telefono: string;
  PasswordHash: string;
  Email: string;
  RoleID: number;
  EstadoID: number;
  FechaCreacion: Date;
  UsuarioCreaID?: number;
  FechaModificacion?: Date;
  UsuarioModificaID?: number;
  RoleNombreRol: string;
  RoleDescripcion?: string;
  EstadoDescripcion: string;
}

export interface Product {
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

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    accentAlt: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}