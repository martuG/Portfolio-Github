# Sistema Fullstack - Gestion de Tickets

Aplicacion fullstack de gestion de tickets construida con:
- **Backend**: Node.js + Express + MariaDB
- **Frontend**: React + React Router (Vite)
- **Autenticacion**: JWT
- **Arquitectura**: por capas (routes -> controllers -> services -> repositories)


---
## 1) Estructura del proyecto

```txt
Sistema-Fullstack/
  backend/
    sql/
    src/
      config/
      middlewares/
      modules/
        auth/
        users/
        tickets/
        dashboard/
      scripts/
      utils/
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      layouts/
      pages/
```

---

## 2) Modelo relacional

### Tabla `users`
- `id`
- `name`
- `email` (unique)
- `password_hash`
- `role` (`admin`, `agent`, `user`)

### Tabla `tickets`
- `id`
- `title`
- `description`
- `status` (`open`, `in_progress`, `closed`)
- `priority` (`low`, `medium`, `high`)
- `reporter_id` -> FK a `users.id`
- `assignee_id` -> FK a `users.id` (nullable)
- `created_at`, `updated_at`

Relaciones:
- Un usuario puede **reportar muchos tickets**
- Un usuario puede ser **asignado a muchos tickets**

---

## 3) Requisitos previos

- Node.js 18+ recomendado
- MariaDB 10.5+ (o compatible)

---

## 4) Configuracion backend

1. Entrar a `backend`:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` desde `.env.example`:

4. Inicializar DB y tablas:
```bash
npm run db:init
```

5. Insertar datos de prueba:
```bash
npm run db:seed
```

6. Levantar backend:
```bash
npm run dev
```

Backend: `http://localhost:4000`

---

## 5) Configuracion frontend

1. Entrar a `frontend`:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Levantar frontend:
```bash
npm run dev
```

Frontend: normalmente `http://localhost:5173`

---

## 6) Credenciales demo

Password para todas: `123456`

- Admin: `admin@demo.com`
- Agente: `agente@demo.com`
- Usuario: `usuario@demo.com`

---

## 7) API REST

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tickets (JWT + matriz de roles)
- `GET /api/tickets` (paginacion + filtros)
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `PUT /api/tickets/:id`
- `DELETE /api/tickets/:id` (admin y agente)

### Dashboard (JWT + staff)
- `GET /api/dashboard/stats`

### Users (JWT + staff)
- `GET /api/users/agents`

---

## 8) Filtros y paginacion de tickets

Endpoint:
`GET /api/tickets?page=1&limit=5&status=open&priority=high&search=login`

Parametros disponibles:
- `page`
- `limit`
- `status`
- `priority`
- `assigneeId`
- `search` (busca en titulo y descripcion)

---

## 9) Matriz de permisos por endpoint

La autorizacion de **acceso al endpoint** vive en una sola matriz (`backend/src/config/roleMatrix.ts` y `frontend/src/utils/permissions.js`). Cada ruta protegida usa el middleware `requirePermission(...)`.

| Endpoint | Permiso | admin | agent | user |
|---|---|---|---|---|
| `GET /api/tickets` | `tickets:list` | si | si | si |
| `GET /api/tickets/:id` | `tickets:read` | si | si | si |
| `POST /api/tickets` | `tickets:create` | si | si | si |
| `PUT /api/tickets/:id` | `tickets:update` | si | si | si |
| `DELETE /api/tickets/:id` | `tickets:delete` | si | si | no |
| `GET /api/dashboard/stats` | `dashboard:stats` | si | si | no |
| `GET /api/users/agents` | `users:listAgents` | si | si | no |

Notas:
- Auth (`/api/auth/login`, `/api/auth/register`) es publico (sin JWT).
- Un `user` autenticado puede listar/ver/editar **solo sus tickets** (filtro por `reporter_id` en el service).
- Admin y agente ven todos los tickets y pueden cambiar estado, prioridad y asignacion.
- Si el rol no esta habilitado en la matriz, la API responde **403**.

## 10) Manejo de errores

- Validaciones backend con `express-validator` (422)
- Errores de autenticacion/autorizacion (401/403)
- Recurso no encontrado (404)
- Error global centralizado con middleware de errores

---

## 11) Frontend: arquitectura y reutilizacion

- `components/ui/*`: componentes reutilizables (`InputField`, `SelectField`, `Button`)
- `components/ProtectedRoute.jsx`: proteccion de rutas segun la matriz (`permission`)
- `context/AuthContext.jsx`: estado de sesion JWT
- `utils/permissions.js`: matriz de roles y helpers de UI
- `hooks/useForm.js`: manejo y validacion de formularios
- `pages/*`: pantallas de login, registro, tickets y dashboard

---

## 12) Flujo rapido de prueba

1. Iniciar backend y frontend
2. Entrar con `admin@demo.com / 123456`
3. Ir a **Tickets**
4. Crear, seguir y cerrar tickets
5. Probar filtros por estado/prioridad y paginacion
6. Ir a **Dashboard** y validar estadisticas
7. Entrar con `usuario@demo.com / 123456` y comprobar que no ve Dashboard ni puede borrar tickets
