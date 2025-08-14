import './globals.css';

export const metadata = {
  title: 'Recetas',
  description: 'Frontend Next.js + Tailwind para la API de Recetas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 text-gray-900 antialiased">
        {/* --- Fondo global: blobs y brillos (fijos en todo el sitio) --- */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* blob arriba-izquierda */}
          <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-amber-400/40 to-rose-500/40 blur-3xl" />
          {/* blob abajo-derecha */}
          <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-sky-400/40 to-violet-500/40 blur-3xl" />
          {/* resplandor radial suave al centro */}
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_10%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_60%)]" />
        </div>

        {/* contenido de la app */}
        {children}
      </body>
    </html>
  );
}
