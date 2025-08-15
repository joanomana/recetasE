# Plataforma de Recetas Culinarias — README

API REST (**Node.js + Express + MongoDB + Mongoose**) para gestionar **usuarios**, **recetas** e **ingredientes**.  
Incluye conexión a MongoDB mediante **Mongoose**, **seeders** automáticos, middleware de errores y **documentación Swagger**.  
El repositorio también contiene un **frontend (Next.js + Tailwind + SweetAlert2)** como complemento (ver al final).


---


## Link video https://drive.google.com/file/d/18i8oVpc1WrVItBo_Tj12ahqYK9NizA2g/view?usp=sharing

## 🧭 Tabla de contenidos

- [Requisitos](#requisitos)
- [Instalación y arranque](#instalación-y-arranque)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelos (resumen)](#modelos-resumen)
- [Convenciones de error](#convenciones-de-error)
- [Documentación Swagger](#documentación-swagger)
- [Endpoints (API)](#endpoints-api)
  - [Usuarios](#usuarios)
    - [1) Crear usuario](#1-crear-usuario)
    - [2) Listar usuarios](#2-listar-usuarios)
    - [3) Obtener usuario por id](#3-obtener-usuario-por-id)
    - [4) Actualizar usuario](#4-actualizar-usuario)
    - [5) Eliminar usuario (y sus recetas)](#5-eliminar-usuario-y-sus-recetas)
    - [6) Recetas de un usuario](#6-recetas-de-un-usuario)
  - [Recetas](#recetas)
    - [1) Crear receta](#1-crear-receta)
    - [2) Listar recetas (con filtros)](#2-listar-recetas-con-filtros)
    - [3) Obtener receta por id](#3-obtener-receta-por-id)
    - [4) Editar receta](#4-editar-receta)
    - [5) Eliminar receta](#5-eliminar-receta)
    - [6) Agregar ingredientes a una receta](#6-agregar-ingredientes-a-una-receta)
    - [7) Listar ingredientes de una receta](#7-listar-ingredientes-de-una-receta)
    - [8) Eliminar un ingrediente](#8-eliminar-un-ingrediente)
- [Seeders / Datos de prueba](#seeders--datos-de-prueba)
- [Healthcheck](#healthcheck)
- [Notas y buenas prácticas](#notas-y-buenas-prácticas)
- [Frontend (complementario)](#frontend-complementario)

---

## Requisitos

- **Node.js** 18 o superior  
- **MongoDB** (local o Atlas)
- (Dev) Postman / HTTPie / curl para probar

---


## Variables de entorno

Crear un archivo **`.env`** en la raíz:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/recetario

```
Crear un archivo **.env.example** dentro de la carpeta frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3000 
```
---
## Instalación y arranque

```bash
# En la raíz del repo
npm install
cd frontend
npm install
cd ..

# Ejecutar en la raiz del proyecto
npm run dev  



```

> Backend: **http://localhost:3000**  
> Swagger UI: **http://localhost:3000/docs**  
> OpenAPI JSON: **http://localhost:3000/openapi.json**
> OpenAPI JSON: **http://localhost:3001/**


---

## Estructura del proyecto

```
backend/
  controllers/
    recetas.js
    usuarios.js
  db/
    config.js         # conexión a MongoDB (reutilizable)
    seeders.js        # dataset de prueba
  middlewares/
    errorHandler.js   # manejador de errores centralizado
  models/
    Receta.js
    Usuario.js
  routers/
    recetas.js        # rutas /api/recetas/*
    usuarios.js       # rutas /api/usuarios/*
frontend/              # (complementario, ver sección al final)
app.js                 # servidor Express (ESM) + Swagger + seeders
package.json
```

---

## Modelos (resumen)

**Usuario**
```json
{
  "_id": "ObjectId",
  "nombre": "string",
  "email": "string (único)",
  "password": "string (hash, oculto por defecto)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Receta**
```json
{
  "_id": "ObjectId",
  "nombre": "string",
  "instrucciones": "string",
  "autor": "ObjectId (Usuario)",
  "ingredientes": [
    {
      "_id": "ObjectId",
      "nombre": "string",
      "cantidad": "string (opcional)",
      "unidad": "string (opcional)",
      "slug": "string (normalizado desde nombre)"
    }
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## Convenciones de error

- `400 Bad Request` → validación / formato / ID inválida  
- `404 Not Found` → recurso no existe  
- `409 Conflict` → colisión (p. ej. email duplicado)

**Formato de error**
```json
{ "error": "Mensaje descriptivo" }
```

---

## Documentación Swagger

- **UI:** `GET /docs`  
- **OpenAPI JSON:** `GET /openapi.json`

Los comentarios `@openapi` viven encima de las rutas en `backend/routers/**/*.js`.  
En `app.js`, `swaggerJSDoc` debe apuntar a esa carpeta (ruta absoluta con `path.join`).

---

## Endpoints (API)

**Base URL:** `http://localhost:3000`  
Los ejemplos usan `curl` (sustituye por tu host/puerto si aplica).

---

### Usuarios

#### 1) Crear usuario
- **Método:** `POST`  
- **URL:** `/api/usuarios`  
- **Descripción:** Registra un nuevo usuario.

**Request (JSON)**
```json
{
  "nombre": "Ana Gómez",
  "email": "ana@example.com",
  "password": "secret123"
}
```

**Response — 201 Created**
```json
{
  "_id": "66c3a9f2ab12cd34ef567890",
  "nombre": "Ana Gómez",
  "email": "ana@example.com",
  "createdAt": "2025-08-14T03:40:25.389Z",
  "updatedAt": "2025-08-14T03:40:25.389Z"
}
```

**Errores**
- 400 Campos faltantes o inválidos  
- 409 Email ya registrado

**curl**
```bash
curl -X POST http://localhost:3000/api/usuarios \
 -H "Content-Type: application/json" \
 -d '{"nombre":"Ana Gómez","email":"ana@example.com","password":"secret123"}'
```

---

#### 2) Listar usuarios
- **Método:** `GET`  
- **URL:** `/api/usuarios`  
- **Descripción:** Devuelve todos los usuarios.

**Request**  
*(sin cuerpo)*

**Response — 200 OK**
```json
[
  { "_id":"66c3...", "nombre":"Ana Gómez", "email":"ana@example.com" }
]
```

**curl**
```bash
curl http://localhost:3000/api/usuarios
```

---

#### 3) Obtener usuario por id
- **Método:** `GET`  
- **URL:** `/api/usuarios/{id}`  
- **Descripción:** Detalle de un usuario.

**Request**  
*(sin cuerpo; `{id}` es un ObjectId válido)*

**Response — 200 OK**
```json
{ "_id":"66c3...", "nombre":"Ana Gómez", "email":"ana@example.com" }
```

**Errores**
- 400 ID inválida  
- 404 No encontrado

**curl**
```bash
curl http://localhost:3000/api/usuarios/66c3a9f2ab12cd34ef567890
```

---

#### 4) Actualizar usuario
- **Método:** `PUT`  
- **URL:** `/api/usuarios/{id}`  
- **Descripción:** Actualiza `nombre` y/o `email` (opcional `password`).

**Request (JSON)**
```json
{ "nombre": "Ana G.", "email": "ana.g@example.com" }
```

**Response — 200 OK**
```json
{ "_id":"66c3...", "nombre":"Ana G.", "email":"ana.g@example.com" }
```

**Errores**
- 400 Datos inválidos  
- 404 No encontrado  
- 409 Email ya en uso

**curl**
```bash
curl -X PUT http://localhost:3000/api/usuarios/66c3a9f2ab12cd34ef567890 \
 -H "Content-Type: application/json" \
 -d '{"nombre":"Ana G."}'
```

---

#### 5) Eliminar usuario (y sus recetas)
- **Método:** `DELETE`  
- **URL:** `/api/usuarios/{id}`  
- **Descripción:** Elimina el usuario y **todas sus recetas** asociadas.

**Request**  
*(sin cuerpo)*

**Response — 200 OK**
```json
{ "mensaje": "Usuario y recetas eliminados" }
```

**Errores**
- 400 ID inválida  
- 404 No encontrado

**curl**
```bash
curl -X DELETE http://localhost:3000/api/usuarios/66c3a9f2ab12cd34ef567890
```

---

#### 6) Recetas de un usuario
- **Método:** `GET`  
- **URL:** `/api/usuarios/{id}/recetas`  
- **Descripción:** Lista todas las recetas del usuario.

**Request**  
*(sin cuerpo)*

**Response — 200 OK**
```json
[
  {
    "_id": "689d5aa991fc4c20d3072e74",
    "nombre": "Pasta con champiñones",
    "instrucciones": "Saltear champiñones, hervir pasta, mezclar y servir.",
    "autor": "66c3a9f2ab12cd34ef567890",
    "ingredientes": [
      { "_id": "689d5aa991fc4c20d3072e75", "nombre": "Pasta", "cantidad": "200", "unidad": "g", "slug": "pasta" },
      { "_id": "689d5aa991fc4c20d3072e76", "nombre": "Champiñones", "cantidad": "150", "unidad": "g", "slug": "champiñones" }
    ],
    "createdAt": "2025-08-14T03:40:25.389Z",
    "updatedAt": "2025-08-14T03:40:25.389Z"
  }
]
```

**Errores**
- 400 ID inválida  
- 404 Usuario no encontrado

**curl**
```bash
curl http://localhost:3000/api/usuarios/66c3a9f2ab12cd34ef567890/recetas
```

---

### Recetas

#### 1) Crear receta
- **Método:** `POST`  
- **URL:** `/api/recetas`  
- **Descripción:** Crea una receta con su autor e ingredientes.

**Request (JSON)**
```json
{
  "nombre": "Pasta con champiñones",
  "instrucciones": "Saltear champiñones, hervir pasta, mezclar y servir con queso.",
  "autor": "66c3a9f2ab12cd34ef567890",
  "ingredientes": [
    { "nombre": "Pasta", "cantidad": "200", "unidad": "g" },
    { "nombre": "Champiñones", "cantidad": "150", "unidad": "g" }
  ]
}
```

**Response — 201 Created**
```json
{
  "_id": "689d5aa991fc4c20d3072e74",
  "nombre": "Pasta con champiñones",
  "instrucciones": "Saltear champiñones, hervir pasta, mezclar y servir con queso.",
  "autor": "66c3a9f2ab12cd34ef567890",
  "ingredientes": [
    { "_id":"689d5aa991fc4c20d3072e75","nombre":"Pasta","cantidad":"200","unidad":"g","slug":"pasta" },
    { "_id":"689d5aa991fc4c20d3072e76","nombre":"Champiñones","cantidad":"150","unidad":"g","slug":"champiñones" }
  ],
  "createdAt":"2025-08-14T03:40:25.389Z",
  "updatedAt":"2025-08-14T03:40:25.389Z"
}
```

**Errores**
- 400 Datos inválidos  
- 404 Autor inexistente

**curl**
```bash
curl -X POST http://localhost:3000/api/recetas \
 -H "Content-Type: application/json" \
 -d '{
   "nombre":"Pasta con champiñones",
   "instrucciones":"Saltear champiñones, hervir pasta, mezclar y servir con queso.",
   "autor":"66c3a9f2ab12cd34ef567890",
   "ingredientes":[{"nombre":"Pasta","cantidad":"200","unidad":"g"}]
 }'
```

---

#### 2) Listar recetas (con filtros)
- **Método:** `GET`  
- **URL:** `/api/recetas`  
- **Descripción:** Lista todas las recetas con filtros opcionales.
- **Query opcional:**
  - `ingrediente` → nombre/slug (ej. `pollo`)
  - `autor` → ID de usuario

**Ejemplos**
- `/api/recetas`
- `/api/recetas?ingrediente=pollo`
- `/api/recetas?autor=66c3a9f2ab12cd34ef567890`
- `/api/recetas?ingrediente=pollo&autor=66c3a9f2ab12cd34ef567890`

**Response — 200 OK**
```json
[
  {
    "_id": "689d5aa991fc4c20d3072e74",
    "nombre": "Pollo al horno",
    "autor": "66c3a9f2ab12cd34ef567890",
    "ingredientes": [ { "_id": "6", "nombre": "Pollo", "slug": "pollo" } ]
  }
]
```

**curl**
```bash
curl "http://localhost:3000/api/recetas?ingrediente=pollo"
```

---

#### 3) Obtener receta por id
- **Método:** `GET`  
- **URL:** `/api/recetas/{id}`  
- **Descripción:** Devuelve la receta con sus ingredientes.

**Response — 200 OK**
```json
{
  "_id": "689d5aa991fc4c20d3072e74",
  "nombre": "Pasta con champiñones",
  "instrucciones": "Saltear champiñones...",
  "autor": "66c3a9f2ab12cd34ef567890",
  "ingredientes": [
    { "_id": "689d5aa991fc4c20d3072e75", "nombre": "Pasta", "cantidad": "200", "unidad": "g", "slug": "pasta" }
  ],
  "createdAt": "2025-08-14T03:40:25.389Z",
  "updatedAt": "2025-08-14T03:40:25.389Z"
}
```

**Errores**
- 400 ID inválida  
- 404 No encontrada

**curl**
```bash
curl http://localhost:3000/api/recetas/689d5aa991fc4c20d3072e74
```

---

#### 4) Editar receta
- **Método:** `PUT`  
- **URL:** `/api/recetas/{id}`  
- **Descripción:** Actualiza `nombre` y/o `instrucciones`.

**Request (JSON)**
```json
{ "nombre": "Pasta fácil", "instrucciones": "Actualizar pasos..." }
```

**Response — 200 OK**
```json
{
  "_id": "689d5aa991fc4c20d3072e74",
  "nombre": "Pasta fácil",
  "instrucciones": "Actualizar pasos...",
  "autor": "66c3a9f2ab12cd34ef567890",
  "ingredientes": [ /* ... */ ],
  "createdAt": "2025-08-14T03:40:25.389Z",
  "updatedAt": "2025-08-14T03:45:12.001Z"
}
```

**Errores**
- 400 Datos inválidos  
- 404 No encontrada

**curl**
```bash
curl -X PUT http://localhost:3000/api/recetas/689d5aa991fc4c20d3072e74 \
 -H "Content-Type: application/json" \
 -d '{"nombre":"Pasta fácil"}'
```

---

#### 5) Eliminar receta
- **Método:** `DELETE`  
- **URL:** `/api/recetas/{id}`  
- **Descripción:** Elimina una receta.

**Response — 200 OK**
```json
{ "mensaje": "Receta eliminada" }
```

**Errores**
- 400 ID inválida  
- 404 No encontrada

**curl**
```bash
curl -X DELETE http://localhost:3000/api/recetas/689d5aa991fc4c20d3072e74
```

---

#### 6) Agregar ingredientes a una receta
- **Método:** `POST`  
- **URL:** `/api/recetas/{id}/ingredientes`  
- **Descripción:** Agrega **uno** o **varios** ingredientes.

**Request — Uno (JSON)**
```json
{ "ingredientes": { "nombre": "Sal", "cantidad": "1", "unidad": "cdita" } }
```

**Request — Varios (JSON)**
```json
{
  "ingredientes": [
    { "nombre": "Sal", "cantidad": "1", "unidad": "cdita" },
    { "nombre": "Pimienta", "cantidad": "1", "unidad": "cdita" }
  ]
}
```

**Response — 200 OK** (receta con ingredientes actualizados)
```json
{
  "_id": "689d5aa991fc4c20d3072e74",
  "ingredientes": [
    { "_id": "701", "nombre": "Sal", "cantidad": "1", "unidad": "cdita", "slug": "sal" },
    { "_id": "702", "nombre": "Pimienta", "cantidad": "1", "unidad": "cdita", "slug": "pimienta" }
  ]
}
```

**Errores**
- 400 Body vacío / ID inválida  
- 404 Receta no existe

**curl**
```bash
curl -X POST http://localhost:3000/api/recetas/689d5aa991fc4c20d3072e74/ingredientes \
 -H "Content-Type: application/json" \
 -d '{"ingredientes":[{"nombre":"Sal","cantidad":"1","unidad":"cdita"}]}'
```

---

#### 7) Listar ingredientes de una receta
- **Método:** `GET`  
- **URL:** `/api/recetas/{id}/ingredientes`  
- **Descripción:** Devuelve solo el arreglo de ingredientes.

**Response — 200 OK**
```json
[
  { "_id": "689d5aa991fc4c20d3072e75", "nombre": "Pasta", "cantidad": "200", "unidad": "g", "slug": "pasta" },
  { "_id": "689d5aa991fc4c20d3072e76", "nombre": "Champiñones", "cantidad": "150", "unidad": "g", "slug": "champiñones" }
]
```

**Errores**
- 400 ID inválida  
- 404 Receta no existe

**curl**
```bash
curl http://localhost:3000/api/recetas/689d5aa991fc4c20d3072e74/ingredientes
```

---

#### 8) Eliminar un ingrediente
- **Método:** `DELETE`  
- **URL:** `/api/recetas/{id}/ingredientes/{ingredienteId}`  
- **Descripción:** Quita un ingrediente por `_id` de subdocumento.

**Response — 200 OK**
```json
{
  "_id": "689d5aa991fc4c20d3072e74",
  "ingredientes": [
    { "_id": "689d5aa991fc4c20d3072e75", "nombre": "Pasta", "cantidad": "200", "unidad": "g", "slug": "pasta" }
  ]
}
```

**Errores**
- 400 ID de receta o ingrediente inválida  
- 404 Receta o ingrediente no encontrado

**curl**
```bash
curl -X DELETE http://localhost:3000/api/recetas/689d5aa991fc4c20d3072e74/ingredientes/689d5aa991fc4c20d3072e76
```

---

## Seeders / Datos de prueba

- Si la base está **vacía** al arrancar, se ejecutan seeders automáticamente.  
- Forzar / omitir:
  - `FORCE_SEED=true` → siempre carga dataset  
  - `SKIP_SEED=true` → nunca ejecuta seeders  
  - `node app.js --seed` → fuerza una ejecución puntual

---

## Healthcheck

**GET** `/health`  
**200 OK**
```json
{ "ok": true }
```

---

## Notas y buenas prácticas

- `password` se almacena **hasheado** y no se devuelve por defecto (`select: false`).  
- Usa `{ new: true, runValidators: true }` en updates para validar y recibir el doc actualizado.  
- Indexa `email` (único) y `ingredientes.slug` para búsquedas eficientes.  
- En lecturas de solo lectura, usa `.lean()` para mejorar rendimiento.  
- Maneja `MongoServerError` código `11000` (duplicados por índice único).  
- En dev, habilita CORS si consumes desde otro puerto:
  ```js
  app.use(cors({ origin: ['http://localhost:3001'] }))
  ```

---

## Frontend (complementario)

**Stack:** Next.js 15 (App Router) + Tailwind v4 + SweetAlert2.  
Cubre: crear/listar/ver/editar/eliminar **usuarios** y **recetas**, gestión de **ingredientes** (+/−), búsqueda por ingrediente y recetas de un usuario.

**Estructura resumida**
```
frontend/
  src/
    app/
      recetas/
        [id]/page.jsx        # Detalle: ver/editar receta, ingredientes (+/-)
        page.jsx             # Listar, crear, filtrar por ingrediente/autor
      usuarios/
        [id]/page.jsx        # Detalle: usuario + sus recetas
        page.jsx             # Listar, crear, editar/eliminar
      layout.jsx             # Gradientes globales
      globals.css
      page.jsx               # Dashboard
    components/
      recetas/CrearReceta.jsx, Recetas.jsx, BuscarIngrediente.jsx
      usuarios/CrearUsuario.jsx, Usuarios.jsx
      Spinner.jsx
    lib/api.js               # helper fetch (usa NEXT_PUBLIC_API_URL)
    lib/alerts.js            # SweetAlert2 (toasts/confirm/prompts)
    services/recetas.js, services/usuarios.js
  .env.local                 # NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Arranque**
```bash
cd frontend
npm install
npm run dev -p 3001
```

---
## Integrantes

* Joan Sebastian Omaña Suarez