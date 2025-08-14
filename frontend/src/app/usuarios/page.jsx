'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listarUsuarios, crearUsuario, eliminarUsuario, actualizarUsuario } from '@/services/usuarios';
import { toast, confirm, promptEditUser } from '@/lib/alerts';

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const reload = async () => {
        setLoading(true);
        try { setUsuarios(await listarUsuarios()); }
        finally { setLoading(false); }
    };

    useEffect(() => { reload(); }, []);

    async function onCrear(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = { nombre: fd.get('nombre'), email: fd.get('email'), password: fd.get('password') };
        try {
        await crearUsuario(payload);
        toast('success', 'Usuario creado');
        e.currentTarget.reset();
        reload();
        } catch (err) {
        toast('error', err.message);
        }
    }

    async function onEditar(u) {
        const data = await promptEditUser(u);
        if (!data) return;
        try {
        await actualizarUsuario(u._id, data);
        toast('success', 'Usuario actualizado');
        reload();
        } catch (err) {
        toast('error', err.message);
        }
    }

    async function onEliminar(id) {
        const ok = (await confirm('Eliminará el usuario y todas sus recetas.')).isConfirmed;
        if (!ok) return;
        try {
        await eliminarUsuario(id);
        toast('success', 'Usuario eliminado');
        reload();
        } catch (err) {
        toast('error', err.message);
        }
    }

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-6">
        <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <Link href="/" className="text-sm text-gray-600 hover:underline">← Volver</Link>
        </header>

        {/* Crear */}
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <h2 className="mb-2 text-lg font-semibold">Registrar nuevo usuario</h2>
            <form onSubmit={onCrear} className="grid gap-3 md:grid-cols-4">
            <input name="nombre" placeholder="Nombre" required className="rounded-xl border border-gray-300 px-3 py-2 text-sm" />
            <input name="email" type="email" placeholder="Email" required className="rounded-xl border border-gray-300 px-3 py-2 text-sm" />
            <input name="password" type="password" placeholder="Password" required className="rounded-xl border border-gray-300 px-3 py-2 text-sm" />
            <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90">Crear</button>
            </form>
        </div>

        {/* Lista */}
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Todos los usuarios</h2>
            {loading && <span className="text-sm text-gray-500">Cargando…</span>}
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-gray-600">
                <tr>
                    <th className="py-2">Nombre</th>
                    <th>Email</th>
                    <th className="w-56">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {usuarios.map(u => (
                    <tr key={u._id}>
                    <td className="py-2">{u.nombre}</td>
                    <td>{u.email}</td>
                    <td className="flex flex-wrap gap-2 py-2">
                        <Link href={`/usuarios/${u._id}`} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Ver</Link>
                        <button onClick={() => onEditar(u)} className="rounded-lg border px-3 py-1 hover:bg-gray-50">Editar</button>
                        <button onClick={() => onEliminar(u._id)} className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100">Eliminar</button>
                    </td>
                    </tr>
                ))}
                {!loading && usuarios.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-gray-500">No hay usuarios.</td></tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}
