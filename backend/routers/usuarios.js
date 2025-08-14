import { Router } from 'express';
import * as ctrl from '../controllers/usuarios.js';

const router = Router();

/**
 * @openapi
 * /api/usuarios:
 *   post:
 *     tags: [Usuarios]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UsuarioCreate' }
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Usuario' }
 *       400: { description: Campos faltantes, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       409: { description: Email duplicado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post('/', ctrl.crearUsuario);

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Usuario' }
 */
router.get('/', ctrl.listarUsuarios);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Usuario, content: { application/json: { schema: { $ref: '#/components/schemas/Usuario' } } } }
 *       400: { description: ID inválido }
 *       404: { description: Usuario no encontrado }
 */
router.get('/:id', ctrl.obtenerUsuario);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar datos de un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UsuarioUpdate' }
 *     responses:
 *       200: { description: Usuario actualizado, content: { application/json: { schema: { $ref: '#/components/schemas/Usuario' } } } }
 *       400: { description: ID inválido }
 *       404: { description: Usuario no encontrado }
 */
router.put('/:id', ctrl.actualizarUsuario);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario y sus recetas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Eliminado, content: { application/json: { schema: { $ref: '#/components/schemas/DeleteResponse' } } } }
 *       400: { description: ID inválido }
 *       404: { description: Usuario no encontrado }
 */
router.delete('/:id', ctrl.eliminarUsuario);

/**
 * @openapi
 * /api/usuarios/{id}/recetas:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar todas las recetas de un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recetas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Receta' }
 */
router.get('/:id/recetas', ctrl.listarRecetasDeUsuario);

export default router;
