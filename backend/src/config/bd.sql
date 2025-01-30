-- Tabla de Estados (Activo/Inactivo)
CREATE TABLE Estado (
    EstadoID INT PRIMARY KEY IDENTITY(1,1),
    Descripcion VARCHAR(50) NOT NULL
);

-- Tabla de Roles
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    NombreRol VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(255)
);

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    NombreUsuario VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARBINARY(256) NOT NULL,  -- Para almacenar el hash seguro
    Email VARCHAR(255) NOT NULL UNIQUE,
    RoleID INT NOT NULL,
    EstadoID INT NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    UsuarioCreaID INT NULL,
    FechaModificacion DATETIME NULL,
    UsuarioModificaID INT NULL,
    
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
    FOREIGN KEY (EstadoID) REFERENCES Estado(EstadoID),
    FOREIGN KEY (UsuarioCreaID) REFERENCES Usuarios(UserID),
    FOREIGN KEY (UsuarioModificaID) REFERENCES Usuarios(UserID)
);

-- Insertar estados básicos
INSERT INTO Estado (Descripcion) VALUES ('Activo'), ('Inactivo');

-- Insertar roles básicos
INSERT INTO Roles (NombreRol, Descripcion) 
VALUES ('Administrador', 'Acceso total al sistema'),
       ('Usuario', 'Usuario estándar del sistema');


-- Deshabilitar temporalmente las FKs para el usuario inicial
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"

INSERT INTO Usuarios (
    NombreUsuario,
    PasswordHash,
    Email,
    RoleID,
    EstadoID,
    FechaCreacion,
    UsuarioCreaID
)
VALUES (
    'admin',
    HASHBYTES('SHA2_256', 'tu_password_seguro'),  -- Ejemplo con SHA-256
    'admin@dominio.com',
    1,  -- ID de Administrador
    1,  -- Estado Activo
    GETDATE(),
    1   -- Auto-referencia (solo para el primer usuario)
);

-- Reactivar las FKs
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"