-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DICRI_DB')
BEGIN
    CREATE DATABASE DICRI_DB;
END
GO

USE DICRI_DB;
GO

-- Create Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        FullName NVARCHAR(100) NOT NULL,
        Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Tecnico', 'Coordinador')),
        CreatedAt DATETIME DEFAULT GETDATE()
    );    
END
GO

-- Create Expedientes Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Expedientes')
BEGIN
    CREATE TABLE Expedientes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Codigo NVARCHAR(50) NOT NULL UNIQUE, -- e.g., EXP-2023-001
        Descripcion NVARCHAR(MAX),
        FechaRegistro DATETIME DEFAULT GETDATE(),
        UsuarioRegistraId INT NOT NULL,
        Estado NVARCHAR(20) DEFAULT 'Creado' CHECK (Estado IN ('Creado', 'En Revision', 'Aprobado', 'Rechazado')),
        JustificacionRechazo NVARCHAR(MAX) NULL,
        FOREIGN KEY (UsuarioRegistraId) REFERENCES Users(Id)
    );
END
GO

-- Create Indicios Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Indicios')
BEGIN
    CREATE TABLE Indicios (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ExpedienteId INT NOT NULL,
        Descripcion NVARCHAR(200) NOT NULL,
        Color NVARCHAR(50),
        Tamano NVARCHAR(50),
        Peso NVARCHAR(50),
        Ubicacion NVARCHAR(100),
        UsuarioRegistraId INT NOT NULL,
        FechaRegistro DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ExpedienteId) REFERENCES Expedientes(Id),
        FOREIGN KEY (UsuarioRegistraId) REFERENCES Users(Id)
    );
END
GO

-- Stored Procedures

-- SP: Login
CREATE OR ALTER PROCEDURE sp_Login
    @Username NVARCHAR(50)
AS
BEGIN
    SELECT Id, Username, PasswordHash, FullName, Role 
    FROM Users 
    WHERE Username = @Username;
END
GO

-- SP: Create Expediente
CREATE OR ALTER PROCEDURE sp_CreateExpediente
    @Codigo NVARCHAR(50),
    @Descripcion NVARCHAR(MAX),
    @UsuarioRegistraId INT
AS
BEGIN
    INSERT INTO Expedientes (Codigo, Descripcion, UsuarioRegistraId, Estado)
    VALUES (@Codigo, @Descripcion, @UsuarioRegistraId, 'Creado');
    
    SELECT SCOPE_IDENTITY() AS ExpedienteId;
END
GO

-- SP: Add Indicio
CREATE OR ALTER PROCEDURE sp_AddIndicio
    @ExpedienteId INT,
    @Descripcion NVARCHAR(200),
    @Color NVARCHAR(50),
    @Tamano NVARCHAR(50),
    @Peso NVARCHAR(50),
    @Ubicacion NVARCHAR(100),
    @UsuarioRegistraId INT
AS
BEGIN
    INSERT INTO Indicios (ExpedienteId, Descripcion, Color, Tamano, Peso, Ubicacion, UsuarioRegistraId)
    VALUES (@ExpedienteId, @Descripcion, @Color, @Tamano, @Peso, @Ubicacion, @UsuarioRegistraId);
    
    SELECT SCOPE_IDENTITY() AS IndicioId;
END
GO

-- SP: Get Expedientes (Filter by Status or Date if needed, for now generic list)
CREATE OR ALTER PROCEDURE sp_GetExpedientes
    @Estado NVARCHAR(20) = NULL,
    @FechaInicio DATETIME = NULL,
    @FechaFin DATETIME = NULL
AS
BEGIN
    SELECT e.Id, e.Codigo, e.Descripcion, e.FechaRegistro, e.Estado, e.JustificacionRechazo, u.FullName as Tecnico
    FROM Expedientes e
    JOIN Users u ON e.UsuarioRegistraId = u.Id
    WHERE (@Estado IS NULL OR e.Estado = @Estado)
    AND (@FechaInicio IS NULL OR e.FechaRegistro >= @FechaInicio)
    AND (@FechaFin IS NULL OR e.FechaRegistro <= @FechaFin)
    ORDER BY e.FechaRegistro DESC;
END
GO

-- SP: Get Expediente Details (with Indicios)
CREATE OR ALTER PROCEDURE sp_GetExpedienteDetails
    @ExpedienteId INT
AS
BEGIN
    SELECT * FROM Expedientes WHERE Id = @ExpedienteId;
    SELECT * FROM Indicios WHERE ExpedienteId = @ExpedienteId;
END
GO

-- SP: Update Expediente Status (Approve/Reject)
CREATE OR ALTER PROCEDURE sp_UpdateExpedienteStatus
    @ExpedienteId INT,
    @Estado NVARCHAR(20),
    @Justificacion NVARCHAR(MAX) = NULL
AS
BEGIN
    UPDATE Expedientes
    SET Estado = @Estado,
        JustificacionRechazo = @Justificacion
    WHERE Id = @ExpedienteId;
END
GO

-- Seed Data
IF NOT EXISTS (SELECT * FROM Users)
BEGIN
    INSERT INTO Users (Username, PasswordHash, FullName, Role) VALUES ('admin', '$2a$08$8jfEkQJ3XvU20VWfXHTW1.EmY4txBdfKsmP8hZPFzI0Snj084WlMa', 'Coordinador General', 'Coordinador'); -- Hash for '123456'
    INSERT INTO Users (Username, PasswordHash, FullName, Role) VALUES ('tecnico1', '$2a$08$8jfEkQJ3XvU20VWfXHTW1.EmY4txBdfKsmP8hZPFzI0Snj084WlMa', 'Juan Perez', 'Tecnico');
END
GO
