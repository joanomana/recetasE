import { api } from '@/lib/api';

export const crearReceta = (payload) =>
    api('/api/recetas', { method: 'POST', body: payload });

export const listarRecetas = (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/api/recetas${q ? `?${q}` : ''}`);
};

export const obtenerReceta = (id) =>
    api(`/api/recetas/${id}`);

export const actualizarReceta = (id, payload) =>
    api(`/api/recetas/${id}`, { method: 'PUT', body: payload });

export const eliminarReceta = (id) =>
    api(`/api/recetas/${id}`, { method: 'DELETE' });

export const buscarPorIngrediente = (nombre) =>
    api(`/api/recetas?ingrediente=${encodeURIComponent(nombre)}`);

export const agregarIngredientes = (id, ingredientes) =>
    api(`/api/recetas/${id}/ingredientes`, {
    method: 'POST',
    body: { ingredientes },
});

export const listarIngredientes = (id) =>
    api(`/api/recetas/${id}/ingredientes`);

export const eliminarIngrediente = (id, ingredienteId) =>
    api(`/api/recetas/${id}/ingredientes/${ingredienteId}`, { method: 'DELETE' });
