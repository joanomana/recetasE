import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import cors from 'cors';

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import conectarDB from './backend/db/config.js';
import { cargarDatosDePrueba } from './backend/db/seeders.js';

import usuariosRoutes from './backend/routers/usuarios.js';
import recetasRoutes  from './backend/routers/recetas.js';
import errorHandler   from './backend/middlewares/errorHandler.js';

import Usuario from './backend/models/Usuario.js';
import Receta  from './backend/models/Receta.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3001'] }));

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Plataforma de Recetas Culinarias', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}` }],
    tags: [
      { name: 'Usuarios', description: 'Gestión de usuarios' },
      { name: 'Recetas', description: 'Gestión de recetas e ingredientes' }
    ],
    components: {
      schemas: {
        // ------- Usuarios -------
        UsuarioCreate: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            nombre: { type: 'string', example: 'Juancito' },
            email: { type: 'string', format: 'email', example: 'juancito@example.com' },
            password: { type: 'string', minLength: 6, example: 'secret123' }
          }
        },
        UsuarioUpdate: {
          type: 'object',
          properties: {
            nombre: { type: 'string', example: 'Ana G.' },
            email: { type: 'string', format: 'email', example: 'ana.g@example.com' },
            password: { type: 'string', minLength: 6, example: 'newSecret' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66c3a9f2ab12cd34ef567890' },
            nombre: { type: 'string', example: 'Ana Gómez' },
            email: { type: 'string', format: 'email', example: 'ana@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // ------- Recetas / Ingredientes -------
        IngredienteInput: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'Aceite de oliva' },
            cantidad: { type: 'string', example: '2' },
            unidad: { type: 'string', example: 'cdas' }
          }
        },
        Ingrediente: {
          allOf: [
            { $ref: '#/components/schemas/IngredienteInput' },
            { type: 'object', properties: { _id: { type: 'string' }, slug: { type: 'string' } } }
          ]
        },
        RecetaCreate: {
          type: 'object',
          required: ['nombre', 'instrucciones', 'autor', 'ingredientes'],
          properties: {
            nombre: { type: 'string', example: 'Pollo al horno' },
            instrucciones: { type: 'string', example: 'Hornear 45 min a 200°C.' },
            autor: { type: 'string', example: '66c3a9f2ab12cd34ef567890' },
            ingredientes: { type: 'array', items: { $ref: '#/components/schemas/IngredienteInput' } }
          }
        },
        RecetaUpdate: {
          type: 'object',
          properties: {
            nombre: { type: 'string', example: 'Pollo al horno (fácil)' },
            instrucciones: { type: 'string', example: 'Actualizar pasos…' }
          }
        },
        Receta: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nombre: { type: 'string' },
            instrucciones: { type: 'string' },
            autor: { type: 'string' },
            ingredientes: { type: 'array', items: { $ref: '#/components/schemas/Ingrediente' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // ------- Genéricos -------
        DeleteResponse: {
          type: 'object',
          properties: { mensaje: { type: 'string' } }
        },
        Error: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  },
  apis: ['./src/routers/*.js'],
});


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));
/* --------------------------------------------------- */

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recetas',  recetasRoutes);

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// 404 (siempre al final, después de Swagger y las rutas)
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Errores (después del 404)
app.use(errorHandler);

// ---------- Validación BD + seed ----------
async function checkDatabaseAndSeed() {
  const FORCE_SEED = process.env.FORCE_SEED === 'true' || process.argv.includes('--seed');
  const SKIP_SEED  = process.env.SKIP_SEED === 'true';

  try { await Promise.all([Usuario.syncIndexes(), Receta.syncIndexes()]); }
  catch (e) { console.warn('⚠️  No se pudieron sincronizar índices:', e.message); }

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const names = collections.map(c => c.name);

  const hasUsuarios = names.includes(Usuario.collection.name);
  const hasRecetas  = names.includes(Receta.collection.name);

  const usuariosCount = hasUsuarios ? await Usuario.estimatedDocumentCount() : 0;
  const recetasCount  = hasRecetas  ? await Receta.estimatedDocumentCount()  : 0;

  console.log(`📊 BD -> colecciones: ${names.join(', ') || 'ninguna'} | usuarios=${usuariosCount} | recetas=${recetasCount}`);

  if (SKIP_SEED) { console.log('⏭️  SKIP_SEED activo. No se ejecutan seeders.'); return; }
  if (FORCE_SEED) { console.log('⚠️  FORCE_SEED activo. Sembrando…'); await cargarDatosDePrueba({ force: true }); return; }

  if (usuariosCount === 0 && recetasCount === 0) {
    console.log('🌱 Base vacía. Ejecutando seeders…');
    await cargarDatosDePrueba();
  } else {
    console.log('✅ Datos existentes. Seeders no necesarios.');
  }
}

// ---------- Arranque ----------
(async () => {
  try {
    await conectarDB();
    await checkDatabaseAndSeed();
    app.listen(PORT, () => console.log(`🚀 API en http://localhost:${PORT} — Docs: /docs`));
  } catch (err) {
    console.error('❌ No se pudo iniciar la app:', err.message);
    process.exit(1);
  }
})();

export default app;
