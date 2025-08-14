'use client';
import { useEffect, useState } from 'react';
import { listarRecetas } from '@/services/recetas';
import Spinner from '@/components/Spinner';

export default function RecetasList({ filtro = {} }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
        try { setData(await listarRecetas(filtro)); }
        catch (e) { setErr(e.message); }
        finally { setLoading(false); }
        })();
    }, [JSON.stringify(filtro)]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recetas</h3>
                {loading && <Spinner />}
            </div>

            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {data.map(r => (
                    <li key={r._id} className="rounded-xl border border-gray-200 p-4">
                        <h4 className="font-medium">{r.nombre}</h4>
                        <p className="mt-1 text-xs text-gray-500">
                            Autor: <span className="font-mono">{r.autor}</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{r.ingredientes?.length ?? 0} ingredientes</p>
                    </li>
                ))}
            </ul>

            {!loading && !err && data.length === 0 && (
                <p className="text-sm text-gray-500">No hay recetas aún.</p>
            )}
        </div>
    );
}
