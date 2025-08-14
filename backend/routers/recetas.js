import { Router } from 'express';
import * as ctrl from '../controllers/recetas.js';

const router = Router();

/**
 * @openapi
 * /api/recetas:
 *   post:
 *     tags: [Recetas]
 *     summary: Crear una receta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RecetaCreate' }
 *     responses:
 *       201: { description: Receta creada, content: { application/json: { schema: { $ref: '#/components/schemas/Receta' } } } }
 *       400: { description: Datos faltantes o inválidos }
 *       404: { description: Autor no encontrado }
 */
router.post('/', ctrl.crearReceta);

/**
 * @openapi
 * /api/recetas:
 *   get:
 *     tags: [Recetas]
 *     summary: Listar recetas (con filtros)
 *     parameters:
 *       - in: query
 *         name: ingrediente
 *         schema: { type: string }
 *         description: Slug/nombre de ingrediente (ej. "pollo")
 *       - in: query
 *         name: autor
 *         schema: { type: string }
 *         description: ID de usuario autor
 *     responses:
 *       200:
 *         description: Lista de recetas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Receta' }
 */
router.get('/', ctrl.listarRecetas);

/**
 * @openapi
 * /api/recetas/buscar:
 *   get:
 *     tags: [Recetas]
 *     summary: Buscar recetas por ingrediente
 *     parameters:
 *       - in: query
 *         name: ingrediente
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recetas que contienen el ingrediente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Receta' }
 *       400: { description: Falta query "ingrediente" }
 */
router.get('/buscar', ctrl.buscarPorIngrediente);

/**
 * @openapi
 * /api/recetas/{id}:
 *   get:
 *     tags: [Recetas]
 *     summary: Obtener receta por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Receta, content: { application/json: { schema: { $ref: '#/components/schemas/Receta' } } } }
 *       400: { description: ID inválido }
 *       404: { description: Receta no encontrada }
 */
router.get('/:id', ctrl.obtenerReceta);

/**
 * @openapi
 * /api/recetas/{id}:
 *   put:
 *     tags: [Recetas]
 *     summary: Editar título o instrucciones de una receta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RecetaUpdate' }
 *     responses:
 *       200: { description: Receta actualizada, content: { application/json: { schema: { $ref: '#/components/schemas/Receta' } } } }
 *       400: { description: ID inválido }
 *       404: { description: Receta no encontrada }
 */
router.put('/:id', ctrl.actualizarReceta);

/**
 * @openapi
 * /api/recetas/{id}:
 *   delete:
 *     tags: [Recetas]
 *     summary: Eliminar una receta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Receta eliminada, content: { application/json: { schema: { $ref: '#/components/schemas/DeleteResponse' } } } }
 *       400: { description: ID inválido }
 *       404: { description: Receta no encontrada }
 */
router.delete('/:id', ctrl.eliminarReceta);

/**
 * @openapi
 * /api/recetas/{id}/ingredientes:
 *   post:
 *     tags: [Recetas]
 *     summary: Agregar uno o varios ingredientes a una receta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             uno:
 *               summary: Un ingrediente
 *               value: { ingredientes: { nombre: "Sal", cantidad: "1", unidad: "cdita" } }
 *             varios:
 *               summary: Varios ingredientes
 *               value: { ingredientes: [ { nombre: "Sal", cantidad: "1", unidad: "cdita" }, { nombre: "Pimienta", cantidad: "1", unidad: "cdita" } ] }
 *     responses:
 *       200: { description: Receta actualizada, content: { application/json: { schema: { $ref: '#/components/schemas/Receta' } } } }
 *       400: { description: ID inválido o body vacío }
 *       404: { description: Receta no encontrada }
 */
router.post('/:id/ingredientes', ctrl.agregarIngredientes);

/**
 * @openapi
 * /api/recetas/{id}/ingredientes:
 *   get:
 *     tags: [Recetas]
 *     summary: Listar ingredientes de una receta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Ingrediente' }
 *       400: { description: ID inválido }
 *       404: { description: Receta no encontrada }
 */
router.get('/:id/ingredientes', ctrl.listarIngredientes);

/**
 * @openapi
 * /api/recetas/{id}/ingredientes/{ingredienteId}:
 *   delete:
 *     tags: [Recetas]
 *     summary: Eliminar un ingrediente de una receta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: ingredienteId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Receta actualizada, content: { application/json: { schema: { $ref: '#/components/schemas/Receta' } } } }
 *       400: { description: ID inválido }
 *       404: { description: Receta no encontrada }
 */
router.delete('/:id/ingredientes/:ingredienteId', ctrl.eliminarIngrediente);

export default router;
