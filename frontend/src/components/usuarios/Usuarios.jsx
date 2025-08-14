'use client';
import { useEffect, useState } from 'react';
import { listarUsuarios } from '@/services/usuarios';
import Spinner from '@/components/Spinner';

export default function Usuarios() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
        try { setData(await listarUsuarios()); }
        catch (e) { setErr(e.message); }
        finally { setLoading(false); }
        })();
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Usuarios</h3>
                {loading && <Spinner />}
            </div>

            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

            <ul className="mt-3 divide-y divide-gray-100">
                {data.map(u => (
                    <li key={u._id} className="py-2">
                        <p className="font-medium">{u.nombre}</p>
                        <p className="text-sm text-gray-500">email: {u.email}</p>
                        <p className="text-sm text-gray-500">id: {u._id}</p>
                    </li>
                ))}
            </ul>
            {!loading && !err && data.length === 0 && (
                <p className="text-sm text-gray-500">No hay usuarios aún.</p>
            )}
        </div>
    );
}
