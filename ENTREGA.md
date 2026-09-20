# Entrega: Optimización de Transferencia de Datos con TanStack Query

**Curso:** KODIGO — Optimización de Aplicaciones Modernas con Next.js y TanStack Query
**Proyecto:** PokeQuery Lab (Pokédex)
**Autor:** Jonathan Rivas
**Repositorio:** https://github.com/javacachava/pokedex
**Deploy:** https://pokedex-query-lab.vercel.app

## Stack

- Next.js 16 (App Router) y React Server Components
- TanStack Query v5
- TypeScript
- PokéAPI (https://pokeapi.co/)

## Funcionalidades implementadas

| Requisito | Implementación |
| --- | --- |
| Lista de Pokémon en servidor | `app/page.tsx` (RSC) carga 60 Pokémon con nombre e imagen en tarjetas |
| Paginación / infinite scroll | `useInfiniteQuery` con `IntersectionObserver` en `components/pokemon-grid.tsx` |
| Prefetch en hover | `prefetchQuery` en `onMouseEnter` (y `onFocus`): Pokémon, especie y cadena evolutiva |
| Hydration Boundary | `HydrationBoundary` con `dehydrate` en la lista y en el detalle |
| Página de detalle | `/pokemon/[name]`: stats, tipos, habilidades, evolución y sprites |
| Caché | `staleTime` de 24 h y `gcTime` de 7 días (`lib/query-client.ts`) |
| Carga y errores | `loading.tsx`, `error.tsx`, `not-found.tsx` |

## Estrategia de caché

Documentada en el [README](README.md#decisiones-tecnicas). Todas las consultas usan `staleTime: 24 * 60 * 60 * 1000`; `gcTime` es de 7 días. PokeAPI también se revalida en el servidor cada 24 horas mediante `next.revalidate`.

## Cómo ejecutar

```bash
git clone https://github.com/javacachava/pokedex.git
cd pokedex
npm install
npm run dev
```

Abrir `http://localhost:3000`. Verificación: `npm run typecheck` y `npm run build`.
