const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const Receta = require('../models/Receta');

const isId = (id) => mongoose.isValidObjectId(id);

// POST /api/usuarios
exports.crearUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'nombre, email y password son requeridos' });
        }
        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(409).json({ error: 'El email ya está registrado' });

        const hashed = await bcrypt.hash(password, 10);
        const usuario = await Usuario.create({ nombre, email, password: hashed });
        res.status(201).json(usuario);
    } catch (err) { next(err); }
};

// GET /api/usuarios
exports.listarUsuarios = async (_req, res, next) => {
    try {
        const usuarios = await Usuario.find().lean();
        res.json(usuarios);
    } catch (err) { next(err); }
};

// GET /api/usuarios/:id
exports.obtenerUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });
        const usuario = await Usuario.findById(id).lean();
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) { next(err); }
};

// PUT /api/usuarios/:id
exports.actualizarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });

        const data = { ...req.body };
        if (data.password) data.password = await bcrypt.hash(data.password, 10);

        const usuario = await Usuario.findByIdAndUpdate(id, data, {
        new: true, runValidators: true
        }).lean();

        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) { next(err); }
};

// DELETE /api/usuarios/:id
exports.eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });

        const usuario = await Usuario.findByIdAndDelete(id).lean();
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        const { deletedCount } = await Receta.deleteMany({ autor: id });
        res.json({ mensaje: 'Usuario eliminado', recetasEliminadas: deletedCount });
    } catch (err) { next(err); }
};

// GET /api/usuarios/:id/recetas
exports.listarRecetasDeUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return res.status(400).json({ error: 'ID inválido' });

        const recetas = await Receta.find({ autor: id }).lean();
        res.json(recetas);
    } catch (err) { next(err); }
};
