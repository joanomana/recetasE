const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: props => `${props.value} no es un correo electrónico válido.`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
