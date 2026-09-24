import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-white">
      <h1 className="text-3xl font-semibold">🎬 Movie Watchlist</h1>
      <div className="flex gap-4">
        <Link href="/search" className="rounded bg-red-600 px-4 py-2">
          Search Movies
        </Link>
        <Link href="/watchlist" className="rounded bg-zinc-800 px-4 py-2">
          My Watchlist
        </Link>
        <Link href="/login" className="rounded bg-zinc-800 px-4 py-2">
          Login
        </Link>
      </div>
    </div>
  )
}