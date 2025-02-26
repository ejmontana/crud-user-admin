USE [UNITAREAS]
GO
/****** Object:  Table [dbo].[Clientes]    Script Date: 26/2/2025 6:07:05 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clientes](
	[UserID] [int] NOT NULL,
	[Direccion] [nvarchar](255) NULL,
	[RUC] [nvarchar](20) NULL,
	[FechaRegistro] [datetime] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificaID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Estado]    Script Date: 26/2/2025 6:07:06 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Estado](
	[EstadoID] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[EstadoID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Facturas]    Script Date: 26/2/2025 6:07:06 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Facturas](
	[FacturaID] [int] IDENTITY(1,1) NOT NULL,
	[ClienteID] [int] NOT NULL,
	[FechaEmision] [datetime] NULL,
	[FechaVencimiento] [datetime] NULL,
	[EstadoID] [int] NOT NULL,
	[Subtotal] [decimal](18, 2) NOT NULL,
	[Impuestos] [decimal](18, 2) NOT NULL,
	[Total] [decimal](18, 2) NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[UsuarioCreaID] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificaID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[FacturaID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Productos]    Script Date: 26/2/2025 6:07:06 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Productos](
	[ProductoID] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Descripcion] [nvarchar](500) NULL,
	[Precio] [decimal](18, 2) NOT NULL,
	[Stock] [int] NOT NULL,
	[EstadoID] [int] NOT NULL,
	[UsuarioCreaID] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificaID] [int] NULL,
	[FechaCreacion] [datetime] NULL,
	[ImagenURL] [varchar](255) NULL,
 CONSTRAINT [PK__Producto__A430AE837075FF86] PRIMARY KEY CLUSTERED 
(
	[ProductoID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 26/2/2025 6:07:06 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleID] [int] IDENTITY(1,1) NOT NULL,
	[NombreRol] [varchar](50) NOT NULL,
	[Descripcion] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Servicios]    Script Date: 26/2/2025 6:07:06 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Servicios](
	[ServicioID] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Descripcion] [nvarchar](500) NULL,
	[Precio] [decimal](18, 2) NOT NULL,
	[Duracion] [int] NULL,
	[EstadoID] [int] NOT NULL,
	[FechaCreacion] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ServicioID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 26/2/2025 6:07:06 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[Usuario] [nvarchar](50) NOT NULL,
	[NombreCompleto] [nvarchar](300) NOT NULL,
	[Telefono] [numeric](15, 0) NOT NULL,
	[PasswordHash] [nvarchar](200) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[RoleID] [int] NOT NULL,
	[EstadoID] [int] NOT NULL,
	[FechaCreacion] [datetime] NOT NULL,
	[UsuarioCreaID] [int] NULL,
	[FechaModificacion] [datetime] NULL,
	[UsuarioModificaID] [int] NULL,
 CONSTRAINT [PK__Usuarios__1788CCAC2ABC2A4C] PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ__Usuarios__6B0F5AE0A0698736] UNIQUE NONCLUSTERED 
(
	[Usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ__Usuarios__A9D10534029A4B52] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VentasDetalle]    Script Date: 26/2/2025 6:07:06 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VentasDetalle](
	[VentaDetalleID] [int] IDENTITY(1,1) NOT NULL,
	[FacturaID] [int] NOT NULL,
	[ProductoID] [int] NULL,
	[ServicioID] [int] NULL,
	[Cantidad] [int] NOT NULL,
	[PrecioUnitario] [decimal](18, 2) NOT NULL,
	[Subtotal]  AS ([Cantidad]*[PrecioUnitario]),
PRIMARY KEY CLUSTERED 
(
	[VentaDetalleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Clientes] ADD  DEFAULT (getdate()) FOR [FechaRegistro]
GO
ALTER TABLE [dbo].[Facturas] ADD  DEFAULT (getdate()) FOR [FechaEmision]
GO
ALTER TABLE [dbo].[Facturas] ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Productos] ADD  CONSTRAINT [DF__Productos__Stock__73BA3083]  DEFAULT ((0)) FOR [Stock]
GO
ALTER TABLE [dbo].[Productos] ADD  CONSTRAINT [DF__Productos__Fecha__74AE54BC]  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Servicios] ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Usuarios] ADD  CONSTRAINT [DF__Usuarios__FechaC__4F7CD00D]  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Clientes]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Usuarios] ([UserID])
GO
ALTER TABLE [dbo].[Clientes]  WITH CHECK ADD FOREIGN KEY([UsuarioModificaID])
REFERENCES [dbo].[Usuarios] ([UserID])
GO
ALTER TABLE [dbo].[Facturas]  WITH CHECK ADD FOREIGN KEY([ClienteID])
REFERENCES [dbo].[Clientes] ([UserID])
GO
ALTER TABLE [dbo].[Facturas]  WITH CHECK ADD FOREIGN KEY([EstadoID])
REFERENCES [dbo].[Estado] ([EstadoID])
GO
ALTER TABLE [dbo].[Facturas]  WITH CHECK ADD FOREIGN KEY([UsuarioCreaID])
REFERENCES [dbo].[Usuarios] ([UserID])
GO
ALTER TABLE [dbo].[Facturas]  WITH CHECK ADD FOREIGN KEY([UsuarioModificaID])
REFERENCES [dbo].[Usuarios] ([UserID])
GO
ALTER TABLE [dbo].[Productos]  WITH CHECK ADD  CONSTRAINT [FK__Productos__Estad__75A278F5] FOREIGN KEY([EstadoID])
REFERENCES [dbo].[Estado] ([EstadoID])
GO
ALTER TABLE [dbo].[Productos] CHECK CONSTRAINT [FK__Productos__Estad__75A278F5]
GO
ALTER TABLE [dbo].[Servicios]  WITH CHECK ADD FOREIGN KEY([EstadoID])
REFERENCES [dbo].[Estado] ([EstadoID])
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK__Usuarios__Estado__5165187F] FOREIGN KEY([EstadoID])
REFERENCES [dbo].[Estado] ([EstadoID])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK__Usuarios__Estado__5165187F]
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK__Usuarios__RoleID__5070F446] FOREIGN KEY([RoleID])
REFERENCES [dbo].[Roles] ([RoleID])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK__Usuarios__RoleID__5070F446]
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK__Usuarios__Usuari__52593CB8] FOREIGN KEY([UsuarioCreaID])
REFERENCES [dbo].[Usuarios] ([UserID])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK__Usuarios__Usuari__52593CB8]
GO
ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [FK__Usuarios__Usuari__534D60F1] FOREIGN KEY([UsuarioModificaID])
REFERENCES [dbo].[Usuarios] ([UserID])
GO
ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [FK__Usuarios__Usuari__534D60F1]
GO
ALTER TABLE [dbo].[VentasDetalle]  WITH CHECK ADD FOREIGN KEY([FacturaID])
REFERENCES [dbo].[Facturas] ([FacturaID])
GO
ALTER TABLE [dbo].[VentasDetalle]  WITH CHECK ADD  CONSTRAINT [FK__VentasDet__Produ__02084FDA] FOREIGN KEY([ProductoID])
REFERENCES [dbo].[Productos] ([ProductoID])
GO
ALTER TABLE [dbo].[VentasDetalle] CHECK CONSTRAINT [FK__VentasDet__Produ__02084FDA]
GO
ALTER TABLE [dbo].[VentasDetalle]  WITH CHECK ADD FOREIGN KEY([ServicioID])
REFERENCES [dbo].[Servicios] ([ServicioID])
GO
ALTER TABLE [dbo].[VentasDetalle]  WITH CHECK ADD CHECK  (([ProductoID] IS NOT NULL OR [ServicioID] IS NOT NULL))
GO
