'use client';
import { useState } from 'react';
import { buscarPorIngrediente } from '@/services/recetas';
import Spinner from '@/components/Spinner';

export default function BuscarPorIngrediente() {
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [lista, setLista] = useState([]);
    const [error, setError] = useState(null);

    async function onBuscar() {
        if (!q.trim()) return;
        setLoading(true); setError(null);
        try {
        const data = await buscarPorIngrediente(q.trim());
        setLista(data);
        } catch (err) {
        setError(err.message);
        setLista([]);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Buscar recetas por ingrediente</h3>
        <div className="mt-3 flex gap-2">
            <input
            value={q} onChange={e=>setQ(e.target.value)} placeholder="pollo"
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            <button
            onClick={onBuscar} disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60"
            >
            {loading ? <><Spinner className="w-4 h-4 mr-2"/>Buscando…</> : 'Buscar'}
            </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {lista.map(r => (
            <li key={r._id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                <h4 className="font-medium">{r.nombre}</h4>
                <span className="text-xs text-gray-500">{r.ingredientes?.length ?? 0} ingredientes</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Autor: <span className="font-mono">{r.autor}</span></p>
            </li>
            ))}
            {!loading && !error && lista.length === 0 && (
            <li className="text-sm text-gray-500">No hay resultados…</li>
            )}
        </ul>
        </div>
    );
}
