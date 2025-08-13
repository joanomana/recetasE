const router = require('express').Router();
const ctrl = require('../controllers/usuarios.controller');

// Gestión de usuarios
router.post('/', ctrl.crearUsuario);
router.get('/', ctrl.listarUsuarios);
router.get('/:id', ctrl.obtenerUsuario);
router.put('/:id', ctrl.actualizarUsuario);
router.delete('/:id', ctrl.eliminarUsuario);

// Recetas de un usuario
router.get('/:id/recetas', ctrl.listarRecetasDeUsuario);

module.exports = router;
