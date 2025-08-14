'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    obtenerUsuario,
    recetasDeUsuario,
    actualizarUsuario,
    eliminarUsuario,
} from '@/services/usuarios';
import { confirm, promptEditUser, toast } from '@/lib/alerts';

export default function UsuarioDetail() {
    const router = useRouter();
    const params = useParams(); // <- ✅
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [usuario, setUsuario] = useState(null);
    const [recetas, setRecetas] = useState([]);

    const reload = async () => {
        if (!id) return;
        try {
        const [u, rs] = await Promise.all([obtenerUsuario(id), recetasDeUsuario(id)]);
        setUsuario(u);
        setRecetas(rs);
        } catch (e) {
        toast('error', e.message);
        }
    };

    useEffect(() => { if (id) reload(); }, [id]);

    const onEditar = async () => {
        const data = await promptEditUser(usuario);
        if (!data) return;
        try {
        await actualizarUsuario(id, data);
        toast('success', 'Usuario actualizado');
        reload();
        } catch (e) { toast('error', e.message); }
    };

    const onEliminar = async () => {
        const ok = (await confirm('Eliminará el usuario y TODAS sus recetas.')).isConfirmed;
        if (!ok) return;
        try {
        await eliminarUsuario(id);
        toast('success', 'Usuario eliminado');
        router.push('/usuarios'); // <- ✅
        } catch (e) { toast('error', e.message); }
    };

    if (!id) return <div className="p-6">Cargando…</div>;
    if (!usuario) return <div className="p-6">Cargando usuario…</div>;

    return (
        <div className="mx-auto max-w-5xl p-6 space-y-6">
        <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Usuario</h1>
            <Link href="/usuarios" className="text-sm text-gray-600 hover:underline">← Volver</Link>
        </header>

        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">ID: <code>{usuario._id}</code></p>
                <h2 className="text-lg font-semibold">{usuario.nombre}</h2>
                <p className="text-gray-600">{usuario.email}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={onEditar} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Editar</button>
                <button onClick={onEliminar} className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100">Eliminar</button>
            </div>
            </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <h3 className="mb-2 text-lg font-semibold">Recetas de este usuario</h3>
            <ul className="grid gap-3 md:grid-cols-2">
            {recetas.map(r => (
                <li key={r._id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">{r.nombre}</h4>
                    <Link href={`/recetas/${r._id}`} className="text-sm text-gray-600 hover:underline">Ver</Link>
                </div>
                <p className="mt-1 text-xs text-gray-500">{r.ingredientes?.length ?? 0} ingredientes</p>
                </li>
            ))}
            {recetas.length === 0 && <li className="text-gray-500">No tiene recetas.</li>}
            </ul>
        </div>
        </div>
    );
}
