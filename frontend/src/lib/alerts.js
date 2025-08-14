'use client';
import Swal from 'sweetalert2';

export const toast = (icon, title) =>
    Swal.fire({ icon, title, toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });

export const confirm = (text = '¿Estás seguro?') =>
    Swal.fire({
        icon: 'warning',
        title: 'Confirmar acción',
        text,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
    });

export const promptEditUser = async (user) => {
    const { value } = await Swal.fire({
        title: 'Editar usuario',
        html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${user.nombre || ''}">
        <input id="swal-email" type="email" class="swal2-input" placeholder="Email" value="${user.email || ''}">
        `,
        focusConfirm: false,
        preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value.trim();
        const email  = document.getElementById('swal-email').value.trim();
        if (!nombre || !email) {
            Swal.showValidationMessage('Nombre y email son obligatorios');
            return false;
        }
        return { nombre, email };
        }
    });
    return value; // {nombre, email} | undefined
};

export const promptEditRecipe = async (receta) => {
    const { value } = await Swal.fire({
        title: 'Editar receta',
        html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${receta.nombre || ''}">
        <textarea id="swal-instrucciones" class="swal2-textarea" placeholder="Instrucciones">${receta.instrucciones || ''}</textarea>
        `,
        focusConfirm: false,
        preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value.trim();
        const instrucciones = document.getElementById('swal-instrucciones').value.trim();
        if (!nombre || !instrucciones) {
            Swal.showValidationMessage('Nombre e instrucciones son obligatorios');
            return false;
        }
        return { nombre, instrucciones };
        }
    });
  return value; // {nombre, instrucciones} | undefined
};

export const promptIngredientes = async () => {
    const { value } = await Swal.fire({
        title: 'Agregar ingredientes',
        html: `
        <p class="swal2-html-container" style="margin:0 0 8px">Formato: <code>nombre|cantidad|unidad</code> (uno por línea)</p>
        <textarea id="swal-ings" class="swal2-textarea" placeholder="Sal|1|cdita\nPimienta|1|cdita"></textarea>
        `,
        focusConfirm: false,
        preConfirm: () => {
        const txt = document.getElementById('swal-ings').value || '';
        const list = txt.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
            const [nombre, cantidad, unidad] = l.split('|').map(x => (x || '').trim());
            if (!nombre) return null;
            const out = { nombre };
            if (cantidad) out.cantidad = cantidad;
            if (unidad) out.unidad = unidad;
            return out;
        }).filter(Boolean);
        if (!list.length) {
            Swal.showValidationMessage('Escribe al menos 1 ingrediente');
            return false;
        }
        return list;
        }
    });
    
    return value; // Array<{nombre,cantidad?,unidad?}> | undefined
};
