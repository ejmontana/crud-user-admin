export interface UsuarioDetalle {
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