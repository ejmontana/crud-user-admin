# CRUD User Admin

Aplicación full stack de gestión de usuarios y productos, con autenticación JWT, carga de imágenes y un asistente conversacional basado en OpenAI.

El proyecto está dividido en dos paquetes independientes: una **API REST en Express + TypeScript** sobre SQL Server, y un **cliente React + Vite** con rutas protegidas y tema claro/oscuro.

---

## Stack

| Capa | Tecnologías |
|---|---|
| **Backend** | Node.js · Express 4 · TypeScript · SQL Server (`mssql`) |
| **Seguridad** | JWT (`jsonwebtoken`) · bcrypt · Helmet · CORS |
| **Archivos** | Multer (carga de imágenes de producto) |
| **IA** | OpenAI SDK (asistente conversacional) |
| **Frontend** | React · TypeScript · Vite · TailwindCSS · React Router |

---

## Funcionalidades

- **Autenticación con JWT** y contraseñas cifradas con bcrypt
- **CRUD de usuarios** con endpoints protegidos por middleware de autenticación
- **CRUD de productos** con carga de imágenes servidas de forma estática
- **Asistente con IA** para consultas sobre el catálogo
- **Rutas protegidas** en el cliente mediante `ProtectedRoute` y `AuthContext`
- **Panel de administración** y tema claro/oscuro persistente

---

## API

Todos los endpoints cuelgan de `/api`. Los marcados con 🔒 exigen un token JWT válido en la cabecera `Authorization`.

### Usuarios — `/api/users`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/` | Alta de usuario |
| `GET` | `/alluser` | 🔒 Listado de usuarios |
| `GET` | `/:id` | 🔒 Detalle de usuario |
| `PUT` | `/:id` | Actualización de usuario |
| `DELETE` | `/:id` | 🔒 Baja de usuario |

### Productos — `/api/productos`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/` | Alta de producto con imagen (`multipart/form-data`) |
| `GET` | `/` | Listado de productos |
| `GET` | `/:id` | 🔒 Detalle de producto |
| `DELETE` | `/:id` | 🔒 Baja de producto |

### Asistente — `/api/chat`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/asistente` | 🔒 Consulta al asistente conversacional |

Las imágenes subidas se sirven de forma estática desde `/uploads`.

---

## Puesta en marcha

### Requisitos

- Node.js 18+
- Una instancia de SQL Server

### Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `backend/`:

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_NAME=tu_base_de_datos
JWT_SECRET=una_clave_larga_y_aleatoria
OPENAI_API_KEY=sk-...
PORT=3030
```

Crea el esquema ejecutando [`backend/src/config/bd.sql`](backend/src/config/bd.sql) contra tu base de datos, y arranca en modo desarrollo:

```bash
npm run dev
```

La API queda escuchando en `http://localhost:3030`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Estructura

```
backend/
  src/
    config/      Conexión a SQL Server y esquema (bd.sql)
    controllers/ Lógica de usuarios, productos y chat
    middleware/  auth (JWT) y upload (Multer)
    routes/      Definición de endpoints
    types/       Contratos de dominio
frontend/
  src/
    components/  UI reutilizable y ProtectedRoute
    context/     AuthContext y ThemeContext
    pages/       Home, Login, Productos, Admin
    utils/       Cliente HTTP
```

---

## Compilación para producción

```bash
cd backend && npm run build && npm start
cd frontend && npm run build
```
