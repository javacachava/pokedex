# PokeQuery Lab

Aplicacion de la actividad de la Semana 13: una Pokedex construida con Next.js 16, App Router, React Server Components, TypeScript y TanStack Query v5.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Decisiones tecnicas

- `app/page.tsx` es un React Server Component. Solicita 60 Pokemon desde PokeAPI y deja la respuesta en una `QueryClient` server-side.
- `HydrationBoundary` transfiere la lista deshidratada al cliente. `PokemonGrid` es el unico componente interactivo de la pagina principal.
- Cada tarjeta dispara `prefetchQuery` en `onMouseEnter` y `onFocus`, dejando precargado el detalle antes de navegar.
- `app/pokemon/[name]/page.tsx` es una ruta dinamica server-side. Precarga el Pokemon, su especie y la cadena evolutiva; el cliente recibe esos datos hidratados sin una segunda carga inicial.
- Todas las consultas usan `staleTime: 24 * 60 * 60 * 1000` (24 horas). `gcTime` se fija en 7 dias para conservar en memoria los datos que el usuario ya consulto. PokeAPI tambien se revalida en el servidor cada 24 horas mediante `fetch` con `next.revalidate`.
- La lista usa carga inicial server-side (60 Pokemon, superando el minimo de 50) y luego `useInfiniteQuery` en el cliente: un `IntersectionObserver` sobre un sentinel al final de la grilla dispara `fetchNextPage()` y agrega lotes de 60 mientras el usuario hace scroll (infinite scroll), usando `next` de PokeAPI para calcular el siguiente `offset`.

## Verificacion

```bash
npm run typecheck
npm run build
```

La aplicacion muestra estados de carga, error y 404, y consume datos tipados de PokeAPI.
