const mongoose = require('mongoose');


const IngredienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    cantidad: { type: String, trim: true }, 
    unidad:   { type: String, trim: true }, 
    slug:     { type: String, index: true }
}, { _id: true });


IngredienteSchema.pre('validate', function(next) {
    if (this.nombre) this.slug = this.nombre.trim().toLowerCase();
    next();
});

const RecetaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    ingredientes: {
        type: [IngredienteSchema],
        default: [],
        validate: {
        validator: arr => Array.isArray(arr) && arr.length > 0,
        message: 'La receta debe tener al menos un ingrediente.'
        }
    },
    instrucciones: {
        type: String,
        required: true,
        trim: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    }
}, { timestamps: true });


RecetaSchema.index({ 'ingredientes.slug': 1 });
RecetaSchema.index({ autor: 1, nombre: 1 });