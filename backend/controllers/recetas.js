import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js';
import Receta from '../models/Receta.js';

const isId = (id) => mongoose.isValidObjectId(id);
const normalizaIng = ({ nombre, cantidad, unidad }) => ({
    nombre: String(nombre).trim(),
    cantidad: cantidad != null ? String(cantidad) : undefined,
    unidad: unidad || undefined,
    slug: String(nombre).trim().toLowerCase()
});

// POST /api/recetas
export const crearReceta = async (req, res, next) => {
    try {
        const { nombre, instrucciones, autor, ingredientes = [] } = req.body;
        if (!nombre || !instrucciones || !autor) {
        return res.status(400).json({ error: 'nombre, instrucciones y autor son requeridos' });
        }
        if (!isId(autor)) return res.status(400).json({ error: 'autor inválido' });

        const user = await Usuario.findById(autor).lean();
        if (!user) return res.status(404).json({ error: 'Autor no encontrado' });
        if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
        return res.status(400).json({ error: 'Debes incluir al menos un ingrediente' });
        }

        const receta = await Receta.create({
        nombre,
        instrucciones,
        autor,
        ingredientes: ingredientes.map(normalizaIng)
        });
        res.status(201).json(receta);
    } catch (err) { next(err); }
};

// GET /api/recetas   (opcional: ?ingrediente=pollo  | ?autor=<id>)
export const listarRecetas = async (req, res, next) => {
    try {
        const { ingrediente, autor } = req.query;
        const filtro = {};
        if (ingrediente) filtro['ingredientes.slug'] = String(ingrediente).toLowerCase();
        if (autor && isId(autor)) filtro.autor = autor;
        const recetas = await Receta.find(filtro).lean();
        res.json(recetas);
    } catch (err) { next(err); }
};

// GET /api/recetas/:id
export const obtenerReceta = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });
        const receta = await Receta.findById(id).lean();
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(receta);
    } catch (err) { next(err); }
};

// PUT /api/recetas/:id   (solo título/descr segun requisito)
export const actualizarReceta = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });

        const campos = {};
        if (req.body.nombre) campos.nombre = req.body.nombre;
        if (req.body.instrucciones) campos.instrucciones = req.body.instrucciones;

        const receta = await Receta.findByIdAndUpdate(id, campos, {
        new: true, runValidators: true
        }).lean();

        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(receta);
    } catch (err) { next(err); }
};

// DELETE /api/recetas/:id
export const eliminarReceta = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });

        const receta = await Receta.findByIdAndDelete(id).lean();
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json({ mensaje: 'Receta eliminada' });
    } catch (err) { next(err); }
};

// POST /api/recetas/:id/ingredientes
export const agregarIngredientes = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });

        const { ingredientes } = req.body; // puede ser array o objeto
        const items = Array.isArray(ingredientes) ? ingredientes : [ingredientes];
        if (!items.length) return res.status(400).json({ error: 'Debes enviar ingredientes' });

        const actualizada = await Receta.findByIdAndUpdate(
        id,
        { $push: { ingredientes: { $each: items.map(normalizaIng) } } },
        { new: true, runValidators: true }
        ).lean();

        if (!actualizada) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(actualizada);
    } catch (err) { next(err); }
};

// GET /api/recetas/:id/ingredientes
export const listarIngredientes = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });

        const receta = await Receta.findById(id, { ingredientes: 1, _id: 0 }).lean();
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(receta.ingredientes);
    } catch (err) { next(err); }
};

// DELETE /api/recetas/:id/ingredientes/:ingredienteId
export const eliminarIngrediente = async (req, res, next) => {
    try {
        const { id, ingredienteId } = req.params;
        if (!isId(id) || !isId(ingredienteId)) return res.status(400).json({ error: 'ID inválido' });

        const receta = await Receta.findByIdAndUpdate(
        id,
        { $pull: { ingredientes: { _id: ingredienteId } } },
        { new: true }
        ).lean();

        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        res.json(receta);
    } catch (err) { next(err); }
};

// GET /api/recetas/buscar?ingrediente=pollo
export const buscarPorIngrediente = async (req, res, next) => {
    try {
        const { ingrediente } = req.query;
        if (!ingrediente) return res.status(400).json({ error: 'Falta query "ingrediente"' });
        const q = String(ingrediente).toLowerCase();
        const recetas = await Receta.find({ 'ingredientes.slug': q }).lean();
        res.json(recetas);
    } catch (err) { next(err); }
};
