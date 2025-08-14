'use client';
import { useState } from 'react';
import Link from 'next/link';

// Tus componentes (mantengo tus nombres/rutas)
import CrearUsuarioForm from '@/components/usuarios/CrearUsuario';
import CrearRecetaForm from '@/components/recetas/CrearReceta';
import BuscarPorIngrediente from '@/components/recetas/BuscarIngrediente';
import UsuariosList from '@/components/usuarios/Usuarios';
import RecetasList from '@/components/recetas/Recetas';

export default function Home() {
  const [lastUser, setLastUser] = useState(null);
  const [lastRecipe, setLastRecipe] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  return (
    <main className="mx-auto max-w-7xl p-6">
      <header className="rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 p-1 shadow-lg">
        <div className="rounded-2xl bg-white/70 px-6 py-5 backdrop-blur-xl ">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Plataforma de Recetas <span className="text-gray-500">Frontend</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                API activa
              </span>
              <Link
                href={`${API}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M5 7v13h13" />
                </svg>
                Documentación
              </Link>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Backend: <code className="rounded bg-gray-100 px-2 py-1">{API}</code>
          </p>
          <div className='mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <Link href="/usuarios" className="rounded-xl border px-4 py-2 hover:bg-white/70">Gestionar usuarios</Link>
            <Link href="/recetas"  className="rounded-xl border px-4 py-2 hover:bg-white/70">Gestionar recetas</Link>
          </div>
          
        </div>

      </header>


      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <CrearUsuarioForm onCreated={setLastUser} />
          <CrearRecetaForm onCreated={setLastRecipe} />
      </section>


      <section className="mt-6">

        <BuscarPorIngrediente />
      </section>


      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <UsuariosList />


          <RecetasList />
      </section>

      <footer className="mt-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {lastUser && (
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
              Último usuario:
              <code className="rounded bg-white/80 px-2 py-0.5 text-blue-700">{lastUser._id}</code>
            </span>
          )}
          {lastRecipe && (
            <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1">
              Última receta:
              <code className="rounded bg-white/80 px-2 py-0.5 text-fuchsia-700">{lastRecipe._id}</code>
            </span>
          )}
        </div>
      </footer>
    </main>
  );
}
