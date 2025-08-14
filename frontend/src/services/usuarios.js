import { api } from '@/lib/api';

export const crearUsuario = (payload) =>
    api('/api/usuarios', { method: 'POST', body: payload });

export const listarUsuarios = () =>
    api('/api/usuarios');

export const obtenerUsuario = (id) =>
    api(`/api/usuarios/${id}`);

export const actualizarUsuario = (id, payload) =>
    api(`/api/usuarios/${id}`, { method: 'PUT', body: payload });

export const eliminarUsuario = (id) =>
    api(`/api/usuarios/${id}`, { method: 'DELETE' });

export const recetasDeUsuario = (id) =>
    api(`/api/usuarios/${id}/recetas`);
