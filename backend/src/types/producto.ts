export interface ProductoDetalle {
  ProductoID?: number;
  Nombre: string;
  Descripcion?: string;
  Precio: number;
  Stock: number;
  Imagen?: string;
  EstadoID?: number;
  UsuarioCreaID?: number;
  FechaModificacion?: Date;
  UsuarioModificaID?: number;
  FechaCreacion?: Date;
}