import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import Receta from '../models/Receta.js';

function ing(nombre, cantidad, unidad) {
    return {
        nombre: nombre.trim(),
        cantidad: cantidad ? String(cantidad) : undefined,
        unidad: unidad || undefined,
        slug: nombre.trim().toLowerCase(),
    };
}

async function cargarDatosDePrueba({ force = false } = {}) {
    if (force) {
        await Promise.all([
        Receta.deleteMany({}),
        Usuario.deleteMany({}),
        ]);
        console.log('⚠️  Colecciones Usuario y Receta limpiadas (force=true).');
    }

    const [usuariosCount, recetasCount] = await Promise.all([
        Usuario.countDocuments(),
        Receta.countDocuments(),
    ]);

    if (!force && (usuariosCount > 0 || recetasCount > 0)) {
        console.log('ℹ️ Ya existen datos en Usuario o Receta. No se cargaron datos de prueba.');
        return;
    }

    // 1) Usuarios (con hash de password)
    const saltRounds = 10;
    const usuariosBase = [
        { nombre: 'Ana Gómez',   email: 'ana@example.com',   password: 'secret123' },
        { nombre: 'Carlos Ruiz', email: 'carlos@example.com', password: 'secret123' },
        { nombre: 'Laura M.',    email: 'laura@example.com',  password: 'secret123' },
    ];

    const usuariosHasheados = await Promise.all(
        usuariosBase.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, saltRounds),
        }))
    );

    const usuarios = await Usuario.insertMany(usuariosHasheados);
    const ana = usuarios.find(u => u.email === 'ana@example.com');
    const carlos = usuarios.find(u => u.email === 'carlos@example.com');
    const laura = usuarios.find(u => u.email === 'laura@example.com');

    // 2) Recetas (ingredientes embebidos)
    const recetas = [
        {
        nombre: 'Pollo al Horno',
        instrucciones: 'Sazonar el pollo, hornear a 200°C por 45 min. Dejar reposar 5 min.',
        autor: ana._id,
        ingredientes: [
            ing('Pollo', 1, 'unidad'),
            ing('Sal', 1, 'cdita'),
            ing('Pimienta', 1, 'cdita'),
            ing('Aceite de oliva', 2, 'cdas'),
        ],
        },
        {
        nombre: 'Ensalada Veggie',
        instrucciones: 'Cortar, mezclar y aderezar. Servir fresca.',
        autor: carlos._id,
        ingredientes: [
            ing('Lechuga', 1, 'unidad'),
            ing('Tomate', 2, 'unidad'),
            ing('Aceite de oliva', 1, 'cda'),
            ing('Limón', 1, 'unidad'),
            ing('Sal', 1, 'pizca'),
        ],
        },
        {
        nombre: 'Pasta con Champiñones',
        instrucciones: 'Saltear champiñones, hervir pasta, mezclar y servir con queso.',
        autor: laura._id,
        ingredientes: [
            ing('Pasta', 200, 'g'),
            ing('Champiñones', 150, 'g'),
            ing('Ajo', 2, 'dientes'),
            ing('Aceite de oliva', 1, 'cda'),
            ing('Sal', 1, 'cdita'),
        ],
        },
        {
        nombre: 'Arepas de Queso',
        instrucciones: 'Mezclar harina con agua y sal, formar arepas, asar y agregar queso.',
        autor: ana._id,
        ingredientes: [
            ing('Harina de maíz', 2, 'tazas'),
            ing('Agua', 1.5, 'tazas'),
            ing('Sal', 1, 'cdita'),
            ing('Queso mozzarella', 100, 'g'),
        ],
        },
    ];

    await Receta.insertMany(recetas);

    console.log('✅ Datos de prueba (Usuarios y Recetas) cargados exitosamente');
}

export { cargarDatosDePrueba };

