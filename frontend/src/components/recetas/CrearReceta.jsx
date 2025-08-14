'use client';
import { useState } from 'react';
import { crearReceta } from '@/services/recetas';
import Spinner from '@/components/Spinner';

function parseIngredientes(texto) {
    return (texto || '')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => {
        const [nombre, cantidad, unidad] = l.split('|').map(s => (s || '').trim());
        const out = { nombre };
        if (cantidad) out.cantidad = cantidad;
        if (unidad) out.unidad = unidad;
        return out;
        });
    }

export default function CrearRecetaForm({ onCreated }) {
    const [loading, setLoading] = useState(false);
    const [out, setOut] = useState(null);
    const [error, setError] = useState(null);

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true); setError(null); setOut(null);
        const fd = new FormData(e.currentTarget);
        const ingredientes = parseIngredientes(fd.get('ingredientes'));

        const payload = {
            nombre: fd.get('nombre'),
            instrucciones: fd.get('instrucciones'),
            autor: fd.get('autor'),
            ingredientes
        };

        try {
            const data = await crearReceta(payload);
            setOut(data);
            onCreated?.(data);
            e.currentTarget.reset();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Crear receta</h3>
            <p className="text-sm text-gray-500 mb-4">Los ingredientes se escriben uno por línea con el formato <span className="font-mono">nombre|cantidad|unidad</span>.</p>

            {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
                </div>
            )}
            {out && (
                <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Receta creada: <span className="font-mono">{out._id}</span>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la receta</label>
                    <input
                        name="nombre" required
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                        placeholder="Pollo al horno"
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">Instrucciones</label>
                    <textarea
                        name="instrucciones" required rows={3}
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                        placeholder="Precalentar horno a 200°C, sazonar, hornear 45 min..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
                    <textarea
                        name="ingredientes" required rows={4}
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400 font-mono"
                        placeholder={`Ejemplo:\nSal|1|cdita\nPimienta|1|cdita`}
                    />
                </div>

                <button
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60"
                >
                {loading && <Spinner className="w-4 h-4 mr-2" />} Crear
                </button>
            </form>
        </div>
    );
}
