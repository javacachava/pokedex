"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-shell"><div className="error-state">
      <p className="eyebrow">Error de conexión</p>
      <h1>No pudimos cargar los Pokémon.</h1>
      <button className="button" onClick={reset}>Reintentar</button>
    </div></main>
  );
}
