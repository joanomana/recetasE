'use client';
import { useState } from 'react';
import CrearUsuarioForm from '@/components/usuarios/CrearUsuario';
import CrearRecetaForm from '@/components/recetas/CrearReceta';
import BuscarPorIngrediente from '@/components/recetas/BuscarIngrediente';
import UsuariosList from '@/components/usuarios/Usuarios';
import RecetasList from '@/components/recetas/Recetas';
import Link from 'next/link';

export default function Home() {
  const [lastUser, setLastUser] = useState(null);
  const [lastRecipe, setLastRecipe] = useState(null);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plataforma de Recetas Frontend</h1>
        <a className="text-sm text-gray-500" href="http://localhost:3000/docs" target="_blank" rel="noopener noreferrer">
          Click para acceder a la documentación
        </a>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CrearUsuarioForm onCreated={setLastUser} />
        <CrearRecetaForm onCreated={setLastRecipe} />
      </section>

      <BuscarPorIngrediente />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UsuariosList />
        <RecetasList />
      </section>

      <footer className="text-sm text-gray-500">
        {lastUser && <>Último usuario: <code>{lastUser._id}</code> · </>}
        {lastRecipe && <>Última receta: <code>{lastRecipe._id}</code></>}
      </footer>
    </main>
  );
}
