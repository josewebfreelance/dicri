# DICRI Evidence Management System

## Requisitos
- Docker & Docker Compose
- Node.js (opcional, para desarrollo local)

## Instrucciones de Ejecución

1.  **Clonar el repositorio** (si aplica).
2.  **Ejecutar con Docker Compose**:
    ```bash
    docker-compose up --build
    ```
3.  **Acceder a la aplicación**:
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend API: [http://localhost:3000](http://localhost:3000)
    - Swagger Docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Credenciales por Defecto
- **Coordinador**:
    - Usuario: `admin`
    - Contraseña: `123456` (Hash en BD)
- **Técnico**:
    - Usuario: `tecnico1`
    - Contraseña: `123456` (Hash en BD)

## Estructura del Proyecto
- `/backend`: Código fuente del API.
- `/frontend`: Código fuente de la aplicación Web.
- `/database`: Scripts de inicialización de base de datos.
# dicri
