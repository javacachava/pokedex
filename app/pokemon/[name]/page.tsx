import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { PokemonDetail } from "@/components/pokemon-detail";
import { createQueryClient } from "@/lib/query-client";
import { getEvolutionChain, getPokemon, getPokemonSpecies } from "@/lib/pokeapi";

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const queryClient = createQueryClient();
  try {
    const pokemon = await getPokemon(name);
    const species = await getPokemonSpecies(pokemon.id);
    const evolution = await getEvolutionChain(species.evolution_chain.url);
    queryClient.setQueryData(["pokemon", "detail", pokemon.name], pokemon);
    queryClient.setQueryData(["pokemon", "species", pokemon.id], species);
    queryClient.setQueryData(["pokemon", "evolution", pokemon.id], evolution);
    return <HydrationBoundary state={dehydrate(queryClient)}><PokemonDetail initialPokemon={pokemon} initialEvolution={evolution} /></HydrationBoundary>;
  } catch {
    notFound();
  }
}
