require('dotenv').config();
const express = require('express');
const conectarDB = require('./db/config'); // ya lo tienes
const usuariosRoutes = require('./routers/usuarios.routes');
const recetasRoutes = require('./routers/recetas.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recetas', recetasRoutes);

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => {
    res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejo de errores
app.use(errorHandler);

// Arranque
const PORT = process.env.PORT || 3000;
conectarDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 API escuchando en http://localhost:${PORT}`));
}).catch((err) => {
  console.error('No se pudo conectar a MongoDB:', err.message);
  process.exit(1);
});

module.exports = app;
