'use client';
import { useState } from 'react';
import { crearUsuario } from '@/services/usuarios';
import Spinner from '@/components/Spinner';

export default function CrearUsuarioForm({ onCreated }) {
    const [loading, setLoading] = useState(false);
    const [out, setOut] = useState(null);
    const [error, setError] = useState(null);

    async function onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;           
        setLoading(true); setError(null); setOut(null);

        const fd = new FormData(form);
        const payload = {
            nombre: fd.get('nombre'),
            email: fd.get('email'),
            password: fd.get('password'),
        };

        try {
            const data = await crearUsuario(payload);  
            setOut(data);
            onCreated?.(data);
            form?.reset();                         
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Crear usuario</h3>
            <p className="text-sm text-gray-500 mb-4">Registra un nuevo usuario en la plataforma.</p>

            {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
                </div>
            )}
            {out && (
                <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Usuario creado: <span className="font-mono">{out._id}</span>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        name="nombre" required
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400"
                        placeholder="Ana Gómez"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email" type="email" required
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                        placeholder="ana@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        name="password" type="password" required
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60 hover:cursor-pointer"
                    >
                    {loading && <Spinner className="w-4 h-4 mr-2" />} Crear
                </button>
            </form>
        </div>
    );
}
