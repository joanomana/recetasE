const router = require('express').Router();
const ctrl = require('../controllers/recetas.controller');

// Gestión de recetas
router.post('/', ctrl.crearReceta);
router.get('/', ctrl.listarRecetas);              
router.get('/buscar', ctrl.buscarPorIngrediente);
router.get('/:id', ctrl.obtenerReceta);
router.put('/:id', ctrl.actualizarReceta);
router.delete('/:id', ctrl.eliminarReceta);

// Gestión de ingredientes por receta
router.post('/:id/ingredientes', ctrl.agregarIngredientes);
router.get('/:id/ingredientes', ctrl.listarIngredientes);
router.delete('/:id/ingredientes/:ingredienteId', ctrl.eliminarIngrediente);

module.exports = router;
