const API_URL = process.env.NEXT_PUBLIC_POKEAPI_URL ?? "https://pokeapi.co/api/v2";

export const POKEMON_STALE_TIME = 24 * 60 * 60 * 1000;
export const POKEMON_GC_TIME = 7 * 24 * 60 * 60 * 1000;

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedResource;
}

export interface PokemonAbility {
  ability: NamedResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  species: NamedResource;
}

export interface EvolutionNode {
  species: NamedResource;
  evolves_to: EvolutionNode[];
}

export interface EvolutionChainResponse {
  chain: EvolutionNode;
}

export interface PokemonSpecies {
  evolution_chain: NamedResource;
}

async function fetchPokeApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 86400 }
  });

  if (!response.ok) {
    throw new Error(`PokeAPI request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getPokemonList(limit = 60, offset = 0) {
  return fetchPokeApi<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
}

export function getPokemon(identifier: string | number) {
  return fetchPokeApi<PokemonDetail>(`/pokemon/${identifier}`);
}

export function getPokemonSpecies(identifier: string | number) {
  return fetchPokeApi<PokemonSpecies>(`/pokemon-species/${identifier}`);
}

export function getEvolutionChain(url: string) {
  return fetch(url, { next: { revalidate: 86400 } }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Evolution request failed: ${response.status}`);
    }
    return response.json() as Promise<EvolutionChainResponse>;
  });
}

export function getArtwork(pokemon: PokemonListItem | PokemonDetail): string {
  const id = typeof pokemon === "object" && "id" in pokemon
    ? pokemon.id
    : pokemon.url.split("/").filter(Boolean).pop();
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function flattenEvolutionChain(node: EvolutionNode): string[] {
  return [node.species.name, ...node.evolves_to.flatMap(flattenEvolutionChain)];
}
