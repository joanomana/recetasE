'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    obtenerReceta,
    actualizarReceta,
    eliminarReceta,
    agregarIngredientes,
    eliminarIngrediente,
    listarIngredientes,
} from '@/services/recetas';
import { toast, confirm, promptEditRecipe, promptIngredientes } from '@/lib/alerts';

export default function RecetaDetail() {
    const router = useRouter();
    const params = useParams(); // <- ✅ en client, usa este hook
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [receta, setReceta] = useState(null);
    const [ingredientes, setIngredientes] = useState([]);

    const reload = async () => {
        if (!id) return;
        try {
        const r = await obtenerReceta(id);
        setReceta(r);
        const ings = await listarIngredientes(id).catch(() => r.ingredientes || []);
        setIngredientes(ings);
        } catch (e) {
        toast('error', e.message);
        }
    };

    useEffect(() => { if (id) reload(); }, [id]);

    const onEditar = async () => {
        const data = await promptEditRecipe(receta);
        if (!data) return;
        try {
        await actualizarReceta(id, data);
        toast('success', 'Receta actualizada');
        reload();
        } catch (e) { toast('error', e.message); }
    };

    const onEliminar = async () => {
        const ok = (await confirm('¿Eliminar esta receta?')).isConfirmed;
        if (!ok) return;
        try {
        await eliminarReceta(id);
        toast('success', 'Receta eliminada');
        router.push('/recetas'); // <- ✅ usa router en vez de window.location
        } catch (e) { toast('error', e.message); }
    };

    const onAgregarIngredientes = async () => {
        const list = await promptIngredientes();
        if (!list) return;
        try {
        const r = await agregarIngredientes(id, list);
        toast('success', 'Ingredientes agregados');
        setReceta(r);
        setIngredientes(r.ingredientes || list);
        } catch (e) { toast('error', e.message); }
    };

    const onEliminarIngrediente = async (ingredienteId) => {
        const ok = (await confirm('¿Eliminar ingrediente?')).isConfirmed;
        if (!ok) return;
        try {
        const r = await eliminarIngrediente(id, ingredienteId);
        toast('success', 'Ingrediente eliminado');
        setReceta(r);
        setIngredientes(r.ingredientes || ingredientes.filter(i => i._id !== ingredienteId));
        } catch (e) { toast('error', e.message); }
    };

    if (!id) return <div className="p-6">Cargando…</div>;
    if (!receta) return <div className="p-6">Cargando receta…</div>;

    return (
        <div className="mx-auto max-w-5xl p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Receta</h1>
                <Link href="/recetas" className="text-sm text-gray-600 hover:underline">← Volver</Link>
            </header>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">ID: <code>{receta._id}</code></p>
                        <h2 className="text-lg font-semibold">{receta.nombre}</h2>
                        <p className="text-gray-600 whitespace-pre-line">{receta.instrucciones}</p>
                        <p className="mt-1 text-xs text-gray-500">Autor: <span className="font-mono">{receta.autor}</span></p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onEditar} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Editar</button>
                        <button onClick={onEliminar} className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100">Eliminar</button>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Ingredientes</h3>
                    <button onClick={onAgregarIngredientes} className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90">
                        Agregar ingredientes
                    </button>
                </div>

                <ul className="grid gap-3 md:grid-cols-2">
                {ingredientes.map(i => (
                    <li key={i._id || i.nombre} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{i.nombre}</p>
                                <p className="text-xs text-gray-500">
                                    {i.cantidad ? `${i.cantidad}` : ''} {i.unidad ? i.unidad : ''}
                                </p>
                            </div>
                            {i._id && (
                            <button
                                onClick={() => onEliminarIngrediente(i._id)}
                                className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100"
                            >
                                Eliminar
                            </button>
                            )}
                        </div>
                    </li>
                ))}
                {ingredientes.length === 0 && <li className="text-gray-500">No hay ingredientes.</li>}
                </ul>
            </div>
        </div>
    );
}
