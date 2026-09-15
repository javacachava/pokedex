import Link from "next/link";

export default function NotFound() {
  return <main className="page-shell"><div className="error-state"><p className="eyebrow">404 / Pokédex</p><h1>Ese Pokémon no está aquí.</h1><Link className="button" href="/">Volver al inicio</Link></div></main>;
}
