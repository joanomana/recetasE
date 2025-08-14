'use client';
import { useRef, useState } from 'react';
import { crearReceta } from '@/services/recetas';
import { toast } from '@/lib/alerts';

function emptyIng() {
    return { nombre: '', cantidad: '', unidad: '' };
}

export default function CrearRecetaForm({ onCreated }) {
    const formRef = useRef(null);
    const [loading, setLoading] = useState(false);

  // ingredientes controlados (mínimo 1 fila)
    const [ingredientes, setIngredientes] = useState([emptyIng()]);

    const setIng = (idx, field, value) => {
        setIngredientes(prev => {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
        });
    };

    const addIng = () => setIngredientes(prev => [...prev, emptyIng()]);

    const removeIng = (idx) =>
        setIngredientes(prev => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));

    async function onSubmit(e) {
        e.preventDefault();
        const form = formRef.current;
        setLoading(true);

        const fd = new FormData(form);
        // limpiezas: quita filas sin nombre
        const ings = ingredientes
        .map(i => ({ nombre: i.nombre.trim(), cantidad: i.cantidad.trim(), unidad: i.unidad.trim() }))
        .filter(i => i.nombre.length > 0);

        if (ings.length === 0) {
        toast('error', 'Agrega al menos 1 ingrediente con nombre');
        setLoading(false);
        return;
        }

        const payload = {
        nombre: fd.get('nombre'),
        instrucciones: fd.get('instrucciones'),
        autor: fd.get('autor'),
        ingredientes: ings, // <- [{ nombre, cantidad?, unidad? }, ...]
        };

        try {
        const data = await crearReceta(payload);
        toast('success', 'Receta creada');
        onCreated?.(data);

        // limpiar form y volver a 1 fila vacía
        form?.reset();
        setIngredientes([emptyIng()]);
        } catch (err) {
        toast('error', err.message);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
        <h3 className="text-lg font-semibold">Crear receta</h3>
        <p className="text-sm text-gray-500 mb-4">
            Los ingredientes se agregan por fila. Cada fila pide <b>nombre</b>, <b>cantidad</b> y <b>unidad</b>.
        </p>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
            {/* Datos de la receta */}
            <div className="grid gap-3 md:grid-cols-2">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la receta</label>
                <input
                name="nombre" required
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Pasta con champiñones"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Autor (ID de usuario)</label>
                <input
                name="autor" required
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="66c3a9f2ab12cd34ef567890"
                />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Instrucciones</label>
                <textarea
                name="instrucciones" required rows={3}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Saltear champiñones, hervir pasta, mezclar y servir con queso."
                />
            </div>
            </div>

            {/* Ingredientes dinámicos */}
            <div>
            <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Ingredientes</label>
                <button
                type="button"
                onClick={addIng}
                className="inline-flex items-center rounded-xl border px-3 py-1 text-sm hover:bg-gray-50"
                >
                <svg viewBox="0 0 24 24" className="mr-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Agregar fila
                </button>
            </div>

            <div className="space-y-2">
                {ingredientes.map((ing, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center gap-2">
                    <input
                    value={ing.nombre}
                    onChange={e => setIng(idx, 'nombre', e.target.value)}
                    placeholder="Nombre (ej. Pasta)"
                    className="col-span-6 rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    required={idx === 0} // al menos 1 con nombre
                    />
                    <input
                    value={ing.cantidad}
                    onChange={e => setIng(idx, 'cantidad', e.target.value)}
                    placeholder="Cantidad (ej. 200)"
                    className="col-span-3 rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                    value={ing.unidad}
                    onChange={e => setIng(idx, 'unidad', e.target.value)}
                    placeholder="Unidad (ej. g)"
                    className="col-span-2 rounded-xl border border-gray-300 px-3 py-2 text-sm"
                    />
                    <button
                    type="button"
                    onClick={() => removeIng(idx)}
                    className="col-span-1 inline-flex items-center justify-center rounded-xl border border-red-300 bg-red-50 p-2 text-red-700 hover:bg-red-100 disabled:opacity-50"
                    disabled={ingredientes.length === 1}
                    title="Quitar fila"
                    >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                    </svg>
                    </button>
                </div>
                ))}
            </div>
            </div>

            <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60"
            >
            {loading ? 'Creando…' : 'Crear'}
            </button>
        </form>
        </div>
    );
}
