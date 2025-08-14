'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listarRecetas, crearReceta, eliminarReceta } from '@/services/recetas';
import { listarUsuarios } from '@/services/usuarios';
import { toast, confirm } from '@/lib/alerts';

export default function RecetasPage() {
    const [recetas, setRecetas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState({ ingrediente: '', autor: '' });
    const [loading, setLoading] = useState(true);

    const reload = async () => {
        setLoading(true);
        try {
        const [rs, us] = await Promise.all([listarRecetas(filtro.ingrediente ? { ingrediente: filtro.ingrediente, autor: filtro.autor } : { autor: filtro.autor }), listarUsuarios()]);
        setRecetas(rs);
        setUsuarios(us);
        } finally { setLoading(false); }
    };

    useEffect(() => { reload(); }, []);
    useEffect(() => { reload(); }, [JSON.stringify(filtro)]);

    async function onCrear(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const ingredientes = (fd.get('ingredientes') || '')
        .split('\n').map(l => l.trim()).filter(Boolean)
        .map(l => {
            const [nombre, cantidad, unidad] = l.split('|').map(x => (x || '').trim());
            const i = { nombre };
            if (cantidad) i.cantidad = cantidad;
            if (unidad) i.unidad = unidad;
            return i;
        });
        const payload = {
        nombre: fd.get('nombre'),
        instrucciones: fd.get('instrucciones'),
        autor: fd.get('autor'),
        ingredientes,
        };
        try {
        await crearReceta(payload);
        toast('success', 'Receta creada');
        e.currentTarget.reset();
        reload();
        } catch (err) {
        toast('error', err.message);
        }
    }

    async function onEliminar(id) {
        const ok = (await confirm('¿Eliminar receta?')).isConfirmed;
        if (!ok) return;
        try {
        await eliminarReceta(id);
        toast('success', 'Receta eliminada');
        reload();
        } catch (e) {
        toast('error', e.message);
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-6">
        <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Recetas</h1>
            <Link href="/" className="text-sm text-gray-600 hover:underline">← Volver</Link>
        </header>

        {/* Filtros */}
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-2 text-lg font-semibold">Filtros</h2>
            <div className="grid gap-3 md:grid-cols-3">
            <input value={filtro.ingrediente} onChange={(e)=>setFiltro(f=>({ ...f, ingrediente: e.target.value }))} placeholder="Ingrediente (ej. pollo)" className="rounded-xl border border-gray-300 px-3 py-2 text-sm" />
            <select value={filtro.autor} onChange={(e)=>setFiltro(f=>({ ...f, autor: e.target.value }))} className="rounded-xl border border-gray-300 px-3 py-2 text-sm">
                <option value="">— Autor —</option>
                {usuarios.map(u => <option key={u._id} value={u._id}>{u.nombre}</option>)}
            </select>
            <div className="flex gap-2">
                <button onClick={reload} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">Aplicar</button>
                <button onClick={()=>setFiltro({ ingrediente:'', autor:'' })} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">Limpiar</button>
            </div>
            </div>
        </div>

        {/* Crear receta rápida */}
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-2 text-lg font-semibold">Crear receta</h2>
            <form onSubmit={onCrear} className="grid gap-3 md:grid-cols-2">
            <input name="nombre" placeholder="Nombre receta" required className="rounded-xl border border-gray-300 px-3 py-2 text-sm" />
            <select name="autor" required className="rounded-xl border border-gray-300 px-3 py-2 text-sm">
                <option value="">— Selecciona autor —</option>
                {usuarios.map(u => <option key={u._id} value={u._id}>{u.nombre}</option>)}
            </select>
            <textarea name="instrucciones" placeholder="Instrucciones" required rows={3} className="rounded-xl border border-gray-300 px-3 py-2 text-sm md:col-span-2" />
            <textarea name="ingredientes" placeholder={`Ingredientes (uno por línea):\nSal|1|cdita\nPimienta|1|cdita`} required rows={4} className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-mono md:col-span-2" />
            <div className="md:col-span-2">
                <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90">Crear</button>
            </div>
            </form>
        </div>

        {/* Listado */}
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Todas las recetas</h2>
            {loading && <span className="text-sm text-gray-500">Cargando…</span>}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
            {recetas.map(r => (
                <li key={r._id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">{r.nombre}</h4>
                    <div className="flex gap-2">
                    <Link href={`/recetas/${r._id}`} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Ver</Link>
                    <button onClick={()=>onEliminar(r._id)} className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100">Eliminar</button>
                    </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Autor: <span className="font-mono">{r.autor}</span></p>
                <p className="mt-1 text-xs text-gray-500">{r.ingredientes?.length ?? 0} ingredientes</p>
                </li>
            ))}
            {!loading && recetas.length === 0 && <li className="text-gray-500">Sin resultados.</li>}
            </ul>
        </div>
        </div>
    );
}
