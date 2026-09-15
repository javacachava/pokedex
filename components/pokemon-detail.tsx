"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { flattenEvolutionChain, getArtwork, getEvolutionChain, getPokemon, getPokemonSpecies, PokemonDetail as PokemonDetailData, EvolutionChainResponse } from "@/lib/pokeapi";

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PokemonDetail({ initialPokemon, initialEvolution }: { initialPokemon: PokemonDetailData; initialEvolution: EvolutionChainResponse }) {
  const pokemonQuery = useQuery({
    queryKey: ["pokemon", "detail", initialPokemon.name],
    queryFn: () => getPokemon(initialPokemon.name),
    initialData: initialPokemon
  });
  const speciesQuery = useQuery({
    queryKey: ["pokemon", "species", initialPokemon.id],
    queryFn: () => getPokemonSpecies(initialPokemon.id)
  });
  const evolutionQuery = useQuery({
    queryKey: ["pokemon", "evolution", initialPokemon.id],
    queryFn: async () => {
      const species = speciesQuery.data ?? await getPokemonSpecies(initialPokemon.id);
      return getEvolutionChain(species.evolution_chain.url);
    },
    initialData: initialEvolution
  });

  const pokemon = pokemonQuery.data;
  const evolution = evolutionQuery.data;
  const artwork = pokemon.sprites.other?.["official-artwork"]?.front_default ?? getArtwork(pokemon);

  return (
    <main className="page-shell detail-shell">
      <Link className="back-link" href="/">← Volver a la Pokédex</Link>
      <article className="detail-hero">
        <div className="detail-art"><img src={artwork} alt={pokemon.name} width="360" height="360" /></div>
        <div className="detail-copy">
          <p className="eyebrow">Pokémon #{String(pokemon.id).padStart(3, "0")}</p>
          <h1>{titleCase(pokemon.name)}</h1>
          <div className="type-list">{pokemon.types.map(({ type }) => <span className="type-pill" key={type.name}>{type.name}</span>)}</div>
          <dl className="measurements"><div><dt>Altura</dt><dd>{(pokemon.height / 10).toFixed(1)} m</dd></div><div><dt>Peso</dt><dd>{(pokemon.weight / 10).toFixed(1)} kg</dd></div><div><dt>Experiencia base</dt><dd>{pokemon.base_experience ?? "-"}</dd></div></dl>
        </div>
      </article>
      <div className="detail-columns">
        <section className="detail-panel"><p className="eyebrow">Perfil</p><h2>Estadísticas base</h2><div className="stats-list">{pokemon.stats.map(({ stat, base_stat }) => <div className="stat-row" key={stat.name}><span>{stat.name.replace("-", " ")}</span><strong>{base_stat}</strong><span className="stat-track"><i style={{ width: `${Math.min(base_stat / 2.55, 100)}%` }} /></span></div>)}</div></section>
        <section className="detail-panel"><p className="eyebrow">Habilidades</p><h2>Lo que sabe hacer</h2><ul className="ability-list">{pokemon.abilities.map(({ ability, is_hidden }) => <li key={ability.name}><span>{titleCase(ability.name.replace("-", " "))}</span>{is_hidden && <small>Oculta</small>}</li>)}</ul><p className="eyebrow evolution-label">Evolución</p><div className="evolution-list">{flattenEvolutionChain(evolution.chain).map((name, index) => <span key={`${name}-${index}`}><Link href={`/pokemon/${name}`}>{titleCase(name)}</Link>{index < flattenEvolutionChain(evolution.chain).length - 1 && <b>→</b>}</span>)}</div></section>
      </div>
    </main>
  );
}
