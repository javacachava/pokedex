import { QueryClient } from "@tanstack/react-query";
import { POKEMON_GC_TIME, POKEMON_STALE_TIME } from "@/lib/pokeapi";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: POKEMON_STALE_TIME,
        gcTime: POKEMON_GC_TIME,
        retry: 2,
        refetchOnWindowFocus: false
      }
    }
  });
}
