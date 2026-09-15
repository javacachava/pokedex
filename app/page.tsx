import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PokemonGrid } from "@/components/pokemon-grid";
import { getPokemonList } from "@/lib/pokeapi";
import { createQueryClient } from "@/lib/query-client";

export default async function HomePage() {
  const queryClient = createQueryClient();
  const initialData = await getPokemonList(60, 0);
  queryClient.setQueryData(["pokemon", "list"], { pages: [initialData], pageParams: [0] });

  return (
    <main className="page-shell">
      <header className="site-header"><span className="brand-mark">PQ</span><span>PokeQuery Lab</span><span className="header-status">LIVE DATA / POKEAPI</span></header>
      <section className="intro"><p className="eyebrow">TanStack Query · Next.js 16</p><h1>Explora el universo<br /><em>Pokémon.</em></h1><p className="intro-copy">Una Pokédex rápida, hidratada en servidor y preparada para anticiparse a tu próximo clic.</p><div className="intro-meta"><span><strong>{initialData.results.length}</strong> especies cargadas</span><span><strong>24 h</strong> caché fresca</span></div></section>
      <HydrationBoundary state={dehydrate(queryClient)}><PokemonGrid initialData={initialData} /></HydrationBoundary>
      <footer className="site-footer">Datos proporcionados por <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a><span>Construido para el Módulo 4 · Semana 13</span></footer>
    </main>
  );
}
