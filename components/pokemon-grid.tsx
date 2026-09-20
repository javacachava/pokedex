"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getArtwork, getEvolutionChain, getPokemon, getPokemonSpecies, getPokemonList, PokemonListResponse } from "@/lib/pokeapi";

const PAGE_SIZE = 60;
const listKey = ["pokemon", "list"];

function nextOffset(page: PokemonListResponse): number | undefined {
  if (!page.next) return undefined;
  return Number(new URL(page.next).searchParams.get("offset"));
}

export function PokemonGrid({ initialData }: { initialData: PokemonListResponse }) {
  const queryClient = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: listKey,
    queryFn: ({ pageParam }) => getPokemonList(PAGE_SIZE, pageParam),
    initialPageParam: 0,
    getNextPageParam: nextOffset,
    initialData: { pages: [initialData], pageParams: [0] }
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  async function prefetchPokemon(name: string) {
    const pokemon = await queryClient.fetchQuery({
      queryKey: ["pokemon", "detail", name],
      queryFn: () => getPokemon(name)
    });
    const species = await queryClient.fetchQuery({
      queryKey: ["pokemon", "species", pokemon.id],
      queryFn: () => getPokemonSpecies(pokemon.id)
    });
    await queryClient.prefetchQuery({
      queryKey: ["pokemon", "evolution", pokemon.id],
      queryFn: () => getEvolutionChain(species.evolution_chain.url)
    });
  }

  const pokemonList = data.pages.flatMap((page) => page.results);

  return (
    <>
      <section className="pokemon-grid" aria-label="Lista de Pokémon">
        {pokemonList.map((pokemon, index) => (
          <Link
            className="pokemon-card"
            href={`/pokemon/${pokemon.name}`}
            key={pokemon.name}
            onMouseEnter={() => void prefetchPokemon(pokemon.name).catch(() => undefined)}
            onFocus={() => void prefetchPokemon(pokemon.name).catch(() => undefined)}
            style={{ "--delay": `${Math.min(index % PAGE_SIZE, 12) * 35}ms` } as React.CSSProperties}
          >
            <span className="card-number">#{String(index + 1).padStart(3, "0")}</span>
            <img src={getArtwork(pokemon)} alt="" width="180" height="180" loading={index < 8 ? "eager" : "lazy"} />
            <span className="card-name">{pokemon.name}</span>
            <span className="card-action">Ver detalles <span aria-hidden="true">↗</span></span>
          </Link>
        ))}
      </section>
      <div ref={sentinelRef} className="grid-sentinel" aria-hidden="true" />
      <p className="grid-status">
        {isFetchingNextPage
          ? "Cargando más Pokémon..."
          : hasNextPage
            ? "Desplázate para cargar más"
            : `${pokemonList.length} Pokémon cargados — llegaste al final.`}
      </p>
    </>
  );
}
